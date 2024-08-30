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
import { Approval } from "./questionaires/Aprroval";
import {
  prepareReportFile,
  uritoBase64,
} from "../../helpers/prepareWetmillReport";

export const AuditScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { data } = route.params;

  const [activeAudit, setActiveAudit] = useState(7);
  const [modalOpen, setModalOpen] = useState(false);
  const [choice, setChoice] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false); 
  const [nextModal, setNextModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [auditData, setAuditData] = useState({});
  const [fileSaved, setFileSaved] = useState(false);

  const [reportedCherries, setReportedCherries] = useState(416735);
  const [parchYield, setParchYield] = useState(0);
  const [bucketsYield, setBucketsYield] = useState(0);
  const [parchDayEstimate, setParchDayEstimate] = useState(0);

  const congestionList = [{ id: 1, name: "A little" }];

  const handleBackButton = () => {
    navigation.navigate("WetmillHomeScreen", { data: null });
  };

  const getDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleSave = () => {
    setNextModal(false);
    setActiveAudit(activeAudit < 11 ? activeAudit + 1 : 11);
  };

  const handleFinish = async () => {
    setFinishModal(false);
    await prepareReportFile(auditData, data?.Name, getDate(), setFileSaved);
  };

  const handlePrev = () => {
    setActiveAudit(activeAudit > 0 ? activeAudit - 1 : 0);
  };

  useEffect(() => {
    if (fileSaved) {
      navigation.navigate("Filemanager");
    }
  }, [fileSaved]);

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

  useEffect(() => {
    let parch_yield = reportedCherries / process.env.CHERRY_PARCHMENT_RATIO;
    setParchYield(parseFloat(parch_yield));
    setBucketsYield(11883);
    setParchDayEstimate(2536);
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
              active={activeAudit > 0}
              icon={<Foundation name="previous" size={24} color="white" />}
            />
            {activeAudit == 0 && (
              <CheeriesAudit
                stationName={data?.Name}
                setNextModal={setNextModal}
                setAudit={setAuditData}
                cherriesSMS={reportedCherries}
                responses={auditData}
              />
            )}
            {activeAudit == 1 && (
              <ParchmentAudit
                stationName={data?.Name}
                setNextModal={setNextModal}
                cherriesReported={reportedCherries}
                parchmentYield={parchYield}
                setAudit={setAuditData}
                responses={auditData}
              />
            )}
            {activeAudit == 2 && (
              <PricingAudit
                stationName={data?.Name}
                setNextModal={setNextModal}
                bucketsYield={bucketsYield}
                setAudit={setAuditData}
                responses={auditData}
              />
            )}
            {activeAudit == 3 && (
              <ExpensesAudit
                stationName={data?.Name}
                setNextModal={setNextModal}
                cherriesPurchased={auditData?.cherries_books || 416785}
                setAudit={setAuditData}
                responses={auditData}
              />
            )}
            {activeAudit == 4 && (
              <StaffAudit
                stationName={data?.Name}
                setNextModal={setNextModal}
                totalParchment={auditData?.parch_total || 78430}
                setAudit={setAuditData}
                responses={auditData}
              />
            )}
            {activeAudit == 5 && (
              <LeftBeansAudit
                stationName={data?.Name}
                setNextModal={setNextModal}
                setAudit={setAuditData}
                parchDayEstimate={parchDayEstimate}
                responses={auditData}
              />
            )}
            {activeAudit == 6 && (
              <AppearanceAudit
                stationName={data?.Name}
                setNextModal={setNextModal}
                setAudit={setAuditData}
                responses={auditData}
              />
            )}
            {activeAudit == 7 && (
              <QualityQuantityAudit
                stationName={data?.Name}
                setAudit={setAuditData}
                setNextModal={setNextModal}
                responses={auditData}
              />
            )}
            {activeAudit == 8 && (
              <CongestionAudit
                stationName={data?.Name}
                setAudit={setAuditData}
                setNextModal={setNextModal}
                responses={auditData}
              />
            )}
            {activeAudit == 9 && (
              <ConclusionAudit
                setChoice={setChoice}
                setModalOpen={setModalOpen}
                choice={choice}
                stationName={data?.Name}
                setAudit={setAuditData}
                setNextModal={setNextModal}
                responses={auditData}
              />
            )}
            {activeAudit == 10 && (
              <TakePictures
                setAudit={setAuditData}
                setNextModal={setNextModal}
                responses={auditData}
              />
            )}
            {activeAudit == 11 && (
              <Approval
                setAudit={setAuditData}
                setNextModal={setFinishModal}
                responses={auditData}
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
    </View>
  );
};
