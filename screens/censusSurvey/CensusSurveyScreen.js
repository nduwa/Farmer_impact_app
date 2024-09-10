import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import { colors } from "../../data/colors";
import SimpleIconButton from "../../components/SimpleIconButton";
import React, { useEffect, useState } from "react";
import { LocalizationModal } from "../../components/LocalizationModal";
import { SyncModal } from "../../components/SyncModal";
import { FarmerDetails } from "./questionaires/FarmerDetails";
import { FarmDetails } from "./questionaires/FarmDetails";
import { getCurrentLocation } from "../../helpers/getCurrentLocation";
import LottieView from "lottie-react-native";
import { HouseholdDetails } from "./questionaires/HouseholdDetails";
import { TreeDetailsA } from "./questionaires/TreeDetailsA";
import { TreeDetailsB } from "./questionaires/TreeDetailsB";
import { DiseasesAndPests } from "./questionaires/DiseasesAndPests";
import { ObservationCourses } from "./questionaires/ObservationCourses";
import { ObservationDiseases } from "./questionaires/ObservationDiseases";

export const CensusSurveyScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { data } = route.params;

  const [activeQuestionaire, setActiveQuestionaire] = useState(7);
  const [pestsModalOpen, setPestsModalOpen] = useState(false);
  const [pestChoices, setPestChoices] = useState([]);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [nextModal, setNextModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [surveyData, setSurveyData] = useState({});

  const [stationName, setStationName] = useState();
  const [location, setLocation] = useState(null);
  const [locationModal, setLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pestsList = [
    { id: 1, name: "Leaf rust" },
    { id: 2, name: "Coffee berry borer" },
    { id: 3, name: "Coffee berry disease" },
    { id: 4, name: "White Stem borer" },
    { id: 5, name: "Scares and mealy bugs" },
    { id: 6, name: "Antestia" },
    { id: 7, name: "Leaf miner" },
  ];

  const handlePestRemoval = (id) => {
    let addedPests = pestChoices;

    let filtered = addedPests.filter((item) => item.id !== id);

    setPestChoices(filtered);
  };

  const handlePestChoice = (choice) => {
    if (pestChoices.length > 3) return;

    let foundItem = pestChoices.find((item) => item.id === choice.id);

    if (foundItem) return;

    setPestChoices((prevState) => [...prevState, choice]);
  };

  const handleBackButton = () => {
    navigation.navigate("ChooseSurveyFarmerScreen", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleSave = () => {
    setNextModal(false);
    setActiveQuestionaire(
      activeQuestionaire < 11 ? activeQuestionaire + 1 : 11
    );
  };

  const handleFinish = async () => {
    setFinishModal(false);
  };

  const handlePrev = () => {
    setActiveQuestionaire(activeQuestionaire > 0 ? activeQuestionaire - 1 : 0);
  };

  const handleLocation = async () => {
    setLocationModal(false);
    setLoading(true);

    let loc = await getCurrentLocation();
    if (loc) {
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      displayToast("Coordinates have been set");
      setLoading(false);
    } else {
      displayToast("Could not get coordinates");
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardActive(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardActive(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isKeyboardActive]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setSurveyData({});
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

      {pestsModalOpen && (
        <LocalizationModal
          setChoice={handlePestChoice}
          data={pestsList}
          setModalOpen={setPestsModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Diseases/Pests"}
        />
      )}

      {locationModal && (
        <SyncModal
          label={"Do you want to capture this farm's coordinates?"}
          onYes={handleLocation}
          OnNo={() => setLocationModal(false)}
        />
      )}
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
          zIndex: 10,
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
          {`${stationName || "Station"} | Census Survey`}
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: screenHeight * 0.04 }}
        >
          <View
            style={{
              padding: screenWidth * 0.02,
              gap: screenHeight * 0.014,
            }}
          >
            <SimpleIconButton
              label={"Previous section"}
              width="100%"
              color={colors.blue_font}
              labelColor="white"
              handlePress={handlePrev}
              active={activeQuestionaire > 0}
              icon={<Foundation name="previous" size={24} color="white" />}
            />
            {activeQuestionaire == 0 && (
              <FarmerDetails
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                responses={surveyData}
                farmerData={data?.farmerData}
              />
            )}
            {activeQuestionaire == 1 && (
              <FarmDetails
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                responses={surveyData}
                setLocationModal={setLocationModal}
                location={location}
              />
            )}
            {activeQuestionaire == 2 && (
              <HouseholdDetails
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                responses={surveyData}
                farmerData={data?.farmerData}
              />
            )}
            {activeQuestionaire == 3 && (
              <TreeDetailsA
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                responses={surveyData}
                farmerData={data?.farmerData}
              />
            )}
            {activeQuestionaire == 4 && (
              <TreeDetailsB
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                responses={surveyData}
                farmerData={data?.farmerData}
              />
            )}
            {activeQuestionaire == 5 && (
              <DiseasesAndPests
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                setPestsModal={setPestsModalOpen}
                removePestFn={handlePestRemoval}
                responses={surveyData}
                farmerData={data?.farmerData}
                pestsAdded={pestChoices}
              />
            )}
            {activeQuestionaire == 6 && (
              <ObservationCourses
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                responses={surveyData}
                farmerData={data?.farmerData}
              />
            )}
            {activeQuestionaire == 7 && (
              <ObservationDiseases
                setNextModal={setNextModal}
                setSurvey={setSurveyData}
                responses={surveyData}
                farmerData={data?.farmerData}
              />
            )}
          </View>
        </ScrollView>
      </View>
      {nextModal && (
        <SyncModal
          label={"Do you confirm the provided information?"}
          onYes={handleSave}
          OnNo={() => setNextModal(false)}
        />
      )}

      {finishModal && (
        <SyncModal
          label={
            "You are about to close this audit, Do you confirm the provided information?"
          }
          onYes={handleFinish}
          OnNo={() => setFinishModal(false)}
        />
      )}

      {/* loader */}
      {loading && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.12,
            width: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
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
