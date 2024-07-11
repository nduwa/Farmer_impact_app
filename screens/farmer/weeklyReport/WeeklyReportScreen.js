import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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

export const WeeklyReportScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });
  const [reportValidated, setReportValidated] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const submitReport = () => {
    try {
      if (validateInputs(transactionData)) {
        setReportValidated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = (values) => {
    return true;
  };

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
          Field Weekly Report
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
                    error={validationError.inputBox === "nmbrTrained"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("attendedM")}
                    handleBlur={handleBlur("attendedM")}
                    label={"Men Attended"}
                    value={values.attendedM}
                    error={validationError.inputBox === "attendedM"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("attendedF")}
                    handleBlur={handleBlur("attendedF")}
                    label={"Women Attended"}
                    value={values.attendedF}
                    error={validationError.inputBox === "attendedF"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("groupsToTrainNextWeek")}
                    handleBlur={handleBlur("groupsToTrainNextWeek")}
                    label={"Groups planned to train next week"}
                    value={values.groupsToTrainNextWeek}
                    error={validationError.inputBox === "groupsToTrainNextWeek"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmsToInspect")}
                    handleBlur={handleBlur("farmsToInspect")}
                    label={"Number of farms inspected"}
                    value={values.farmsToInspect}
                    error={validationError.inputBox === "farmsToInspect"}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("otherActivities")}
                    handleBlur={handleBlur("otherActivities")}
                    label={"Other activities and comment"}
                    value={values.otherActivities}
                    multiline={true}
                    error={validationError.inputBox === "otherActivities"}
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
                  bg={colors.secondary}
                  color={"white"}
                  width="95%"
                  text="Confirm Purchase"
                  bdcolor="transparent"
                  mt={screenHeight * 0.017}
                  mb={
                    isKeyboardActive ? screenHeight * 0.04 : screenHeight * 0.03
                  }
                  radius={10}
                  disabled={submitted}
                  onPress={handleSubmit}
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};
