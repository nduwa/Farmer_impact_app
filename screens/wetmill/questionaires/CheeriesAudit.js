import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { cherriesSchema } from "../../../validation/wetmillAuditSchema";
import { useFocusEffect } from "@react-navigation/native";

export const CheeriesAudit = ({
  stationName,
  setNextModal,
  setAudit,
  responses,
  cherriesSMS,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [discrepancy, setDiscrepancy] = useState({
    percentage: 0,
    kgs: 0,
  });
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
      let cherriesObj = {
        ...values,
        ...{
          discrepancy_perc_cherries:
            responses.discrepancy_perc_cherries ||
            String(discrepancy.percentage),
          discrepancy_kgs_cherries:
            responses.discrepancy_kgs_cherries || String(discrepancy.kgs),
          cherries_sms: responses.cherries_sms || String(cherriesSMS),
        },
      };

      if (!validateForm(cherriesObj, cherriesSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...cherriesObj }));
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
            cherries_books: responses.cherries_books || "0",
            cherries_sms: responses.cherries_sms || cherriesSMS,
          });

          setDiscrepancy({
            percentage: responses.discrepancy_perc_cherries || 0,
            kgs: responses.discrepancy_kgs_cherries || 0,
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
        Cherries
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
          cherries_sms: responses.cherries_sms || String(cherriesSMS),
          cherries_books: responses.cherries_books || "0",
          discrepancy_reason_cherries:
            responses.discrepancy_reason_cherries || "",
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
                  handleChange={handleChange("cherries_sms")}
                  handleBlur={handleBlur("cherries_sms")}
                  keyboardType={"numeric"}
                  label={
                    "Kilograms of cherries reported to FileMaker season-to-date"
                  }
                  value={values.cherries_sms}
                  active={true}
                  error={errors.cherries_sms === "cherries_sms"}
                />
                <BuyCoffeeInput
                  values={values}
                  keyboardType={"numeric"}
                  handleChange={(text) => {
                    handleChange("cherries_books")(text);

                    let diff = parseFloat(cherriesSMS) - parseFloat(text);
                    let perc = (diff / cherriesSMS) * 100;
                    setDiscrepancy({
                      percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                      kgs: isNaN(diff) ? 0 : diff,
                    });
                  }}
                  handleBlur={handleBlur("cherries_books")}
                  label={
                    "How many total kilograms of cherries has the station reported in their books season to date?"
                  }
                  value={values.cherries_books}
                  active={true}
                  error={errors.cherries_books === "cherries_books"}
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
                  {stationName} Has a cherry discrepancy of{" "}
                  {discrepancy.percentage}% ({discrepancy.kgs} kilograms).
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
                  handleChange={handleChange("discrepancy_reason_cherries")}
                  handleBlur={handleBlur("discrepancy_reason_cherries")}
                  label={"Why is there any discrepancy"}
                  value={values.discrepancy_reason_cherries}
                  active={true}
                  error={
                    errors.discrepancy_reason_cherries ===
                    "discrepancy_reason_cherries"
                  }
                />

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
