import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { colors } from "../../../data/colors";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FarmerTreesCard } from "../../../components/FarmerTreesCard";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import { useDispatch, useSelector } from "react-redux";
import {
  treesSubmit,
  updateTreesAction,
} from "../../../redux/farmer/UpdateTreesSlice";
import { updateDBdata } from "../../../helpers/updateDBdata";
import LottieView from "lottie-react-native";
import { SyncModal } from "../../../components/SyncModal";
import { InspectionHoverSubmitBtn } from "../../../components/InspectionHoverSubmitBtn";

export const PendingTreesScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const submissionState = useSelector((state) => state.trees);

  const [treeRecords, setTreeRecords] = useState([]);
  const [Submitted, setSubmitted] = useState(false);
  const [currentJob, setCurrentJob] = useState();
  const [loading, setLoading] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [token, setToken] = useState();

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  function formatDate(date) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    let theDate = new Date(date);

    return theDate.toLocaleDateString("en-US", options);
  }

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleUpload = () => {
    setLoading(true);
    dispatch(treesSubmit({ trees: treeRecords, token }));
    setSubmitModal(false);
  };

  useEffect(() => {
    if (currentJob === "Trees uploaded") {
      displayToast("Done");
      setLoading(false);
    } else if (currentJob === "not uploaded") {
      displayToast("Error Trees not uploaded");
      setLoading(false);
    }
  }, [currentJob]);

  useEffect(() => {
    if (submissionState.serverResponded) {
      setSubmitted(true);

      if (submissionState.response.status === "success") {
        let allRecords = treeRecords;
        let query = "";
        let strIDs = "";
        let i = 0;

        if (allRecords.length > 1) {
          for (const record of allRecords) {
            strIDs += `'${record.id}'`;
            if (i < allRecords.length - 1) strIDs += ",";
            i++;
          }
          query = `UPDATE rtc_household_trees SET uploaded = 1 WHERE id IN(${strIDs})`;
        } else {
          query = `UPDATE rtc_household_trees SET uploaded = 1 WHERE id = '${allRecords[0].id}'`;
        }

        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "Trees uploaded",
          msgNo: "not uploaded",
        });
      }
    }
  }, [submissionState.serverResponded]);

  useEffect(() => {
    if (submissionState.error) {
      setLoading(false);
      displayToast("Error: Trees not submitted");
      dispatch(updateTreesAction.resetTreesState());
    }
  }, [submissionState.error]);

  useEffect(() => {
    setLoading(false);
  }, [treeRecords]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const currentUser = await SecureStore.getItemAsync("rtc-name-full");
        const authToken = await SecureStore.getItemAsync("rtc-token");

        if (authToken) {
          setToken(authToken);
        }

        if (currentUser) {
          setLoading(true);
          retrieveDBdata({
            tableName: "rtc_household_trees",
            setData: setTreeRecords,
            queryArg: `SELECT * FROM rtc_household_trees WHERE uploaded = 0 AND full_name = '${currentUser}'`,
          });
        }
      };

      fetchData();
      return () => {
        setTreeRecords([]);
        setSubmitted(false);
        setLoading(false);
        dispatch(updateTreesAction.resetTreesState());
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
          Pending Trees
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {treeRecords.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={treeRecords}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <FarmerTreesCard
              data={item}
              registrationDate={formatDate(item.created_at)}
              active={!Submitted}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {treeRecords.length > 0 && (
        <InspectionHoverSubmitBtn
          topRatio={0.93}
          handlePress={() => setSubmitModal(true)}
          active={!submissionState.loading && !Submitted}
        />
      )}

      {submitModal && (
        <SyncModal
          label={"You are about to upload all the pending trees, Are you sure?"}
          onYes={handleUpload}
          OnNo={() => setSubmitModal(false)}
        />
      )}

      {/* loader */}
      {loading && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.12,
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
