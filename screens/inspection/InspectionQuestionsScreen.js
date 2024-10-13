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
import LottieView from "lottie-react-native";
import { getCurrentDate } from "../../helpers/getCurrentDate";
import { useTranslation } from "react-i18next";
import ProgressBar from "../../components/ProgressBar";

export const InspectionQuestionsScreen = ({ route }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [qnStart, setQnStart] = useState(0);
  const [qnEnd, setQnEnd] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [currentJob, setCurrentJob] = useState("");
  const [insertedInspection, setInsertedInspection] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [inspectionTitle, setInspectionTitle] = useState();

  const [info, setInfo] = useState({});
  const [progress, setProgress] = useState(0);

  const handleSync = () => {
    navigation.navigate("Sync", { data: null });
  };

  const scrollToTop = () => {
    flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleBackButton = () => {
    if (!submitted && questions.length > 0 && !exitModal.open) {
      setExitModal({
        open: true,
        label: t("inspection.exit_inspection"),
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
        label: t("inspection.submit_error"),
      });
      return;
    }

    let inspectionDate = getCurrentDate();
    let kfHousehold = info._kf_Household;
    let submitData = [
      {
        ...info,
        _kf_Course: data.courseId || "",
        __kp_Inspection: "",
        uploaded: 0,
        inspection_at: inspectionDate,
        created_at: inspectionDate,
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
  };
  const handlePress = () => {
    if (currentPage >= totalPages) {
      setSubmitModalOpen(true);
    } else {
      setLoadingPage(true);
      let current = currentPage;
      let newpg = (current % totalPages) + 1; // a % b statement restricts value a from ever getting bigger than b.... :)
      setCurrentPage(newpg);
    }
  };

  const handlePrevPg = () => {
    setLoadingPage(true);
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
    setLoadingData(false);
    setLoadingPage(false);

    if (pages > 0) displayToast(`Page ${currentPage} of ${pages} loaded`);
  };

  function findOrCreateOrUpdate(item) {
    let element = answers.find((ans) => ans.id === item.id);
    if (!element) {
      element = {
        id: item.id,
        answer: item.answer,
        explaination: item?.explaination || null,
        complianceDate: item?.complianceDate || null,
      };

      setAnswers([...answers, element]);
    } else {
      let allCurrentAnswers = answers;
      for (let ans of allCurrentAnswers) {
        if (ans.id === item.id) {
          ans.answer = item.answer;
          ans.explaination = item?.explaination || "";
          ans.complianceDate = item?.complianceDate || "";
        }
      }

      setAnswers(allCurrentAnswers);
    }
  }

  const handleAnswer = (newAnswer) => {
    findOrCreateOrUpdate(newAnswer);
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
          answer_explanaition: answer.explaination,
          compliance_date: answer.complianceDate || "",
          deleted: 0,
          __kp_InspectionLog: "",
          created_at: getCurrentDate(),
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

    if (totalPages > 0) {
      let ratio = currentPage / totalPages;
      console.log(`${currentPage} / ${totalPages} = ${ratio}`);

      setProgress(ratio);
    }
  }, [currentPage, totalPages]);

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

      if (data.inspectionType.toLowerCase().includes("generic")) {
        inspectionStr = "Generic";
        setInspectionTitle(t("inspection.inspection_list.generic_inspection"));
      } else if (data.inspectionType.toLowerCase().includes("special")) {
        inspectionStr = "Special";
        setInspectionTitle(t("inspection.inspection_list.special_inspection"));
      } else if (data.inspectionType.toLowerCase().includes("cafe")) {
        inspectionStr = "CAFE";
        setInspectionTitle(t("inspection.inspection_list.cafe_inspection"));
      } else if (data.inspectionType.toLowerCase().includes("rfa")) {
        inspectionStr = "RFA";
        setInspectionTitle(t("inspection.inspection_list.rfa_inspection"));
      } else if (data.inspectionType.toLowerCase().includes("advanced")) {
        inspectionStr = "Advanced";
        setInspectionTitle(t("inspection.inspection_list.advanced_inspection"));
      }

      if (inspectionStr === "") return;

      setLoadingData(true);

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
        setProgress(0);
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
          {inspectionTitle || data.inspectionType}
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
            gap: screenWidth * 0.025,
            backgroundColor: colors.white,
            padding: screenHeight * 0.02,
            borderRadius: screenHeight * 0.01,
            elevation: 4,
            zIndex: 11,
          }}
        >
          <Text style={{ fontSize: screenHeight * 0.02, fontWeight: "700" }}>
            {data.farmerId} / {data.farmerName}
          </Text>
          <ProgressBar progress={progress} />
        </View>
        <View style={{ flex: 1 }}>
          {loadingData && (
            <View
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                style={{
                  height: 160,
                  width: 160,
                  alignSelf: "center",
                  marginVertical: 30,
                }}
                source={require("../../assets/lottie/loader.json")}
                autoPlay
                speed={0.8}
                loop={true}
                resizeMode="cover"
              />
            </View>
          )}

          {displayQuestions.length > 0 ? (
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
                    language: currentLanguage,
                  }}
                  currentAnswer={fetchAnswer(item.id)}
                  question={item}
                  setQnAnswer={handleAnswer}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View
              style={{
                gap: screenHeight * 0.02,
              }}
            >
              <Text style={{ textAlign: "center" }}>
                {t("misc.sync_warning.no_questions_warning")}
              </Text>
              <TouchableOpacity onPress={handleSync}>
                <Text
                  style={{
                    textAlign: "center",
                    color: colors.secondary,
                    fontWeight: "600",
                    fontSize: screenWidth * 0.04,
                    textDecorationLine: "underline",
                  }}
                >
                  {t("misc.sync_warning.sync_button")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
          label={t("inspection.submit_inspection")}
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

      {/* page loader */}
      {loadingPage && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.195,
            width: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <View
            style={{
              width: "auto",
              backgroundColor: "white",
              borderRadius: screenHeight * 0.5,
              elevation: 4,
            }}
          >
            <LottieView
              style={{
                height: screenHeight * 0.05,
                width: screenHeight * 0.05,
                alignSelf: "center",
              }}
              source={require("../../assets/lottie/spinner.json")}
              autoPlay
              speed={1}
              loop={true}
              resizeMode="cover"
            />
          </View>
        </View>
      )}
    </View>
  );
};
