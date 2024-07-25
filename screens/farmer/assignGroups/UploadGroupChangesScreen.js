import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  Dimensions,
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import LottieView from "lottie-react-native";
import { GroupsStatusCard } from "../../../components/GroupsStatusCard";
import { dbQueries } from "../../../data/dbQueries";
import { useDispatch, useSelector } from "react-redux";
import {
  GroupStatusAction,
  groupStatusUpdate,
} from "../../../redux/farmer/GroupStatusChangeSlice";
import { updateDBdata } from "../../../helpers/updateDBdata";
import { deleteDBdataAsync } from "../../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../../components/SyncModal";

export const UploadGroupChangesScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const groupChangeState = useSelector((state) => state.groupStatus);
  const dispatch = useDispatch();

  const { data } = route.params;

  const [changesTobeSubmitted, setChangesTobeSubmitted] = useState([]);
  const [ids, setIds] = useState("");
  const [currentInactiveIDs, setCurrentInactiveIDs] = useState("");
  const [currentActiveIDs, setCurrentActiveIDs] = useState("");
  const [reverseComplete, setReverseComplete] = useState(false);

  const [currentJob, setCurrentJob] = useState(null);
  const [undoModal, setUndoModal] = useState({ open: false, id: null });
  const [submitModal, setSubmitModal] = useState({ open: false, id: null });

  const [groupChanges, setGroupChanges] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const formatDate = (str) => {
    const date = new Date(str);
    const formattedDate = date.toISOString().split("T")[0];

    return formattedDate; // Output: 2018-09-24
  };

  const handleSubmit = () => {
    setLoadingData(true);
    setSubmitModal((prevState) => ({ ...prevState, open: false }));

    let tmp = [];
    let strIDs = "";
    let i = 0;

    for (const change of data) {
      if (formatDate(change.created_at) === submitModal.id) {
        tmp.push(change);
        strIDs += `'${change.id}'`;
        if (i < data.length - 1) strIDs += ",";
        i++;
      }
    }

    setIds(strIDs);

    setChangesTobeSubmitted(tmp);
    dispatch(groupStatusUpdate({ groupChanges: tmp }));
  };

  const handleReverse = () => {
    setLoadingData(true);
    const allChangesByDate = data.filter(
      (item) => formatDate(item.created_at) === undoModal.id
    );
    let activeIDs = "";
    let inactiveIDs = "";

    let i = 0;
    let query = "";

    for (const change of allChangesByDate) {
      if (change.active === 1) {
        activeIDs += `'${change._kf_Group}'`;
        if (i < allChangesByDate.length - 1) activeIDs += ",";
      } else {
        inactiveIDs += `'${change._kf_Group}'`;
        if (i < allChangesByDate.length - 1) inactiveIDs += ",";
      }

      i++;
    }

    setCurrentInactiveIDs(inactiveIDs);
    setCurrentActiveIDs(activeIDs);
    if (activeIDs.length > 0) {
      query = `UPDATE rtc_groups SET active = 0 WHERE __kp_Group IN(${activeIDs})`;
      updateDBdata({
        id: 0,
        query,
        setCurrentJob,
        msgYes: "Inactive status restored",
        msgNo: "status not restored",
      });
    } else if (inactiveIDs.length > 0) {
      query = `UPDATE rtc_groups SET active = 1 WHERE __kp_Group IN(${inactiveIDs})`;
      updateDBdata({
        id: 0,
        query,
        setCurrentJob,
        msgYes: "active status restored",
        msgNo: "status not restored",
      });
    }
  };

  const handleBackButton = () => {
    navigation.navigate("PendingGroupsScreen", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  useEffect(() => {
    if (reverseComplete) {
      let idsToDelete = `${
        currentActiveIDs.length > 0 ? currentActiveIDs : ""
      }${
        currentActiveIDs.length > 0 && currentInactiveIDs.length > 0 ? "," : ""
      }${currentInactiveIDs.length > 0 ? currentInactiveIDs : ""}`;

      deleteDBdataAsync({
        tableName: "tmp_group_activate",
        targetId: "0",
        customQuery: `DELETE FROM tmp_group_activate WHERE _kf_Group in (${idsToDelete})`,
      })
        .then((result) => {
          if (result.success) {
            displayToast("All Changes have been reversed");
            setUndoModal({ open: false, id: null });
            navigation.navigate("PendingGroupsScreen", { data: null });
          }
        })
        .catch((error) => {
          displayToast("something went wrong");
          console.log(error);
        });
      setLoadingData(false);
    }
  }, [reverseComplete]);

  useEffect(() => {
    if (currentJob === "Groups changes saved") {
      displayToast("Groups changes submitted");
      setCurrentJob("");
      setLoadingData(false);
      navigation.navigate("PendingGroupsScreen", { data: null });
    } else if (currentJob === "Groups changes not saved") {
      displayToast("Error: Groups changes not submitted");
      setCurrentJob("");
      setLoadingData(false);
    } else if (currentJob === "Inactive status restored") {
      if (currentInactiveIDs.length > 0) {
        query = `UPDATE rtc_groups SET active = 1 WHERE __kp_Group IN(${currentInactiveIDs})`;
        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "active status restored",
          msgNo: "status not restored",
        });
      } else {
        setReverseComplete(true);
      }
    } else if (currentJob === "active status restored") {
      setReverseComplete(true);
    }
  }, [currentJob]);

  useEffect(() => {
    if (groupChangeState.error) {
      setLoadingData(false);
      displayToast("Error: Groups changes not submitted");
      dispatch(GroupStatusAction.resetGroupStatusState());
    }
  }, [groupChangeState.error]);

  useEffect(() => {
    if (groupChangeState.serverResponded) {
      if (groupChangeState.response.status === "success") {
        let query = `UPDATE tmp_group_activate SET uploaded = 1 WHERE id IN(${ids})`;

        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "Groups changes saved",
          msgNo: "Groups changes not saved",
        });
      }

      dispatch(GroupStatusAction.resetGroupStatusState());
      setLoadingData(false);
    }
  }, [groupChangeState.serverResponded]);

  useEffect(() => {
    setLoadingData(false);
  }, [groupChanges]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoadingData(true);
        retrieveDBdata({
          tableName: "tmp_group_activate",
          setData: setGroupChanges,
          queryArg: dbQueries.Q_TMP_GRP_ACTVT_LIST,
        });
      };

      fetchData();
      return () => {
        setLoadingData(false);
        setGroupChanges([]);
        setChangesTobeSubmitted([]);
        setCurrentInactiveIDs("");
        setCurrentJob("");
        setUndoModal({ open: false, id: null });
        setSubmitModal({ open: false, id: null });
        setIds("");
        setReverseComplete(false);
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
          Upload Groups Changes
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flex: 1,
          padding: screenWidth * 0.02,
        }}
      >
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={groupChanges}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <GroupsStatusCard
              date={item.insertion_date}
              deactivated={item.inactive_count}
              activated={item.active_count}
              submitFn={() =>
                setSubmitModal({ open: true, id: item.insertion_date })
              }
              undoFn={() =>
                setUndoModal({ open: true, id: item.insertion_date })
              }
            />
          )}
          keyExtractor={(item) => groupChanges.indexOf(item)}
        />
      </View>

      {/* undo modal */}
      {undoModal.open && (
        <SyncModal
          label={`All groups status will be restored, reverse all changes?`}
          onYes={handleReverse}
          OnNo={() =>
            setUndoModal((prevState) => ({ ...prevState, open: false }))
          }
          labelYes="Ok"
          labelNo="No"
        />
      )}

      {/* submit modal */}
      {submitModal.open && (
        <SyncModal
          label={`You're about to upload all group status changes, are you sure?`}
          onYes={handleSubmit}
          OnNo={() =>
            setSubmitModal((prevState) => ({ ...prevState, open: false }))
          }
          labelYes="Ok"
          labelNo="No"
        />
      )}

      {/* page loader */}
      {loadingData && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.195,
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
              source={require("../../../assets/lottie/spinner.json")}
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
