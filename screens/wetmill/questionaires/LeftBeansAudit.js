import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { leftBeansSchema } from "../../../validation/wetmillAuditSchema";

export const LeftBeansAudit = ({
  setNextModal,
  parchDayEstimate,
  setAudit,
  responses,
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

    console.log(newErrors);
    setErrors(newErrors);
    return false;
  };

  const submitForm = (values) => {
    try {
      let leftbeansObj = {
        ...values,
      };

      if (!validateForm(leftbeansObj, leftBeansSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...leftbeansObj }));
      setNextModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getInputLabel = (input) => {
    if (input === "manpower_count") output = "Cherries reported in books";
    if (input === "handsorter_count") output = "Discrepancy reason";

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
            manpower_count: responses.manpower_count || "0",
            handsorter_count: responses.handsorter_count || "0",
            parch_person_day_manpower:
              responses.parch_person_day_manpower || "0",
            parch_person_day_handsorter:
              responses.parch_person_day_handsorter || "0",
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
        elevation: 5,
      }}
    >
      <Text
        style={{
          fontSize: screenHeight * 0.022,
          fontWeight: "600",
          marginVertical: screenHeight * 0.01,
        }}
      >
        Left Beans
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
          manpower_count: responses.manpower_count || "0",
          handsorter_count: responses.handsorter_count || "0",
          parch_person_day_manpower: responses.parch_person_day_manpower || "0",
          parch_person_day_handsorter:
            responses.parch_person_day_handsorter || "0",
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
                  handleChange={(text) => {
                    handleChange("manpower_count")(text);

                    let parch_person =
                      parseFloat(parchDayEstimate) / (parseFloat(text) || 1);

                    setFieldValue(
                      "parch_person_day_manpower",
                      parch_person.toFixed(2)
                    );
                  }}
                  handleBlur={handleBlur("manpower_count")}
                  label={
                    "How many people are working as manpower at the station today?"
                  }
                  value={responses.manpower_count || values.manpower_count}
                  active={true}
                  error={errors.manpower_count}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: screenWidth * 0.04,
                    color: colors.black,
                    marginLeft: screenWidth * 0.02,
                  }}
                >
                  At this rate, each person under manpower is averaging{" "}
                  {responses.parch_person_day_manpower ||
                    values.parch_person_day_manpower ||
                    0}{" "}
                  kilograms of parchment per day
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={(text) => {
                    handleChange("handsorter_count")(text);

                    let parch_person =
                      parseFloat(parchDayEstimate) / (parseFloat(text) || 1);

                    setFieldValue(
                      "parch_person_day_handsorter",
                      parch_person.toFixed(2)
                    );
                  }}
                  handleBlur={handleBlur("handsorter_count")}
                  label={
                    "How many handsorters are working at the station today?"
                  }
                  value={responses.handsorter_count || values.handsorter_count}
                  active={true}
                  error={errors.handsorter_count}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: screenWidth * 0.04,
                    color: colors.black,
                    marginLeft: screenWidth * 0.02,
                    marginBottom: screenHeight * 0.02,
                  }}
                >
                  At this rate, each handsorter is averaging{" "}
                  {responses.parch_person_day_handsorter ||
                    values.parch_person_day_handsorter}{" "}
                  Kilograms of parchment per day
                </Text>

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
