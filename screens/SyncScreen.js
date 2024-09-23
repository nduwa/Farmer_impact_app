import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  ToastAndroid,
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
import LottieView from "lottie-react-native";

export const SyncScreen = ({ navigation, route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userState = useSelector((state) => state.user);

  const [listedForSync, setListedForSync] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [sycnList, setSyncList] = useState([
    { table: "stations", label: "Stations", status: false },
    { table: "groups", label: "Groups", status: false },
    { table: "farmers", label: "Farmers", status: false },
    { table: "households", label: "Households", status: false },
    { table: "cells", label: "Cells", status: false },
    { table: "trainingModules", label: "Training modules", status: false },
    {
      table: "inspectionQuestions",
      label: "Inspection questions",
      status: false,
    },
    { table: "inspectionAnswers", label: "Inspection answers", status: false },
    { table: "crops", label: "Crops", status: false },
    { table: "suppliers", label: "Suppliers", status: false },
    { table: "seasons", label: "Seasons", status: false },
  ]);

  const dispatch = useDispatch();
  const syncState = useSelector((state) => state.sync);

  const { data = null } = route.params;

  const getTableLabel = (name) => {
    for (const table of sycnList) {
      if (table.table === name) {
        return table.label;
      }
    }
  };

  const isEligible = (table) => {
    if (listedForSync.length < 1) return true;

    let found = listedForSync.find((item) => item === table);
    return found;
  };

  const hasAccess = (mod, allMods) => {
    return allMods?.some((module) => module.module_name === mod);
  };

  const isOnlyAccess = (mod, allMods) => {
    let foundMod = allMods?.some((module) => module.module_name === mod);

    return foundMod && allMods.length == 1;
  };

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
    setLoading(true);

    if (!currentTable) {
      setLoading(false);
      return;
    }

    let specialId =
      userState.userData.staff.Role === "surveyor" &&
      currentTable === "stations"
        ? userState.userData.staff._kf_Station
        : null;

    let queryParam =
      hasAccess("wet mill audit") && currentTable === "stations" ? "all" : null;

    dispatch(sync({ tableName: currentTable, specialId, queryParam }));
    setSyncStarted(true);
    setIsSyncing(true);
  };
  const handleSyncRestart = () => {
    setRestartSyncModal((prevState) => ({
      ...prevState,
      open: false,
    }));
    setLoading(true);

    if (restartSyncModal.table == null) return;
    let restartTable = sycnList[restartSyncModal.table].table;
    setCurrentTable(restartTable);

    let specialId =
      userState.userData.staff.Role === "surveyor" &&
      restartTable === "stations"
        ? userState.userData.staff._kf_Station
        : null;

    let queryParam =
      hasAccess("wet mill audit") && currentTable === "stations" ? "all" : null;

    dispatch(
      sync({
        tableName: restartTable,
        specialId,
        queryParam,
      })
    );
    setSyncStarted(true);
    setIsSyncing(true);
  };
  const handleStartProcess = () => {
    setCurrentTable(scheduleNextJob());
    setstartSyncModalOpen(true);
  };
  handleEndProcess = () => {
    setstartSyncModalOpen(false);
    setLoading(false);
  };
  const handleBackButton = () => {
    if (isSyncing) {
      setcancelSyncModalOpen(true);
    } else {
      navigation.replace("Homepage", { data: null });
    }
  };

  const scheduleNextJob = () => {
    for (const job of sycnList) {
      if (
        job.status ||
        job.table === "cells" ||
        job.table === "crops" ||
        !isEligible(job.table)
      ) {
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

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
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

      setLoading(false);
      setProgress(0);
      dispatch(syncActions.resetSyncState());
    }
    if (syncState.error) {
      setCurrentJob("Error");
      displayToast(`Error fetching data for ${currentTable}`);
      setIsSyncing(false);
      setLoading(false);
      setProgress(0);
      dispatch(syncActions.resetSyncState());
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

        setLoading(true);
        const tableExistenceResults = await checkTableExistence();

        if (tableExistenceResults) {
          const updatedSyncList = await Promise.all(
            sycnList.map(async (item) => {
              const storageKey = `rtc-sync-${item.table}`;
              const syncValue = await SecureStore.getItemAsync(storageKey);
              console.log(`${storageKey}: ${syncValue}`);
              return {
                table: item.table,
                label: item.label,
                status: syncValue === "1",
              };
            })
          );

          setLoading(false);
          setSyncList(updatedSyncList);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    const listForSync = async () => {
      let allAssignedModules = userState.accessModules;

      if (userState?.userData?.staff?.Role === "surveyor") {
        let allowedList = ["stations", "groups", "farmers", "households"];
        setListedForSync(allowedList);
      } else if (isOnlyAccess("wet mill audit", allAssignedModules)) {
        let allowedList = ["stations"];
        setListedForSync(allowedList);
      } else {
        let allowedList = [];
        setListedForSync(allowedList);
      }
    };

    refreshSyncList();
    listForSync();
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
            position: "relative",
            top: -screenHeight * 0.025,
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
                {getTableLabel(currentTable) || "N/A"}
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
            {isEligible("stations") && (
              <SyncItem
                name={"Stations"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[0].status}
                tableIndex={0}
              />
            )}

            {isEligible("groups") && (
              <SyncItem
                name={"Groups"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[1].status}
                tableIndex={1}
              />
            )}

            {isEligible("farmers") && (
              <SyncItem
                name={"Farmers"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[2].status}
                tableIndex={2}
              />
            )}

            {isEligible("households") && (
              <SyncItem
                name={"Households"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[3].status}
                tableIndex={3}
              />
            )}
            {isEligible("trainingModules") && (
              <SyncItem
                name={"Training modules"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[5].status}
                tableIndex={5}
              />
            )}
            {isEligible("inspectionQuestions") && (
              <SyncItem
                name={"Inspection questions"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[6].status}
                tableIndex={6}
              />
            )}
            {isEligible("inspectionAnswers") && (
              <SyncItem
                name={"Inspection answers"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[7].status}
                tableIndex={7}
              />
            )}

            {isEligible("suppliers") && (
              <SyncItem
                name={"Suppliers"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[9].status}
                tableIndex={9}
              />
            )}
            {isEligible("seasons") && (
              <SyncItem
                name={"Seasons"}
                setRestartTable={setRestartSyncModal}
                isDone={sycnList[10].status}
                tableIndex={10}
              />
            )}
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

      {/* loader */}
      {loading && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.1,
            width: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 11,
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
              source={require("../assets/lottie/spinner.json")}
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
