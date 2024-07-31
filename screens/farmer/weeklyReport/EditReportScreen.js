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
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import { WeeklyReportSchema } from "../../../validation/WeeklyReportSchema";
import LottieView from "lottie-react-native";
import { updateDBdataAsync } from "../../../helpers/updateDBdataAsync";

export const EditReportScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { data } = route.params;

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
    navigation.navigate("PendingReportsScreen", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const submitReport = (formData) => {
    try {
      let submitData = {
        createdAt: data.createdAt,
        _kf_Staff: data._kf_Staff,
        _kf_User: data._kf_User,
        full_name: data.full_name,
        user_code: data.user_code,
        trained_number: formData.nmbrTrained,
        men_attended: formData.attendedM,
        women_attended: formData.attendedF,
        planned_groups: formData.groupsToTrainNextWeek,
        farm_inspected: formData.nmbrFarmsInspected,
        planned_inspected: formData.farmsToInspect,
        comments: formData.otherActivities,
      };

      if (!validateInputs(submitData, WeeklyReportSchema)) return;

      let updateQuery = `UPDATE rtc_field_weekly_report SET trained_number = '${submitData.trained_number}', men_attended='${submitData.men_attended}', women_attended='${submitData.women_attended}', planned_groups='${submitData.planned_groups}',farm_inspected='${submitData.farm_inspected}', planned_inspected = '${submitData.planned_inspected}', comments = '${submitData.comments}' WHERE id = '${data.id}' `;

      updateDBdataAsync({ id: data.id, query: updateQuery })
        .then((result) => {
          if (result.success) {
            setCurrentJob("report details updated");
          } else {
            setCurrentJob("Failed to update report details");
          }
        })
        .catch((error) => {
          setCurrentJob("Failed to update farmer details");
          console.log("Failed to update farmer details: ", error);
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

    if (input === "trained_number") output = "Number Trained";
    if (input === "men_attended") output = "Men Attended";
    if (input === "women_attended") output = "Women Attended";
    if (input === "planned_groups")
      output = "Groups planned to train next week";
    if (input === "farm_inspected") output = "Number of farms inspected";
    if (input === "planned_inspected") output = "Farms planned to be inspected";
    if (input === "comments") output = "Other activities and comments";

    return output;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setValidationError({
        type: "emptyOrInvalidData",
        message: `Invalid input in '${getInputLabel(
          Object.keys(errors)[0]
        )}', check the inputs highlighted in red`,
        inputBox: null,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (currentJob === "report details updated") {
      displayToast("Report details updated");
      setLoading(false);
      setFormSubmitted(true);
      navigation.navigate("PendingReportsScreen", { data: null });
    } else if (currentJob === "Failed to update report details") {
      displayToast("Failed to update report details");
      setLoading(false);
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
          Edit Report
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            nmbrTrained: data.trained_number,
            attendedM: data.men_attended,
            attendedF: data.women_attended,
            groupsToTrainNextWeek: data.planned_groups,
            nmbrFarmsInspected: data.farm_inspected,
            farmsToInspect: data.planned_inspected,
            otherActivities: data.comments,
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
                    marginTop: screenHeight * 0.025,
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
                    Fill the form accordingly
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrTrained")}
                    handleBlur={handleBlur("nmbrTrained")}
                    label={"Number Trained"}
                    value={values.nmbrTrained}
                    active={true}
                    error={errors.trained_number}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("attendedM")}
                    handleBlur={handleBlur("attendedM")}
                    label={"Men Attended"}
                    value={values.attendedM}
                    error={errors.men_attended}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("attendedF")}
                    handleBlur={handleBlur("attendedF")}
                    label={"Women Attended"}
                    value={values.attendedF}
                    error={errors.women_attended}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("groupsToTrainNextWeek")}
                    handleBlur={handleBlur("groupsToTrainNextWeek")}
                    label={"Groups planned to train next week"}
                    value={values.groupsToTrainNextWeek}
                    error={errors.planned_groups}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrFarmsInspected")}
                    handleBlur={handleBlur("nmbrFarmsInspected")}
                    label={"Number of farms inspected"}
                    value={values.nmbrFarmsInspected}
                    error={errors.farm_inspected}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmsToInspect")}
                    handleBlur={handleBlur("farmsToInspect")}
                    label={"Farms planned to be inspected"}
                    value={values.farmsToInspect}
                    error={errors.planned_inspected}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("otherActivities")}
                    handleBlur={handleBlur("otherActivities")}
                    label={"Other activities and comment"}
                    value={values.otherActivities}
                    multiline={true}
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
                      Validation Error
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
                  bg={colors.blue_font}
                  color={"white"}
                  width="95%"
                  text="Edit"
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
