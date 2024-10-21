import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  Dimensions,
  ScrollView,
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
import GroupAssignActivityCard from "../../../components/GroupAssignActivityCard";
import { deleteDBdataAsync } from "../../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../../components/SyncModal";
import { updateDBdata } from "../../../helpers/updateDBdata";
import { useDispatch, useSelector } from "react-redux";
import {
  GroupAssignAction,
  groupAssignUpdate,
} from "../../../redux/farmer/FarmerAssignsSlice";

export const AssignedFarmerDetailsScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const groupAssignState = useSelector((state) => state.groupAssign);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { data } = route.params;

  const [loadingData, setLoadingData] = useState(false);
  const [activityDetails, setActivityDetails] = useState([]);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleBackButton = () => {
    navigation.navigate("UploadGroupAssignments", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };
  const handleUndo = async () => {
    setLoadingData(true);
    deleteDBdataAsync({
      tableName: "tmp_farmer_group_assignment",
      customQuery: `DELETE FROM tmp_farmer_group_assignment WHERE _kf_station='${userState.userData.staff._kf_Station}' AND DATE(created_at)='${data?.insertion_date}'`,
    }).then((result) => {
      if (result.success) {
        displayToast("Changes reversed");
        setLoadingData(false);
        navigation.navigate("UploadGroupAssignments", { data: null });
      } else {
        displayToast("Error: Changes not reversed");
        setLoadingData(false);
      }
    });
  };

  const handleUpload = () => {
    setLoadingData(true);
    setSubmitModalOpen(false);
    dispatch(groupAssignUpdate({ groupChanges: activityDetails }));
  };

  useEffect(() => {
    if (groupAssignState.serverResponded) {
      let strIDs = "";
      let query = "";
      let i = 0;

      for (const activity of activityDetails) {
        strIDs += `'${activity.id}'`;
        if (i < activityDetails.length - 1) strIDs += ",";
        i++;
      }

      query = `UPDATE tmp_farmer_group_assignment SET uploaded = 1 WHERE id IN(${strIDs})`;

      updateDBdata({
        id: 0,
        query,
        setCurrentJob,
        msgYes: "local data updated",
        msgNo: "Error: local data not updated",
      });
    }
  }, [groupAssignState.serverResponded]);

  useEffect(() => {
    if (currentJob === "local data updated") {
      setLoadingData(false);
      setSubmitted(true);
      displayToast("Changes uploaded");
      dispatch(GroupAssignAction.resetGroupAssignState());
    } else if (currentJob === "Error: local data not updated") {
      setLoadingData(false);
      displayToast("submitted, couldn't update local data");
      dispatch(GroupAssignAction.resetGroupAssignState());
    }
  }, [currentJob]);

  useEffect(() => {
    if (groupAssignState.error) {
      setLoadingData(false);
      displayToast("Error: Changes not uploaded");
      dispatch(GroupAssignAction.resetGroupAssignState());
    }
  }, [groupAssignState.error]);

  useEffect(() => {
    setLoadingData(false);
  }, [activityDetails]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoadingData(true);
        retrieveDBdata({
          tableName: "tmp_farmer_group_assignment",
          setData: setActivityDetails,
          queryArg: `SELECT *,DATE(created_at) AS insertion_date FROM tmp_farmer_group_assignment WHERE _kf_station='${userState.userData.staff._kf_Station}' AND uploaded = 0 AND insertion_date = '${data?.insertion_date}'`,
        });
      };

      fetchData();
      return () => {
        setLoadingData(false);
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
          Activity Details
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
            <GroupAssignActivityCard
              insertion_date={data?.insertion_date}
              records={activityDetails}
              deleteFn={() => setDeleteModalOpen(true)}
              uploadFn={() => setSubmitModalOpen(true)}
              isActive={!submitted}
            />
          </View>
        </ScrollView>
      </View>

      {/* delete modal */}
      {deleteModalOpen && (
        <SyncModal
          label={`You're about to undo all changes, reverse all changes?`}
          onYes={handleUndo}
          OnNo={() => setDeleteModalOpen(false)}
          labelYes="Ok"
          labelNo="No"
        />
      )}

      {/* submit modal */}
      {submitModalOpen && (
        <SyncModal
          label={`You're about to upload all group status changes, are you sure?`}
          onYes={handleUpload}
          OnNo={() => setSubmitModalOpen(false)}
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
