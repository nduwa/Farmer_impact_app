import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { parchSchema } from "../../../validation/wetmillAuditSchema";

export const ParchmentAudit = ({
  responses,
  setNextModal,
  parchmentYield = 0,
  cherriesReported = 0,
  setAudit,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [discrepancy, setDiscrepancy] = useState({
    percentage: 0,
    kgs: 0,
  });
  const [parchTotal, setParchTotal] = useState(0);
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
      let parchObj = {
        ...values,
        ...{
          discrepancy_perc_parch:
            responses.discrepancy_perc_parch || String(discrepancy.percentage),
          discrepancy_kgs_parch:
            responses.discrepancy_kgs_parch || String(discrepancy.kgs),
          parch_total: responses.parch_total || String(parchTotal),
          parch_theory: responses.parch_theory || String(parchmentYield),
        },
      };

      if (!validateForm(parchObj, parchSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...parchObj }));
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
            parch_delivered: responses.parch_delivered || "0",
            parch_tables: responses.parch_tables || "0",
            parch_tanks: responses.parch_tanks || "0",
            parch_storehouse: responses.parch_storehouse || "0",
            discrepancy_reason_parch: responses.discrepancy_reason_parch || "",
          });
          setDiscrepancy({
            percentage: responses.discrepancy_perc_parch || 0,
            kgs: responses.discrepancy_kgs_parch,
          });
          setParchTotal(responses.parch_total || 0);
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
        Parchment
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
          parch_delivered: responses.parch_delivered || "0",
          parch_tables: responses.parch_tables || "0",
          parch_tanks: responses.parch_tanks || "0",
          parch_storehouse: responses.parch_storehouse || "0",
          discrepancy_reason_parch: responses.discrepancy_reason_parch || "",
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
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: screenWidth * 0.04,
                    color: colors.black,
                    marginLeft: screenWidth * 0.02,
                  }}
                >
                  Based on a cherry / parchment ratio of 5.3 and reported
                  cherries of {cherriesReported.toLocaleString()} kilograms, the
                  expected parchment yield is{" "}
                  {parseFloat(parchmentYield.toFixed(2)).toLocaleString()}{" "}
                  kilograms (season to date)
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
                  keyboardType={"numeric"}
                  handleChange={(text) => {
                    handleChange("parch_delivered")(text);

                    let current_total =
                      (parseFloat(values.parch_storehouse) || 0) +
                      (parseFloat(values.parch_tables) || 0) +
                      (parseFloat(values.parch_tanks) || 0) +
                      (parseFloat(text) || 0);

                    setParchTotal(current_total);

                    let diff =
                      parseFloat(parchmentYield.toFixed(2)) -
                      parseFloat(current_total);
                    let perc = (diff / parseFloat(parchmentYield)) * 100;
                    setDiscrepancy({
                      percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                      kgs: isNaN(diff) ? 0 : diff.toFixed(2),
                    });
                  }}
                  handleBlur={handleBlur("parch_delivered")}
                  label={`Of the ${parseFloat(
                    parchmentYield.toFixed(2)
                  ).toLocaleString()} kilograms of expected parchment, how much has been delivered to Kigali?`}
                  value={responses.parch_delivered || values.parch_delivered}
                  active={true}
                  error={errors.parch_delivered === "parch_delivered"}
                />
                <BuyCoffeeInput
                  values={values}
                  keyboardType={"numeric"}
                  handleChange={(text) => {
                    handleChange("parch_tables")(text);

                    let current_total =
                      (parseFloat(values.parch_storehouse) || 0) +
                      (parseFloat(text) || 0) +
                      (parseFloat(values.parch_tanks) || 0) +
                      (parseFloat(values.parch_delivered) || 0);

                    setParchTotal(current_total);

                    let diff =
                      parseFloat(parchmentYield.toFixed(2)) -
                      parseFloat(current_total);
                    let perc = (diff / parseFloat(parchmentYield)) * 100;
                    setDiscrepancy({
                      percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                      kgs: isNaN(diff) ? 0 : diff.toFixed(2),
                    });
                  }}
                  handleBlur={handleBlur("parch_tables")}
                  label={`Of the ${parchmentYield.toFixed(
                    2
                  )} kilograms of expected parchment, how much is currently on the tables?`}
                  value={responses.parch_tables || values.parch_tables}
                  active={true}
                  error={errors.parch_tables === "parch_tables"}
                />
                <BuyCoffeeInput
                  values={values}
                  keyboardType={"numeric"}
                  handleChange={(text) => {
                    handleChange("parch_tanks")(text);

                    let current_total =
                      (parseFloat(values.parch_storehouse) || 0) +
                      (parseFloat(values.parch_tables) || 0) +
                      (parseFloat(text) || 0) +
                      (parseFloat(values.parch_delivered) || 0);

                    setParchTotal(current_total);

                    let diff =
                      parseFloat(parchmentYield.toFixed(2)) -
                      parseFloat(current_total);
                    let perc = (diff / parseFloat(parchmentYield)) * 100;
                    setDiscrepancy({
                      percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                      kgs: isNaN(diff) ? 0 : diff.toFixed(2),
                    });
                  }}
                  handleBlur={handleBlur("parch_tanks")}
                  label={`Of the ${parseFloat(
                    parchmentYield.toFixed(2)
                  ).toLocaleString()} kilograms of expected parchment, how much is currently in the tanks?`}
                  value={responses.parch_tanks || values.parch_tanks}
                  active={true}
                  error={errors.parch_tanks === "parch_tanks"}
                />
                <BuyCoffeeInput
                  values={values}
                  keyboardType={"numeric"}
                  handleChange={(text) => {
                    handleChange("parch_storehouse")(text);

                    let current_total =
                      (parseFloat(text) || 0) +
                      (parseFloat(values.parch_tables) || 0) +
                      (parseFloat(values.parch_tanks) || 0) +
                      (parseFloat(values.parch_delivered) || 0);

                    setParchTotal(current_total);

                    let diff =
                      parseFloat(parchmentYield.toFixed(2)) -
                      parseFloat(current_total);
                    let perc = (diff / parseFloat(parchmentYield)) * 100;
                    setDiscrepancy({
                      percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                      kgs: isNaN(diff) ? 0 : diff.toFixed(2),
                    });
                  }}
                  handleBlur={handleBlur("parch_storehouse")}
                  label={`Of the ${parseFloat(
                    parchmentYield.toFixed(2)
                  ).toLocaleString()} kilograms of expected parchment, how much is currently in the storehouse?`}
                  value={responses.parch_storehouse || values.parch_storehouse}
                  active={true}
                  error={errors.parch_storehouse === "parch_storehouse"}
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
                  The station has a parchment discrepancy of{" "}
                  {discrepancy.percentage || 0}% ({discrepancy.kgs || 0}{" "}
                  kilograms).
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
                  keyboardType={"numeric"}
                  handleChange={handleChange("discrepancy_reason_parch")}
                  handleBlur={handleBlur("discrepancy_reason_parch")}
                  label={"Why is there any discrepancy"}
                  value={values.discrepancy_reason_parch}
                  active={true}
                  error={
                    errors.discrepancy_reason_parch ===
                    "discrepancy_reason_parch"
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
