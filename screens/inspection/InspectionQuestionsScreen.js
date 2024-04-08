import {
  Dimensions,
  FlatList,
  StatusBar,
  Text,
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

export const InspectionQuestionsScreen = ({ route }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation();

  const { data } = route.params;

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleBackButton = () => {
    navigation.navigate("inspectionFarmer", {
      data: data.inspectionType,
    });
  };

  const handleSubmit = () => {};
  const handleClose = () => {
    setSubmitModalOpen(false);
  };

  useEffect(() => {
    if (questions.length > 0) {
      console.log("hehe");
    }
  }, [questions]);

  useEffect(() => {
    let inspectionStr = "";

    if (data.inspectionType.toLowerCase().includes("generic"))
      inspectionStr = "Generic";
    else if (data.inspectionType.toLowerCase().includes("special"))
      inspectionStr = "Special";
    else if (data.inspectionType.toLowerCase().includes("cafe"))
      inspectionStr = "CAFE";
    else if (data.inspectionType.toLowerCase().includes("rfa"))
      inspectionStr = "RFA";

    if (inspectionStr === "") return;
    retrieveDBdataAsync({
      filterCol: "evaluation_mode",
      filterValue: inspectionStr,
      tableName: "inspection_questions",
    })
      .then((results) => {
        if (results.length > 0) {
          console.log(results[0]);
          setQuestions(results);
        }
      })
      .catch((err) => console.log(err));
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
            F51489A / TWAGIRAYEZU BALTAZAR
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{
              padding: screenHeight * 0.01,
              gap: screenHeight * 0.001,
            }}
            data={questions}
            initialNumToRender={10}
            renderItem={({ item, index }) => (
              <InspectionQuestion
                data={{
                  type: data.inspectionType,
                  question: item.Kiny_phrase,
                  index,
                  language: "kiny",
                }}
              />
            )}
            keyExtractor={(item) => item.__kp_Evaluation}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          backgroundColor: colors.secondary,
          borderColor: colors.white,
          borderWidth: screenHeight * 0.003,
          borderRadius: screenWidth * 0.5,
          padding: screenHeight * 0.018,
          marginTop: screenHeight * 0.85,
          marginLeft: screenWidth * 0.8,
          elevation: 4,
        }}
        onPress={() => setSubmitModalOpen(true)}
      >
        <MaterialCommunityIcons
          name="folder-check"
          size={35}
          color={colors.white}
        />
      </TouchableOpacity>

      {submitModalOpen && (
        <SyncModal
          label={`Are you sure you want to submit inspection now?`}
          onYes={handleSubmit}
          OnNo={handleClose}
        />
      )}
    </View>
  );
};
