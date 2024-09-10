import * as SecureStore from "expo-secure-store";
import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

export const FarmerDetails = ({
  setNextModal,
  setSurvey,
  responses,
  farmerData,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [gender, setGender] = useState(farmerData.Gender || null);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [errors, setErrors] = useState({}); // validation errors
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const validateForm = (data, schema) => {
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

  const submitForm = (values) => {
    try {
      let farmerObj = {
        ...values,
      };

      //   if (!validateForm(farmerObj, cherriesSchema)) return;

      setSurvey((prevState) => ({ ...prevState, ...farmerObj }));
      setNextModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "cheeries_books") output = "Cherries reported in books";
    if (input === "discrepancy_reason_cherries") output = "Discrepancy reason";

    return output;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setValidationError({
        type: "emptyOrInvalidData",
        message: `Invalid input at '${getInputLabel(
          Object.keys(errors)[0]
        )}', also check for any other highlighted input box`,
        inputBox: null,
      });
    }
  }, [errors]);

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
      return () => {
        if (formRef.current) {
          formRef.current.setValues({
            stationName: farmerData.stationName,
            farmerName: responses.Name || farmerData.Name || "",
            farmerID: responses.farmerid || farmerData.farmerid || "",
            nationalID: responses.National_ID_t || farmerData.National_ID_t,
            dob: String(farmerData.Year_Birth || ""),
            gender,
            phone: responses.Phone || farmerData.Phone || "",
          });
        }
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        maxWidth: screenWidth,
        alignItems: "center",
        borderRadius: screenWidth * 0.04,
        padding: 8,
        elevation: 8,
      }}
    >
      <Text
        style={{
          fontSize: screenHeight * 0.022,
          fontWeight: "600",
          marginVertical: screenHeight * 0.01,
        }}
      >
        Farmer Details
      </Text>
      <View
        style={{
          width: "100%",
          height: 2,
          backgroundColor: colors.secondary_variant,
        }}
      />
      <Formik
        initialValues={{
          stationName: farmerData.stationName,
          farmerName: responses.Name || farmerData.Name || "",
          farmerID: responses.farmerid || farmerData.farmerid || "",
          nationalID: responses.National_ID_t || farmerData.National_ID_t,
          dob: String(farmerData.Year_Birth || ""),
          gender,
          phone: responses.Phone || farmerData.Phone || "",
        }}
        innerRef={formRef}
        onSubmit={async (values) => {
          submitForm(values);
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
                width: screenWidth,
              }}
              contentContainerStyle={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: screenHeight * 0.01,
              }}
            >
              <View
                style={{
                  width: "95%",
                  backgroundColor: colors.white,
                  borderRadius: 15,
                  paddingHorizontal: screenWidth * 0.04,
                  paddingVertical: screenHeight * 0.03,
                  gap: screenHeight * 0.01,
                }}
              >
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("stationName")}
                  handleBlur={handleBlur("stationName")}
                  label={"Station name"}
                  value={values.stationName}
                  active={false}
                  error={errors.stationName === "stationName"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("farmerName")}
                  handleBlur={handleBlur("farmerName")}
                  label={"Farmer name"}
                  active={false}
                  value={values.farmerName}
                  error={errors.farmerName === "farmerName"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("farmerID")}
                  handleBlur={handleBlur("farmerID")}
                  label={"Farmer ID"}
                  value={values.farmerID}
                  active={false}
                  error={errors.farmerID === "farmerID"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("nationalID")}
                  handleBlur={handleBlur("nationalID")}
                  label={"National ID"}
                  active={false}
                  value={values.nationalID}
                  error={errors.nationalID === "nationalID"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("dob")}
                  handleBlur={handleBlur("dob")}
                  label={"Year of birth"}
                  value={values.dob}
                  active={false}
                  error={errors.dob === "dob"}
                />
                <View
                  style={{
                    gap: screenHeight * 0.015,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: screenWidth * 0.04,
                      color: colors.black,
                      marginLeft: screenWidth * 0.02,
                    }}
                  >
                    Gender
                  </Text>

                  <RadioButtonGroup
                    containerStyle={{
                      marginLeft: 10,
                      marginBottom: 10,
                      gap: 5,
                    }}
                    selected={gender}
                    onSelected={(value) => setGender(gender)}
                    radioBackground={colors.secondary}
                  >
                    <RadioButtonItem
                      value={"M"}
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          Male
                        </Text>
                      }
                    />
                    <RadioButtonItem
                      value={"F"}
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          Female
                        </Text>
                      }
                    />
                  </RadioButtonGroup>
                </View>

                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("phone")}
                  handleBlur={handleBlur("phone")}
                  label={"Phone number"}
                  value={values.phone}
                  error={errors.phone === "phone"}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />

                {/* validation error */}
                {validationError.message && (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: colors.white_variant,
                      elevation: 2,
                      borderWidth: 0.7,
                      borderColor: "red",
                      borderRadius: 15,
                      paddingHorizontal: screenWidth * 0.02,
                      paddingVertical: screenHeight * 0.02,
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

                <SimpleIconButton
                  label={"Save"}
                  width="100%"
                  color={colors.secondary}
                  labelColor="white"
                  active={true}
                  handlePress={handleSubmit}
                  icon={<Feather name="save" size={24} color="white" />}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    </View>
  );
};
