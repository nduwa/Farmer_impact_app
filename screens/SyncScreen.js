import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { AntDesign } from "@expo/vector-icons";
import { SyncItem } from "../components/SyncItem";
import { SyncButton } from "../components/SyncButton";
import { SyncModal } from "../components/SyncModal";
import { dataTodb } from "../helpers/dataTodb";
import { useDispatch, useSelector } from "react-redux";
import { sync, syncActions } from "../redux/sync/syncSlice";

export const SyncScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);
  const [currentJob, setCurrentJob] = useState(null);
  const [currentTable, setCurrentTable] = useState(null);
  const [startSyncModalOpen, setstartSyncModalOpen] = useState(false);
  const [cancelSyncModalOpen, setcancelSyncModalOpen] = useState(false);
  const [syncStarted, setSyncStarted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sycnList, setSyncList] = useState([
    { table: "stations", status: false },
    { table: "groups", status: false },
    { table: "farmers", status: false },
    { table: "households", status: false },
    { table: "cells", status: false },
    { table: "trainingModules", status: false },
    { table: "inspectionQuestions", status: false },
    { table: "crops", status: false },
  ]);

  const dispatch = useDispatch();
  const syncState = useSelector((state) => state.sync);
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleExit = () => {
    setIsSyncing(false);
    setSyncStarted(false);
    setstartSyncModalOpen(false);
    dispatch(syncActions.resetSyncState());
    navigation.navigate("Homepage");
  };
  const handleSyncStart = () => {
    dispatch(sync({ tableName: currentTable }));
    setSyncStarted(true);
    setIsSyncing(true);
    setstartSyncModalOpen(false);
  };
  const handleStartProcess = () => {
    setCurrentTable(scheduleNextJob());
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

  const scheduleNextJob = () => {
    for (const job of sycnList) {
      if (job.status) {
        continue;
      } else {
        setCurrentTable(job.table);
        return job.table;
      }
    }
  };

  useEffect(() => {
    if (syncState.loading) {
      setCurrentJob("Connecting...");
    }
    if (syncState.serverResponded && syncState.response && !syncState.error) {
      dataTodb({
        tableName: currentTable,
        setProgress: setProgress,
        setCurrentJob: setCurrentJob,
        syncData: syncState.response,
        setIsSyncing: setIsSyncing,
        setSyncList: setSyncList,
      });
    }
  }, [syncState.loading, syncState.serverResponded]);

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
        )}
        {syncStarted && (
          <Text style={{ fontWeight: "700" }}>
            {currentTable} {currentJob}...{progress}%
          </Text>
        )}
        {syncStarted && (
          <View
            style={{
              flexDirection: "column",
              columnGap: screenHeight * 0.02,
            }}
          >
            <SyncItem name={"Stations"} isDone={sycnList[0].status} />
            <SyncItem name={"Groups"} isDone={sycnList[1].status} />
            <SyncItem name={"Farmers"} isDone={sycnList[2].status} />
            <SyncItem name={"Households"} isDone={sycnList[3].status} />
            <SyncItem name={"Cells"} isDone={sycnList[4].status} />
            <SyncItem name={"Training modules"} isDone={sycnList[5].status} />
            <SyncItem
              name={"Inspection questions"}
              isDone={sycnList[6].status}
            />
            <SyncItem name={"Farmers crops"} isDone={sycnList[7].status} />
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
          label={`Start data sync for ${currentTable}?`}
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
