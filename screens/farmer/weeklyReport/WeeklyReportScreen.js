import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import { WeeklyReportSchema } from "../../../validation/WeeklyReportSchema";
import { getCurrentDate } from "../../../helpers/getCurrentDate";
import { dataTodb } from "../../../helpers/dataTodb";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const WeeklyReportScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userData = useSelector((state) => state.user.userData);
  const { t } = useTranslation();

  const [currentStationID, setCurrentStationID] = useState();
  const [supplierID, setSupplierID] = useState();
  const [CWname, setCWName] = useState();

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });
  const [errors, setErrors] = useState({}); // validation errors
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const submitReport = (formData) => {
    try {
      let nameFull = userData.user.Name_Full;
      let userkf = userData.user.__kp_User;
      let userCode = userData.staff.userID;
      let staffKf = userData.staff.__kp_Staff;

      let submitData = {
        createdAt: getCurrentDate(),
        _kf_Staff: staffKf,
        _kf_User: userkf,
        full_name: nameFull,
        user_code: userCode,
        trained_number: formData.nmbrTrained,
        men_attended: formData.attendedM,
        women_attended: formData.attendedF,
        planned_groups: formData.groupsToTrainNextWeek,
        farm_inspected: formData.nmbrFarmsInspected,
        planned_inspected: formData.farmsToInspect,
        comments: formData.otherActivities,
      };

      if (!validateInputs(submitData, WeeklyReportSchema)) return;

      let kfsupplier = supplierID;
      let kfstation = currentStationID;
      let stationName = CWname;

      dataTodb({
        tableName: "weeklyReports",
        syncData: [submitData],
        setCurrentJob,
        extraValArr: [kfstation, kfsupplier, stationName],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = (data, schema) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) {
      setErrors({});
      setValidationError({
        type: null,
        message: null,
        inputBox: null,
      });

      return true;
    }

    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.path[0]] = detail.message;
    });
    setErrors(newErrors);
    return false;
  };

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "trained_number")
      output = t("weekly_report.inputs.number_trained");
    if (input === "men_attended")
      output = t("weekly_report.inputs.men_attended");
    if (input === "women_attended")
      output = t("weekly_report.inputs.women_attended");
    if (input === "planned_groups")
      output = t("weekly_report.inputs.groups_planned");
    if (input === "farm_inspected")
      output = t("weekly_report.inputs.farms_inspected");
    if (input === "planned_inspected")
      output = t("weekly_report.inputs.farms_planned");
    if (input === "comments") output = t("weekly_report.inputs.comments");

    return output;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setValidationError({
        type: "emptyOrInvalidData",
        message: t("weekly_report.errors.invalid_input_error", {
          name: getInputLabel(Object.keys(errors)[0]),
        }),
        inputBox: null,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (currentJob === "Report saved") {
      displayToast(t("weekly_report.toast.saved_registration_pending"));
      setLoading(false);
      setFormSubmitted(true);
    }
  }, [currentJob]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardActive(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardActive(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isKeyboardActive]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const stationId = await SecureStore.getItemAsync("rtc-station-id");
        const supplierID = await SecureStore.getItemAsync("rtc-supplier-id");
        const stationName = await SecureStore.getItemAsync("rtc-station-name");

        if (stationId) {
          setCurrentStationID(stationId);
          setSupplierID(supplierID);
          setCWName(stationName);
        }
      };

      fetchData();
      return () => {
        setLoading(false);
        setFormSubmitted(false);
        setErrors({});
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
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
          {t("weekly_report.title")}
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            nmbrTrained: "0",
            attendedM: "0",
            attendedF: "0",
            groupsToTrainNextWeek: "0",
            nmbrFarmsInspected: "0",
            farmsToInspect: "0",
            otherActivities: "",
          }}
          onSubmit={async (values) => {
            submitReport(values);
          }}
        >
          {({
            handleChange,
            setFieldValue,
            handleBlur,
            handleSubmit,
            values,
          }) => (
            <View
              style={{
                gap: 18,
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  height: "94%",
                }}
                contentContainerStyle={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: screenHeight * 0.01,
                  paddingVertical: screenHeight * 0.005,
                }}
              >
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
                    borderRadius: 15,
                    marginTop: screenHeight * 0.01,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
                    gap: screenHeight * 0.01,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: screenWidth * 0.05,
                      color: colors.secondary,
                      marginLeft: screenWidth * 0.02,
                    }}
                  >
                    {t("weekly_report.form_title")}
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrTrained")}
                    handleBlur={handleBlur("nmbrTrained")}
                    label={t("weekly_report.inputs.number_trained")}
                    value={values.nmbrTrained}
                    active={true}
                    error={errors.trained_number}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("attendedM")}
                    handleBlur={handleBlur("attendedM")}
                    label={t("weekly_report.inputs.men_attended")}
                    value={values.attendedM}
                    error={errors.men_attended}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("attendedF")}
                    handleBlur={handleBlur("attendedF")}
                    label={t("weekly_report.inputs.women_attended")}
                    value={values.attendedF}
                    error={errors.women_attended}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("groupsToTrainNextWeek")}
                    handleBlur={handleBlur("groupsToTrainNextWeek")}
                    label={t("weekly_report.inputs.groups_planned")}
                    value={values.groupsToTrainNextWeek}
                    error={errors.planned_groups}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrFarmsInspected")}
                    handleBlur={handleBlur("nmbrFarmsInspected")}
                    label={t("weekly_report.inputs.farms_inspected")}
                    value={values.nmbrFarmsInspected}
                    error={errors.farm_inspected}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmsToInspect")}
                    handleBlur={handleBlur("farmsToInspect")}
                    label={t("weekly_report.inputs.farms_planned")}
                    value={values.farmsToInspect}
                    error={errors.planned_inspected}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("otherActivities")}
                    handleBlur={handleBlur("otherActivities")}
                    label={t("weekly_report.inputs.comments")}
                    value={values.otherActivities}
                    multiline={true}
                    font_sm={0.04}
                    error={errors.comments}
                  />
                </View>

                {/* validation error */}
                {validationError.message && (
                  <View
                    style={{
                      width: "95%",
                      backgroundColor: colors.white_variant,
                      elevation: 2,
                      borderWidth: 0.7,
                      borderColor: "red",
                      borderRadius: 15,
                      paddingHorizontal: screenWidth * 0.04,
                      paddingVertical: screenHeight * 0.03,
                      gap: screenHeight * 0.01,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.05,
                        color: colors.secondary,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      {t("weekly_report.errors.validation_error")}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.04,
                        color: colors.black_letter,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      {validationError.message}
                    </Text>
                  </View>
                )}

                <CustomButton
                  bg={colors.secondary}
                  color={"white"}
                  width="95%"
                  text={t("weekly_report.button")}
                  bdcolor="transparent"
                  mt={screenHeight * 0.017}
                  mb={
                    isKeyboardActive ? screenHeight * 0.04 : screenHeight * 0.03
                  }
                  radius={10}
                  disabled={formSubmitted}
                  onPress={handleSubmit}
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>

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
