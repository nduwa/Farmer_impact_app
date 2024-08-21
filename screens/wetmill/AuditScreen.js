import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "../../data/colors";
import SimpleIconButton from "../../components/SimpleIconButton";
import { CheeriesAudit } from "./questionaires/CheeriesAudit";
import { ParchmentAudit } from "./questionaires/ParchmentAudit";
import { PricingAudit } from "./questionaires/PricingAudit";
import { ExpensesAudit } from "./questionaires/ExpensesAudit";
import { StaffAudit } from "./questionaires/StaffAudit";
import { LeftBeansAudit } from "./questionaires/LeftBeansAudit";
import { QualityQuantityAudit } from "./questionaires/QualityQuantityAudit";
import { AppearanceAudit } from "./questionaires/AppearanceAudit";
import { ConclusionAudit } from "./questionaires/ConclusionAudit";
import { useEffect, useState } from "react";
import { LocalizationModal } from "../../components/LocalizationModal";
import { CongestionAudit } from "./questionaires/CongestionAudit";
import { TakePictures } from "./questionaires/TakePictures";
import { SyncModal } from "../../components/SyncModal";

export const AuditScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { data } = route.params;

  const [activeAudit, setActiveAudit] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [choice, setChoice] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [nextModal, setNextModal] = useState(false);

  const congestionList = [{ id: 1, name: "A little" }];

  const handleBackButton = () => {
    navigation.navigate("WetmillHomeScreen", { data: null });
  };

  const handleSave = () => {
    setNextModal(false);
    setActiveAudit(activeAudit < 9 ? activeAudit + 1 : 10);
  };

  const handlePrev = () => {
    setActiveAudit(activeAudit > 0 ? activeAudit - 1 : 0);
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg_variant,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />

      {modalOpen && (
        <LocalizationModal
          setChoice={setChoice}
          data={congestionList}
          setModalOpen={setModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Level of congestion"}
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
          {data.Name || "Audit"}
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
        <ScrollView>
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
              active={activeAudit > 0}
              icon={<Foundation name="previous" size={24} color="white" />}
            />
            {activeAudit == 0 && <CheeriesAudit stationName={data?.Name} />}
            {activeAudit == 1 && <ParchmentAudit stationName={data?.Name} />}
            {activeAudit == 2 && <PricingAudit stationName={data?.Name} />}
            {activeAudit == 3 && <ExpensesAudit stationName={data?.Name} />}
            {activeAudit == 4 && <StaffAudit stationName={data?.Name} />}
            {activeAudit == 5 && <LeftBeansAudit stationName={data?.Name} />}
            {activeAudit == 6 && <AppearanceAudit stationName={data?.Name} />}
            {activeAudit == 7 && (
              <QualityQuantityAudit stationName={data?.Name} />
            )}
            {activeAudit == 8 && <CongestionAudit stationName={data?.Name} />}
            {activeAudit == 9 && (
              <ConclusionAudit
                setChoice={setChoice}
                setModalOpen={setModalOpen}
                choice={choice}
                stationName={data?.Name}
              />
            )}
            {activeAudit == 10 && <TakePictures />}

            <SimpleIconButton
              label={"Save"}
              width="100%"
              color={colors.secondary}
              labelColor="white"
              active={true}
              handlePress={() => setNextModal(true)}
              icon={<Feather name="save" size={24} color="white" />}
            />
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
    </View>
  );
};
