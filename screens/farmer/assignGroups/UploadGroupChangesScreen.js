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

export const UploadGroupChangesScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const groupChangeState = useSelector((state) => state.groupStatus);
  const dispatch = useDispatch();

  const { data } = route.params;

  const [changesTobeSubmitted, setChangesTobeSubmitted] = useState([]);
  const [ids, setIds] = useState("");
  const [currentJob, setCurrentJob] = useState(null);

  const [groupChanges, setGroupChanges] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const formatDate = (str) => {
    const dateString = "2018-09-24T23:55:44.000Z";
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];

    return formattedDate; // Output: 2018-09-24
  };

  const handleSubmit = (insertion_date) => {
    setLoadingData(true);
    let tmp = [];
    let strIDs = "";
    let i = 0;

    for (const change of data) {
      if (formatDate(change.created_at) === insertion_date) {
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

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
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
              submitFn={() => handleSubmit(item.insertion_date)}
            />
          )}
          keyExtractor={(item) => groupChanges.indexOf(item)}
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
