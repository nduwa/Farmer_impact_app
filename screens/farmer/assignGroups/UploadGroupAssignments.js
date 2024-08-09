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
import { GroupAssignedFarmersItem } from "../../../components/GroupAssignedFarmersItem";
import { deleteDBdataAsync } from "../../../helpers/deleteDBdataAsync";

export const UploadGroupAssignments = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const groupChangeState = useSelector((state) => state.groupStatus);
  const dispatch = useDispatch();

  const { data } = route.params;

  const [changesTobeSubmitted, setChangesTobeSubmitted] = useState([]);
  const [ids, setIds] = useState("");
  const [currentJob, setCurrentJob] = useState(null);

  const [groupAssignments, setGroupAssignments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const formatDate = (str) => {
    const date = new Date(str);
    const formattedDate = date.toISOString().split("T")[0];

    return formattedDate; // Output: 2018-09-24
  };

  const handleActivityDetails = (insertion_date) => {
    navigation.navigate("AssignedFarmerDetailsScreen", {
      data: { insertion_date },
    });
  };

  const handleBackButton = () => {
    navigation.navigate("PendingGroupsScreen", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  useEffect(() => {
    if (currentJob === "Groups changes saved") {
      displayToast("Groups changes submitted");
      setCurrentJob("");
      navigation.navigate("PendingGroupsScreen", { data: null });
    } else if (currentJob === "Groups changes not saved") {
      displayToast("Error: Groups changes not submitted");
      setCurrentJob("");
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
        let query = `UPDATE tmp_farmer_group_assignment SET uploaded = 1 WHERE id IN(${ids})`;

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
  }, [groupAssignments]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoadingData(true);
        retrieveDBdata({
          tableName: "tmp_farmer_group_assignment",
          setData: setGroupAssignments,
          queryArg: dbQueries.Q_TMP_GRP_ASSIGN_LIST,
        });
      };

      fetchData();
      return () => {
        setLoadingData(false);
        setGroupAssignments([]);
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
          Upload Groups Assignments
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
        <FlatList
          contentContainerStyle={{
            padding: screenWidth * 0.02,
            gap: 9,
            flex: 1,
            width: "100%",
          }}
          data={groupAssignments}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <GroupAssignedFarmersItem
              date={item.insertion_date}
              records={item.record_count}
              handlePress={() => handleActivityDetails(item.insertion_date)}
            />
          )}
          keyExtractor={(item) => groupAssignments.indexOf(item)}
        />
      </View>

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
