import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../data/colors";
import { StatusBar } from "expo-status-bar";
import { SyncItem } from "../components/SyncItem";
import { SyncButton } from "../components/SyncButton";
import { useDispatch, useSelector } from "react-redux";
import { dataTodb } from "../helpers/dataTodb";
import { SyncModal } from "../components/SyncModal";
import { sync, syncActions } from "../redux/sync/syncSlice";
import { checkTableExistence } from "../helpers/checkTableExistence";

export const SyncScreen = ({ navigation, route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [progress, setProgress] = useState(0);
  const [currentJob, setCurrentJob] = useState(null);
  const [currentTable, setCurrentTable] = useState(null);
  const [startSyncModalOpen, setstartSyncModalOpen] = useState(false);
  const [cancelSyncModalOpen, setcancelSyncModalOpen] = useState(false);
  const [restartSyncModal, setRestartSyncModal] = useState({
    open: false,
    table: null,
  });

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
    { table: "suppliers", status: false },
    { table: "seasons", status: false },
  ]);

  const dispatch = useDispatch();
  const syncState = useSelector((state) => state.sync);

  const { data = null } = route.params;

  const handleExit = () => {
    setIsSyncing(false);
    setSyncStarted(false);
    setstartSyncModalOpen(false);
    setcancelSyncModalOpen(false);
    setRestartSyncModal({ open: false, table: null });
    setCurrentJob(null);
    setCurrentTable(null);
    setProgress(0);
    dispatch(syncActions.resetSyncState());
    navigation.navigate("Homepage", { data: null });
  };
  const handleSyncStart = () => {
    setstartSyncModalOpen(false);

    if (!currentTable) return;
    dispatch(sync({ tableName: currentTable }));
    setSyncStarted(true);
    setIsSyncing(true);
  };
  const handleSyncRestart = () => {
    setRestartSyncModal((prevState) => ({
      ...prevState,
      open: false,
    }));

    if (restartSyncModal.table == null) return;
    let restartTable = sycnList[restartSyncModal.table].table;
    setCurrentTable(restartTable);
    dispatch(sync({ tableName: restartTable }));
    setSyncStarted(true);
    setIsSyncing(true);
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
      navigation.navigate("Homepage", { data: null });
    }
  };

  const scheduleNextJob = () => {
    for (const job of sycnList) {
      if (job.status || job.table === "cells" || job.table === "crops") {
        continue;
      } else {
        setCurrentTable(null);
        setCurrentTable(job.table);
        setCurrentJob(null);
        setProgress(0);
        return job.table;
      }
    }
  };

  useEffect(() => {
    if (syncState.loading) {
      setCurrentJob("Connecting");
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

  useEffect(
    () => async () => {
      if (currentJob === "completed") {
        let storageKey = `rtc-sync-${currentTable}`;
        await SecureStore.setItemAsync(storageKey, "1");
      }
    },
    [currentJob]
  );

  useEffect(() => {
    const refreshSyncList = async () => {
      try {
        if (data?.newUser) {
          return;
        }

        const tableExistenceResults = await checkTableExistence();

        if (tableExistenceResults) {
          const updatedSyncList = await Promise.all(
            sycnList.map(async (item) => {
              const storageKey = `rtc-sync-${item.table}`;
              const syncValue = await SecureStore.getItemAsync(storageKey);
              console.log(`${storageKey}: ${syncValue}`);
              return {
                table: item.table,
                status: syncValue === "1",
              };
            })
          );

          setSyncList(updatedSyncList);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    refreshSyncList();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
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
          Data Synchronization
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: screenHeight * 0.02,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              gap: screenHeight * 0.015,
              width: screenWidth * 0.7,
              height: screenHeight * 0.25,
              backgroundColor: colors.white,
              elevation: 3,
              borderBottomLeftRadius: screenWidth,
              borderBottomRightRadius: screenWidth,
            }}
          >
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 24,
                }}
              >
                {currentTable?.replace(/^\w/, (c) => c.toUpperCase()) || "N/A"}
              </Text>
              <Text
                style={{ textAlign: "center", fontWeight: "300", fontSize: 12 }}
              >
                ... {currentJob || "no activity yet"} ...
              </Text>
            </View>

            {!isSyncing ? (
              <SyncButton
                label={syncStarted ? "Resume" : "Start"}
                onPress={handleStartProcess}
                disabled={isSyncing}
              />
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 40,
                  color: colors.secondary_variant,
                }}
              >
                {progress}%
              </Text>
            )}
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              flexDirection: "column",
              paddingHorizontal: screenWidth * 0.019,
              gap: screenHeight * 0.02,
            }}
          >
            <SyncItem
              name={"Stations"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[0].status}
              tableIndex={0}
            />
            <SyncItem
              name={"Groups"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[1].status}
              tableIndex={1}
            />
            <SyncItem
              name={"Farmers"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[2].status}
              tableIndex={2}
            />
            <SyncItem
              name={"Households"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[3].status}
              tableIndex={3}
            />
            <SyncItem
              name={"Training modules"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[5].status}
              tableIndex={5}
            />
            <SyncItem
              name={"Inspection questions"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[6].status}
              tableIndex={6}
            />
            <SyncItem
              name={"Suppliers"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[8].status}
              tableIndex={8}
            />
            <SyncItem
              name={"Seasons"}
              setRestartTable={setRestartSyncModal}
              isDone={sycnList[9].status}
              tableIndex={9}
            />
          </View>
        </ScrollView>
      </View>

      {/* start sync modal */}
      {startSyncModalOpen && (
        <SyncModal
          label={
            currentTable
              ? `Start data sync for ${currentTable}?`
              : "Synchronization complete"
          }
          onYes={handleSyncStart}
          OnNo={handleEndProcess}
        />
      )}

      {/* cancel sync modal */}
      {cancelSyncModalOpen && (
        <SyncModal
          label={
            "This action will cancel the current data sync, are you sure you want to cancel?"
          }
          onYes={handleExit}
          OnNo={() => setcancelSyncModalOpen(false)}
        />
      )}

      {/* restart sync modal */}
      {restartSyncModal.open && (
        <SyncModal
          label={`Do you want to restart synchronisation for ${
            sycnList[restartSyncModal.table].table
          }`}
          onYes={handleSyncRestart}
          OnNo={() =>
            setRestartSyncModal((prevState) => ({
              ...prevState,
              open: false,
            }))
          }
        />
      )}
    </View>
  );
};
