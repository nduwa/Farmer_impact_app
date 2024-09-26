import * as SecureStore from "expo-secure-store";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FarmDetailsSchema } from "../../../validation/CensusSurveySchema";

export const FarmDetails = ({
  setNextModal,
  setSurvey,
  responses,
  setLocationModal,
  location,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

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
      let farmObj = {
        ...values,
        ...{
          latitude: location.latitude,
          longitude: location.longitude,
        },
      };

      const { farmLocation, ...rest } = farmObj;

      if (!validateForm(rest, FarmDetailsSchema)) return;

      setSurvey((prevState) => ({ ...prevState, ...rest }));
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
            farmLocation: responses.latitude
              ? `${responses.latitude}, ${responses.longitude}`
              : "",
            coffee_trees: responses.coffee_trees || "",
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
        Farm Details
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
          farmLocation: responses.latitude
            ? `${responses.latitude}, ${responses.longitude}`
            : "",
          coffee_trees: responses.coffee_trees || "",
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
                <View>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmLocation")}
                    handleBlur={handleBlur("farmLocation")}
                    label={"Farm coordinates"}
                    value={
                      location
                        ? `${location?.latitude}, ${location.longitude}`
                        : ""
                    }
                    active={false}
                    error={errors.latitude || errors.longitude}
                  />
                  <>
                    <TouchableOpacity
                      onPress={() => setLocationModal(true)}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.775,
                        top: "47%",
                        backgroundColor: "white",
                        borderRadius: screenWidth * 0.009,
                        padding: screenHeight * 0.007,
                        elevation: 3,
                      }}
                    >
                      <FontAwesome6
                        name="location-dot"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setFieldValue("farmLocation", "");
                        setLocationModal(null);
                      }}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.68,
                        top: "47%",
                        backgroundColor: "white",
                        borderRadius: screenWidth * 0.009,
                        padding: screenHeight * 0.007,
                        elevation: 3,
                      }}
                    >
                      <MaterialIcons
                        name="clear"
                        size={screenWidth * 0.05}
                        color="black"
                      />
                    </TouchableOpacity>
                  </>
                </View>
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("coffee_trees")}
                  handleBlur={handleBlur("coffee_trees")}
                  label={"Total Number of coffee trees"}
                  value={values.coffee_trees}
                  error={errors.coffee_trees}
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
