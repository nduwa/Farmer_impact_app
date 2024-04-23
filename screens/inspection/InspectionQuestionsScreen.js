import {
  Dimensions,
  FlatList,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import InspectionQuestion from "../../components/InspectionQuestion";
import { SyncModal } from "../../components/SyncModal";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { InspectionHoverSubmitBtn } from "../../components/InspectionHoverSubmitBtn";
import { InspectionHoverPrevBtn } from "../../components/InspectionHoverPrevBtn";
import { dataTodb } from "../../helpers/dataTodb";
import { useDispatch, useSelector } from "react-redux";

export const InspectionQuestionsScreen = ({ route }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const userData = useSelector((state) => state.user);

  const { data } = route.params;

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [exitModal, setExitModal] = useState({ open: false, label: "" });
  const [validationModal, setvalidationModal] = useState({
    open: false,
    label: "",
  });
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [language, setLanguage] = useState("kiny");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [qnStart, setQnStart] = useState(0);
  const [qnEnd, setQnEnd] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [currentJob, setCurrentJob] = useState("");
  const [insertedInspection, setInsertedInspection] = useState();
  const [submitted, setSubmitted] = useState(false);

  const [info, setInfo] = useState({});

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const handleBackButton = () => {
    if (!submitted && questions.length > 0 && !exitModal.open) {
      setExitModal({
        open: true,
        label:
          "You haven't submitted the inspection, unsubmitted answers can not be recovered. are you sure?",
      });
      return;
    }
    if (data?.inspectionType?.toLowerCase().includes("advanced")) {
      navigation.navigate("inspectionCourses", {
        data: {
          inspectionType: data.inspectionType,
          farmerId: data.farmerId,
          farmerName: data.farmerName,
        },
      });
    } else {
      navigation.navigate("inspectionFarmer", {
        data: data.inspectionType,
      });
    }
  };

  const handleScoreStr = (str) => {
    let score_n = str.split(" ")[0];

    return score_n.toLowerCase();
  };

  const handleSubmit = () => {
    if (answers.length < questions.length) {
      setvalidationModal({
        open: true,
        label: "Can't submit, this inspection contains unanswered questions.",
      });
      return;
    }

    let inspectionDate = new Date();
    let kfHousehold = info._kf_Household;
    let submitData = [
      {
        ...info,
        _kf_Course: data.courseId || "",
        __kp_Inspection: "",
        uploaded: 0,
        inspection_at: inspectionDate.toISOString(),
        created_at: inspectionDate.toISOString(),
        uploaded_at: "0000-00-00",
        Score_n: handleScoreStr(data.inspectionType),
      },
    ];

    dataTodb({
      tableName: "inspections",
      setCurrentJob: setCurrentJob,
      syncData: submitData,
      setInsertId: setInsertedInspection,
      extraVal: kfHousehold,
    });

    // setInsertedInspection(970);
  };
  const handlePress = () => {
    if (currentPage >= totalPages) {
      setSubmitModalOpen(true);
    } else {
      let current = currentPage;
      let newpg = (current % totalPages) + 1; // a % b statement restricts value a from ever getting bigger than b.... :)
      setCurrentPage(newpg);
    }
  };

  const handlePrevPg = () => {
    let newpg = currentPage - 1;
    let newpg_fitted = newpg % totalPages; // fitted in the range 0 -> max page
    setCurrentPage(newpg_fitted);
  };

  const handleClose = () => {
    setSubmitModalOpen(false);
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleQnsPagination = () => {
    const totalQns = questions.length;
    const pages = Math.ceil(totalQns / limit);
    setTotalPages(pages);

    let start = (currentPage - 1) * limit;
    let end = start + limit;

    setQnStart(start);
    setQnEnd(end);

    let currentQns = questions.slice(start, end);

    setDisplayQuestions(currentQns);

    if (pages > 0) displayToast(`Page ${currentPage} of ${pages} loaded`);
  };

  const handleAnswer = (newAnswer) => {
    setAnswers([...answers, newAnswer]);
  };

  const fetchAnswer = (qnId) => {
    const answer = answers.find((item) => item.id === qnId);
    return answer;
  };

  useEffect(() => {
    if (currentJob === "Responses saved") {
      displayToast("Responses saved");
      setSubmitted(true);
    }
  }, [currentJob]);
  useEffect(() => {
    if (insertedInspection) {
      displayToast("Inspection saved");

      let responseSubmitData = [];
      let inspId = insertedInspection + 0;

      for (const answer of answers) {
        let response = {
          rtc_inspection_id: inspId,
          inspection_answer_id: answer.answer,
          deleted: 0,
          __kp_InspectionLog: "",
          created_at: new Date(),
        };

        responseSubmitData.push(response);
      }

      dataTodb({
        tableName: "inspectionResponses",
        syncData: responseSubmitData,
        setCurrentJob,
        extraVal: inspId,
      });
    }
  }, [insertedInspection]);

  useEffect(() => {
    handleQnsPagination();
    scrollToTop();
  }, [currentPage]);

  useEffect(() => {
    if (displayQuestions.length > 0) {
      console.log("all questions loaded");
    }
  }, [displayQuestions.length]);

  useEffect(() => {
    if (questions.length > 0) {
      handleQnsPagination();
    }
  }, [questions]);

  useFocusEffect(
    React.useCallback(() => {
      let inspectionStr = "";
      let query = null;

      if (data.inspectionType.toLowerCase().includes("generic"))
        inspectionStr = "Generic";
      else if (data.inspectionType.toLowerCase().includes("special"))
        inspectionStr = "Special";
      else if (data.inspectionType.toLowerCase().includes("cafe"))
        inspectionStr = "CAFE";
      else if (data.inspectionType.toLowerCase().includes("rfa"))
        inspectionStr = "RFA";
      else if (data.inspectionType.toLowerCase().includes("advanced"))
        inspectionStr = "Advanced";

      if (inspectionStr === "") return;

      if (inspectionStr === "Advanced" && data.courseId) {
        retrieveDBdataAsync({
          filterCol: "_kf_course",
          filterValue: data.courseId,
          tableName: "inspection_questions",
        })
          .then((results) => {
            if (results.length > 0) {
              setQuestions(results);
            }
          })
          .catch((err) => console.log(err));
      } else {
        retrieveDBdataAsync({
          filterCol: "evaluation_mode",
          filterValue: inspectionStr,
          tableName: "inspection_questions",
          customQuery: query,
        })
          .then((results) => {
            if (results.length > 0) {
              setQuestions(results);
            }
          })
          .catch((err) => console.log(err));
      }

      let userInfo = {
        latitude: userData.location.coords.latitude,
        longitude: userData.location.coords.longitude,
        _kf_Station: userData.userData.staff._kf_Station,
        _kf_Supplier: userData.userData.staff._kf_Supplier,
        created_by: userData.userData.user.Name_User,
        _kf_Household: data.householdId,
      };

      setInfo(userInfo);

      return () => {
        setAnswers([]);
        setQuestions([]);
        setCurrentPage(1);
        setDisplayQuestions([]);
        setSubmitted(false);
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg_variant,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: screenHeight * 0.11,
          backgroundColor: colors.white,
          paddingTop: screenHeight * 0.042,
          padding: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            padding: screenWidth * 0.005,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
          }}
        >
          {data.inspectionType}
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ flex: 1, padding: screenHeight * 0.01 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.white,
            padding: screenHeight * 0.02,
            borderRadius: screenHeight * 0.01,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: screenHeight * 0.02, fontWeight: "700" }}>
            {data.farmerId} / {data.farmerName}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            contentContainerStyle={{
              padding: screenHeight * 0.01,
              gap: screenHeight * 0.001,
            }}
            data={displayQuestions}
            initialNumToRender={6}
            renderItem={({ item, index }) => (
              <InspectionQuestion
                data={{
                  type: data.inspectionType,
                  question: item,
                  index: qnStart + index,
                  language,
                }}
                currentAnswer={fetchAnswer(item.id)}
                question={item}
                setQnAnswer={handleAnswer}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      {currentPage > 1 && <InspectionHoverPrevBtn handlePress={handlePrevPg} />}
      {questions.length > 0 && (
        <InspectionHoverSubmitBtn
          handlePress={handlePress}
          currentPage={currentPage}
          totalPages={totalPages}
          active={!submitted}
        />
      )}

      {submitModalOpen && (
        <SyncModal
          label={`Are you sure you want to submit inspection now?`}
          onYes={() => {
            setSubmitModalOpen(false);
            handleSubmit();
          }}
          OnNo={handleClose}
        />
      )}

      {/* validation modal */}
      {validationModal.open && (
        <SyncModal
          label={validationModal.label}
          onYes={() =>
            setvalidationModal((prevState) => ({ ...prevState, open: false }))
          }
          OnNo={() =>
            setvalidationModal((prevState) => ({ ...prevState, open: false }))
          }
        />
      )}

      {/* exit modal */}
      {exitModal.open && (
        <SyncModal
          label={exitModal.label}
          onYes={handleBackButton}
          OnNo={() =>
            setExitModal((prevState) => ({ ...prevState, open: false }))
          }
        />
      )}
    </View>
  );
};
