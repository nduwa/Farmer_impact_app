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
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import InspectionQuestion from "../../components/InspectionQuestion";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SyncModal } from "../../components/SyncModal";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { InspectionHoverSubmitBtn } from "../../components/InspectionHoverSubmitBtn";
import { InspectionHoverPrevBtn } from "../../components/InspectionHoverPrevBtn";

export const InspectionQuestionsScreen = ({ route }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();

  const { data } = route.params;

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [language, setLanguage] = useState("kiny");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(40);
  const [qnStart, setQnStart] = useState(0);
  const [qnEnd, setQnEnd] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [displayQuestions, setDisplayQuestions] = useState([]);

  const handleBackButton = () => {
    if (answers.length > 0 && !exitModalOpen) {
      setExitModalOpen(true);
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

  const handleSubmit = () => {};
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

  useEffect(() => {
    if (answers.length > 0) {
      console.log("hehe ", answers);
    }
  }, [answers.length]);

  useEffect(() => {
    handleQnsPagination();
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

  useEffect(() => {
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
  }, []);

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
            contentContainerStyle={{
              padding: screenHeight * 0.01,
              gap: screenHeight * 0.001,
            }}
            data={displayQuestions}
            initialNumToRender={10}
            renderItem={({ item, index }) => (
              <InspectionQuestion
                data={{
                  type: data.inspectionType,
                  question: item,
                  index: qnStart + index,
                  language,
                }}
                question={item}
                setQnAnswer={handleAnswer}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      {currentPage > 1 && <InspectionHoverPrevBtn handlePress={handlePrevPg} />}
      <InspectionHoverSubmitBtn
        handlePress={handlePress}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {submitModalOpen && (
        <SyncModal
          label={`Are you sure you want to submit inspection now?`}
          onYes={handleSubmit}
          OnNo={handleClose}
        />
      )}

      {/* exit modal */}
      {exitModalOpen && (
        <SyncModal
          label={
            "You haven't submitted the inspection, unsubmitted answers can not be recovered. are you sure?"
          }
          onYes={handleBackButton}
          OnNo={() => setExitModalOpen(false)}
        />
      )}
    </View>
  );
};
