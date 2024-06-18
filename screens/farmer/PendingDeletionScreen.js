import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
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
import { FarmerPendingCard } from "../../components/FarmerPendingCard";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { InspectionHoverSubmitBtn } from "../../components/InspectionHoverSubmitBtn";
import {
  farmerSubmission,
  registrationAction,
} from "../../redux/farmer/RegistrationSlice";
import { dataTodb } from "../../helpers/dataTodb";
import LottieView from "lottie-react-native";
import { SyncModal } from "../../components/SyncModal";
import { FarmerDeletedCard } from "../../components/FarmerDeletedCard";
import { updateDBdata } from "../../helpers/updateDBdata";

export const PendingDeletionScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const submissionState = useSelector((state) => state.registration);
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
    // dispatch(farmerSubmission(deletions));
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
    let query = `UPDATE rtc_farmers SET deleted = 0, deleted_by = '', deleted_at = '0000-00-00' WHERE __kp_Farmer = '${id}'`;

    setRestoreModal((prevState) => ({ ...prevState, open: false }));
    updateDBdata({
      id,
      query,
      setCurrentJob,
      msgYes: "Farmers restored",
      msgNo: "not restored",
    });
  };

  useEffect(() => {
    if (currentJob === "Farmers restored") {
      displayToast("Farmers restored");
      const newDeletions = deletions.filter(
        (item) => item.__kp_Farmer !== restoreModal.id
      );

      setDeletions(newDeletions);
      setCurrentJob("");
    }
  }, [currentJob]);

  useEffect(() => {
    if (submissionState.serverResponded) {
      setSubmitted(true);

      if (submissionState.response.status === "success") {
      }
    }
  }, [submissionState.serverResponded]);

  useEffect(() => {
    setLoading(false);
  }, [deletions]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const currentUser = await SecureStore.getItemAsync("rtc-user-name");

        if (currentUser) {
          setLoading(true);
          retrieveDBdata({
            tableName: "rtc_farmers",
            setData: setDeletions,
            queryArg: `SELECT * FROM rtc_farmers WHERE deleted = 1 AND deleted_by = '${currentUser}'`,
          });
        }
      };

      fetchData();
      return () => {
        setDeletions([]);
        setSubmitted(false);
        setLoading(false);
        dispatch(registrationAction.resetRegistrationState());
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
              deleteDate={formatDate(item.deleted_at)}
              restoreFn={setRestoreModal}
            />
          )}
          keyExtractor={(item) => item.__kp_Farmer}
        />
      )}

      {deletions.length > 0 && (
        <InspectionHoverSubmitBtn
          topRatio={0.93}
          handlePress={() => setSubmitModal(true)}
          active={!submissionState.loading && !Submitted}
        />
      )}

      {submitModal && (
        <SyncModal
          label={
            "You are about to upload all the pending registered farmers, Are you sure?"
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
              source={require("../../assets/lottie/spinner.json")}
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
