import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { pricingSchema } from "../../../validation/wetmillAuditSchema";

export const PricingAudit = ({
  stationName,
  setNextModal,
  bucketsYield,
  setAudit,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [choice, setChoice] = useState(false);
  const [discrepancy, setDiscrepancy] = useState({
    percentage: 0,
    buckets: 0,
  });
  const [loading, setLoading] = useState(false);
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
      let bucketsObj = {
        ...values,
        ...{
          discrepancy_perc_pricing: String(discrepancy.percentage),
          discrepancy_buckets_pricing: String(discrepancy.buckets),
          buckets_theory: String(bucketsYield),
          vol_participant: choice ? "yes" : "no",
        },
      };

      if (!validateForm(bucketsObj, pricingSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...bucketsObj }));
      setNextModal(true);
    } catch (error) {
      console.log(error);
    }
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

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (formRef.current) {
          formRef.current.setValues({
            buckets_actual: "0",
            discrepancy_reason_pricing: "",
          });
          setDiscrepancy({ percentage: 0, buckets: 0 });
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
        Pricing
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
          vol_participant: choice,
          buckets_actual: "0",
          discrepancy_reason_pricing: "",
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
                    Does the CWS particapate in volumetric inventory management?
                  </Text>

                  <RadioButtonGroup
                    containerStyle={{
                      marginLeft: 10,
                      marginBottom: 10,
                      gap: 5,
                    }}
                    selected={choice}
                    onSelected={(value) => setChoice(value)}
                    radioBackground={colors.secondary}
                  >
                    <RadioButtonItem
                      value={true}
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          Yes
                        </Text>
                      }
                    />
                    <RadioButtonItem
                      value={false}
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          No
                        </Text>
                      }
                    />
                  </RadioButtonGroup>
                </View>
                {choice && (
                  <>
                    <BuyCoffeeInput
                      values={values}
                      keyboardType={"numeric"}
                      handleChange={(text) => {
                        handleChange("buckets_actual")(text);

                        let diff =
                          parseFloat(bucketsYield.toFixed(2)) -
                          parseFloat(text);
                        let perc = (diff / parseFloat(bucketsYield)) * 100;
                        setDiscrepancy({
                          percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                          buckets: isNaN(diff) ? 0 : diff.toFixed(2),
                        });
                      }}
                      handleBlur={handleBlur("buckets_actual")}
                      label={
                        "How many total buckets of parchment have been counted for season to date?"
                      }
                      value={values.buckets_actual}
                      active={true}
                      error={errors.buckets_actual === "buckets_actual"}
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
                      {stationName} Has a volumetric discrepancy of{" "}
                      {discrepancy.percentage}% ({discrepancy.buckets} buckets)
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
                      handleChange={handleChange("discrepancy_reason_pricing")}
                      handleBlur={handleBlur("discrepancy_reason_pricing")}
                      label={"Why is there any discrepancy"}
                      value={values.discrepancy_reason_pricing}
                      active={true}
                      error={
                        errors.discrepancy_reason_pricing ===
                        "discrepancy_reason_pricing"
                      }
                    />
                  </>
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
            </ScrollView>
          </View>
        )}
      </Formik>
    </View>
  );
};
