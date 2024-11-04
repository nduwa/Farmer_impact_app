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
import LottieView from "lottie-react-native";
import { SyncModal } from "../../../components/SyncModal";
import { updateDBdata } from "../../../helpers/updateDBdata";

export const PendingRegistrationsScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const submissionState = useSelector((state) => state.registration);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [registrations, setRegistrations] = useState([]);
  const [Submitted, setSubmitted] = useState(false);
  const [currentJob, setCurrentJob] = useState();

  const [loading, setLoading] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [token, setToken] = useState();

  const handleUpload = () => {
    setLoading(true);
    dispatch(farmerSubmission({ registrations, token }));
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
    if (currentJob === "Farmers uploaded") {
      displayToast("Done");
      setLoading(false);
    } else if (currentJob === "not uploaded") {
      displayToast("Error farmers not uploaded");
      setLoading(false);
    }
  }, [currentJob]);

  useEffect(() => {
    if (submissionState.serverResponded) {
      setSubmitted(true);

      if (submissionState.response.status === "success") {
        let registeredFarmers = registrations;
        let query = "";
        let strIDs = "";
        let i = 0;

        if (registeredFarmers.length > 1) {
          for (const farmer of registeredFarmers) {
            strIDs += `'${farmer.id}'`;
            if (i < registeredFarmers.length - 1) strIDs += ",";
            i++;
          }
          query = `UPDATE rtc_field_farmers SET uploaded = 1 WHERE id IN(${strIDs})`;
        } else {
          query = `UPDATE rtc_field_farmers SET uploaded = 1 WHERE id = '${registeredFarmers[0].id}'`;
        }

        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "Farmers uploaded",
          msgNo: "not uploaded",
        });
      }
    }
  }, [submissionState.serverResponded]);

  useEffect(() => {
    if (submissionState.error) {
      setLoading(false);
      displayToast("Error: Farmers not submitted");
      dispatch(registrationAction.resetRegistrationState());
    }
  }, [submissionState.error]);

  useEffect(() => {
    setLoading(false);
  }, [registrations]);

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
            tableName: "rtc_field_farmers",
            setData: setRegistrations,
            queryArg: `SELECT * FROM rtc_field_farmers WHERE uploaded = 0 AND full_name = '${currentUser}'`,
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
              registrationDate={formatDate(item.created_at)}
            />
          )}
          keyExtractor={(item) => item.id}
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
