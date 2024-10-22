import React, { useEffect, useState } from "react";
import { colors } from "../../../data/colors";
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
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import { InspectionHoverSubmitBtn } from "../../../components/InspectionHoverSubmitBtn";
import LottieView from "lottie-react-native";
import { SyncModal } from "../../../components/SyncModal";
import { FarmerDeletedCard } from "../../../components/FarmerDeletedCard";
import { updateDBdata } from "../../../helpers/updateDBdata";
import {
  deletionAction,
  farmerDeletion,
} from "../../../redux/farmer/DeletionSlice";
import { deleteDBdataAsync } from "../../../helpers/deleteDBdataAsync";

export const PendingDeletionScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const deletionState = useSelector((state) => state.deletion);
  const userState = useSelector((state) => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [deletions, setDeletions] = useState([]);
  const [Submitted, setSubmitted] = useState(false);
  const [restoreModal, setRestoreModal] = useState({ open: false, id: null });
  const [currentJob, setCurrentJob] = useState();

  const [loading, setLoading] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);

  const handleUpload = () => {
    setLoading(true);
    dispatch(farmerDeletion(deletions));
    setSubmitModal(false);
  };

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
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

  const handleRestore = () => {
    let id = restoreModal.id;

    setRestoreModal((prevState) => ({ ...prevState, open: false }));
    deleteDBdataAsync({
      tableName: "tmp_farmer_updates",
      targetId: id,
      customQuery: `DELETE FROM tmp_farmer_updates WHERE id = '${id}';`,
    })
      .then((result) => {
        if (result.success) {
          setCurrentJob("Farmer restored");
        } else {
          displayToast("restoring failed");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (currentJob === "Farmer restored") {
      displayToast("Farmers restored");
      const newDeletions = deletions.filter(
        (item) => item.id !== restoreModal.id
      );

      setDeletions(newDeletions);
      setCurrentJob("");
    } else if (currentJob === "Changes uploaded") {
      displayToast("Changes uploaded");
      setLoading(false);
    }
  }, [currentJob]);

  useEffect(() => {
    if (deletionState.serverResponded) {
      setSubmitted(true);

      if (deletionState.response.status === "success") {
        let { processedData } = deletionState.response;
        let query = "";
        let strIDs = "";
        let i = 0;

        if (processedData.length > 1) {
          for (const farmer of processedData) {
            strIDs += `'${farmer}'`;
            if (i < processedData.length - 1) strIDs += ",";
            i++;
          }
          query = `UPDATE tmp_farmer_updates SET uploaded = 1 WHERE id IN(${strIDs})`;
        } else {
          query = `UPDATE tmp_farmer_updates SET uploaded = 1 WHERE id = '${processedData[0]}'`;
        }

        // setCurrentJob("Changes uploaded");
        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "Changes uploaded",
          msgNo: "not uploaded",
        });
      }
    }
  }, [deletionState.serverResponded]);

  useEffect(() => {
    if (deletionState.error) {
      setLoading(false);
      displayToast("Error: Updates not submitted");
      dispatch(deletionAction.resetDeletionState());
    }
  }, [deletionState.error]);

  useEffect(() => {
    setLoading(false);
  }, [deletions]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const currentUser = await SecureStore.getItemAsync("rtc-name-full");

        if (currentUser) {
          setLoading(true);
          retrieveDBdata({
            tableName: "tmp_farmer_updates",
            setData: setDeletions,
            queryArg: `SELECT * FROM tmp_farmer_updates WHERE _kf_station='${userState.userData.staff._kf_Station}' AND uploaded = 0 AND status = 'delete'`,
          });
        }
      };

      fetchData();
      return () => {
        setDeletions([]);
        setSubmitted(false);
        setLoading(false);
        setLoading(false);
        dispatch(deletionAction.resetDeletionState());
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
          Farmers to be deleted
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {deletions.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={deletions}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <FarmerDeletedCard
              data={item}
              deleteDate={formatDate(item.created_at)}
              restoreFn={setRestoreModal}
              active={!deletionState.loading && !Submitted}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {deletions.length > 0 && (
        <InspectionHoverSubmitBtn
          topRatio={0.9}
          handlePress={() => setSubmitModal(true)}
          active={!deletionState.loading && !Submitted}
        />
      )}

      {submitModal && (
        <SyncModal
          label={
            "You are about to submit all the pending deleted farmers, Are you sure?"
          }
          onYes={handleUpload}
          OnNo={() => setSubmitModal(false)}
        />
      )}

      {/* restore modal */}
      {restoreModal.open && (
        <SyncModal
          label={`You're about to restore this farmer, are you sure?`}
          onYes={handleRestore}
          OnNo={() => setRestoreModal({ open: false, id: null })}
          labelYes="Ok"
          labelNo="No"
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
