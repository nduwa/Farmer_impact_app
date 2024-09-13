import * as SecureStore from "expo-secure-store";
import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { TreeDetailsASchema } from "../../../validation/CensusSurveySchema";
import { YEAR_1ST, YEAR_2ND, YEAR_3RD, YEAR_4TH } from "@env";

export const TreeDetailsA = ({
  setNextModal,
  setSurvey,
  responses,
  farmerData,
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
      let treeDetailsObj = {
        ...values,
      };

      if (!validateForm(treeDetailsObj, TreeDetailsASchema)) return;

      setSurvey((prevState) => ({ ...prevState, ...treeDetailsObj }));
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

  /*  year 1st = 2021,
    year 2nd = 2022,
    year 3rd = 2023,
    year 4th = 2024
*/

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (formRef.current) {
          formRef.current.setValues({
            seedlings_year_1st: responses.seedlings_year_1st || "0",
            seedlings_year_2nd: responses.seedlings_year_2nd || "0",
            seedlings_year_3rd: responses.seedlings_year_3rd || "0",
            rejuvenated_year_3rd: responses.rejuvenated_year_3rd || "0",
            rejuvenated_year_4th: responses.rejuvenated_year_4th || "0",
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
        Trees Details
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
          seedlings_year_1st: responses.seedlings_year_1st || "0",
          seedlings_year_2nd: responses.seedlings_year_2nd || "0",
          seedlings_year_3rd: responses.seedlings_year_3rd || "0",
          rejuvenated_year_3rd: responses.rejuvenated_year_3rd || "0",
          rejuvenated_year_4th: responses.rejuvenated_year_3rd || "0",
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
                  Received seedlings({YEAR_1ST}-{YEAR_3RD})
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
                  handleChange={handleChange("seedlings_year_1st")}
                  handleBlur={handleBlur("seedlings_year_1st")}
                  label={`Year ${YEAR_1ST}`}
                  keyboardType={"numeric"}
                  value={values.seedlings_year_1st}
                  active={true}
                  error={errors.seedlings_year_1st}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("seedlings_year_2nd")}
                  handleBlur={handleBlur("seedlings_year_2nd")}
                  label={`Year ${YEAR_2ND}`}
                  keyboardType={"numeric"}
                  active={true}
                  value={values.seedlings_year_2nd}
                  error={errors.seedlings_year_2nd}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("seedlings_year_3rd")}
                  handleBlur={handleBlur("seedlings_year_3rd")}
                  label={`Year ${YEAR_3RD}`}
                  keyboardType={"numeric"}
                  value={values.seedlings_year_3rd}
                  active={true}
                  error={errors.seedlings_year_3rd}
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
                  Number of rejuvenated coffee trees, if any ({YEAR_3RD}-
                  {YEAR_4TH})
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
                  handleChange={handleChange("rejuvenated_year_3rd")}
                  handleBlur={handleBlur("rejuvenated_year_3rd")}
                  label={`Year ${YEAR_3RD}`}
                  keyboardType={"numeric"}
                  value={values.rejuvenated_year_3rd}
                  active={true}
                  error={errors.rejuvenated_year_3rd}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("rejuvenated_year_4th")}
                  handleBlur={handleBlur("rejuvenated_year_4th")}
                  label={`Year ${YEAR_4TH}`}
                  keyboardType={"numeric"}
                  value={values.rejuvenated_year_4th}
                  active={true}
                  error={errors.rejuvenated_year_4th}
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
