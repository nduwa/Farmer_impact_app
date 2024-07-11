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
import { FarmerPendingCard } from "../../../components/FarmerPendingCard";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import { InspectionHoverSubmitBtn } from "../../../components/InspectionHoverSubmitBtn";
import {
  farmerSubmission,
  registrationAction,
} from "../../../redux/farmer/RegistrationSlice";
import { dataTodb } from "../../../helpers/dataTodb";
import LottieView from "lottie-react-native";
import { SyncModal } from "../../../components/SyncModal";

export const PendingRegistrationsScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const submissionState = useSelector((state) => state.registration);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [registrations, setRegistrations] = useState([]);
  const [Submitted, setSubmitted] = useState(false);
  const [newHHs, setNewHHs] = useState([]);
  const [currentJob, setCurrentJob] = useState();

  const [loading, setLoading] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);

  const handleUpload = () => {
    setLoading(true);
    dispatch(farmerSubmission(registrations));
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

  useEffect(() => {
    if (currentJob === "Farmer details saved") {
      dataTodb({ tableName: "households", setCurrentJob, syncData: newHHs });
    } else if (currentJob === "Household details saved") {
      displayToast("Done");
      setLoading(false);
    }
  }, [currentJob]);

  useEffect(() => {
    if (submissionState.serverResponded) {
      setSubmitted(true);

      if (submissionState.response.status === "success") {
        let { uploadedFarmers, uploadedHH } = submissionState.response;
        let newFarmers = [];
        let newHouseholds = [];

        for (let farmer of uploadedFarmers) {
          farmer = {
            ...farmer,
            ...{ deleted: "0", deleted_by: "", deleted_at: "", sync: 1 },
          };
          newFarmers.push(farmer);
        }

        for (let hh of uploadedHH) {
          hh = { ...hh, ...{ sync: 1 } };
          newHouseholds.push(hh);
        }

        setNewHHs(newHouseholds);

        dataTodb({
          tableName: "farmers",
          setCurrentJob,
          syncData: newFarmers,
        });
      }
    }
  }, [submissionState.serverResponded]);

  useEffect(() => {
    setLoading(false);
  }, [registrations]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const currentUser = await SecureStore.getItemAsync("rtc-user-name");

        if (currentUser) {
          setLoading(true);
          retrieveDBdata({
            tableName: "rtc_farmers",
            setData: setRegistrations,
            queryArg: `SELECT household.*,farmer.* FROM rtc_farmers AS farmer INNER JOIN rtc_households AS household ON farmer._kf_Household = household.__kp_Household AND farmer.sync = 0 AND farmer.deleted = 0 AND farmer.created_by = '${currentUser}'`,
          });
        }
      };

      fetchData();
      return () => {
        setRegistrations([]);
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
          Pending Registration
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {registrations.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={registrations}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <FarmerPendingCard
              data={item}
              registrationDate={formatDate(item.registered_at)}
            />
          )}
          keyExtractor={(item) => item.__kp_Farmer}
        />
      )}

      {registrations.length > 0 && (
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
