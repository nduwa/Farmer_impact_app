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
import { FarmerDetailsSchema } from "../../../validation/CensusSurveySchema";

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
        ...{ gender },
      };

      if (!validateForm(farmerObj, FarmerDetailsSchema)) return;

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
            station_name: farmerData.stationName,
            farmer_name: responses.farmer_name || farmerData.Name || "",
            farmer_id: responses.farmerid || farmerData.farmerid || "",
            group_id: responses.group_id || farmerData.groupid || "",
            national_id: responses.national_id || farmerData.National_ID_t,
            year_of_birth: String(farmerData.Year_Birth || ""),
            gender,
            phone: responses.phone || farmerData.Phone || "",
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
          station_name: farmerData.stationName,
          farmer_name: responses.farmer_name || farmerData.Name || "",
          farmer_id: responses.farmer_id || farmerData.farmerid || "",
          group_id: responses.group_id || farmerData.farmerGroupID || "",
          national_id: responses.national_id || farmerData.National_ID_t,
          year_of_birth: String(farmerData.Year_Birth || ""),
          gender,
          phone: responses.phone || farmerData.Phone || "",
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
                  handleChange={handleChange("station_name")}
                  handleBlur={handleBlur("station_name")}
                  label={"Station name"}
                  value={values.station_name}
                  active={false}
                  error={errors.station_name}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("farmer_name")}
                  handleBlur={handleBlur("farmer_name")}
                  label={"Farmer name"}
                  active={true}
                  value={values.farmer_name}
                  error={errors.farmer_name}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("farmer_id")}
                  handleBlur={handleBlur("farmer_id")}
                  label={"Farmer ID"}
                  value={values.farmer_id}
                  active={false}
                  error={errors.farmer_id}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("group_id")}
                  handleBlur={handleBlur("group_id")}
                  label={"Group ID"}
                  active={false}
                  value={values.group_id}
                  error={errors.group_id}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("national_id")}
                  handleBlur={handleBlur("national_id")}
                  label={"National ID"}
                  active={true}
                  value={values.national_id}
                  error={errors.national_id}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("year_of_birth")}
                  handleBlur={handleBlur("year_of_birth")}
                  label={"Year of birth"}
                  value={values.year_of_birth}
                  active={true}
                  error={errors.year_of_birth}
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
                    onSelected={(value) => setGender(value)}
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
                  error={errors.phone}
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
