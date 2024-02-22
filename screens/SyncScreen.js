import React, { useState } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { colors } from "../data/colors";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { AntDesign } from "@expo/vector-icons";
import { SyncItem } from "../components/SyncItem";
import { SyncButton } from "../components/SyncButton";
import { SyncModal } from "../components/SyncModal";

export const SyncScreen = ({ navigation }) => {
  const [startSyncModalOpen, setstartSyncModalOpen] = useState(false);
  const [cancelSyncModalOpen, setcancelSyncModalOpen] = useState(false);
  const [syncStarted, setSyncStarted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleExit = () => {
    setIsSyncing(false);
    setSyncStarted(false);
    setstartSyncModalOpen(false);
    navigation.navigate("Homepage");
  };
  const handleSyncStart = () => {
    setSyncStarted(true);
    setIsSyncing(true);
    setstartSyncModalOpen(false);
  };
  const handleStartProcess = () => {
    setstartSyncModalOpen(true);
  };
  handleEndProcess = () => {
    setstartSyncModalOpen(false);
  };
  const handleBackButton = () => {
    if (isSyncing) {
      setcancelSyncModalOpen(true);
    } else {
      navigation.navigate("Homepage");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      <StatusBar style="dark" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: screenHeight * 0.11,
          backgroundColor: "white",
          paddingTop: screenHeight * 0.042,
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: 5,
          }}
        >
          <AntDesign name="left" size={30} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
            marginLeft: screenWidth * 0.12,
          }}
        >
          Data Synchronization
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: 45,
        }}
      >
        {isSyncing && (
          <>
            <LottieView
              style={{
                height: screenHeight * 0.16,
                width: screenHeight * 0.16,
                alignSelf: "center",
              }}
              source={require("../assets/lottie/loader.json")}
              autoPlay
              speed={0.8}
              loop={true}
              resizeMode="cover"
            />
            <Text style={{ fontWeight: "700" }}>Loading Households...87%</Text>
          </>
        )}

        {syncStarted && (
          <View
            style={{
              flexDirection: "column",
              columnGap: screenHeight * 0.02,
            }}
          >
            <SyncItem name={"Farmers"} isDone={false} />
            <SyncItem name={"Stations"} isDone={true} />
            <SyncItem name={"Training modules"} isDone={true} />
            <SyncItem name={"Inspection questions"} isDone={true} />
            <SyncItem name={"Farmers crops"} isDone={false} />
            <SyncItem name={"Households"} isDone={true} />
            <SyncItem name={"Cells"} isDone={true} />
            <SyncItem name={"Groups"} isDone={false} />
          </View>
        )}

        <SyncButton
          label={syncStarted ? "Resume" : "Start"}
          onPress={handleStartProcess}
          disabled={isSyncing}
        />
      </View>

      {/* start sync modal */}
      {startSyncModalOpen && (
        <SyncModal
          label={"Start data sync for Households?"}
          onYes={handleSyncStart}
          OnNo={handleEndProcess}
        />
      )}

      {cancelSyncModalOpen && (
        <SyncModal
          label={
            "This action will cancel the current data sync, are you sure you want to cancel?"
          }
          onYes={handleExit}
          OnNo={() => setcancelSyncModalOpen(false)}
        />
      )}
    </View>
  );
};
