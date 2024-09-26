import * as SecureStore from "expo-secure-store";
import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { TreeDetailsBSchema } from "../../../validation/CensusSurveySchema";
import { YEAR_1ST, YEAR_2ND, YEAR_3RD, YEAR_4TH } from "@env";

export const TreeDetailsB = ({ setNextModal, setSurvey, responses }) => {
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
      let TreeDetailsObj = {
        ...values,
      };

      if (!validateForm(TreeDetailsObj, TreeDetailsBSchema)) return;

      setSurvey((prevState) => ({ ...prevState, ...TreeDetailsObj }));
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
            trees_less_than_10: responses.trees_less_than_10 || "0",
            trees_10_20: responses.trees_10_20 || "0",
            other_crops_in_farm: responses.other_crops_in_farm || "",
            other_crops_in_coffee_farm:
              responses.other_crops_in_coffee_farm || "",
            shade_trees: responses.shade_trees || "0",
            natural_shade_trees: responses.natural_shade_trees || "0",
            nitrogen_fixing_shade_trees:
              responses.nitrogen_fixing_shade_trees || "0",
            prod_est_year_4th: responses.prod_est_year_4th || "0",
            prod_est_year_3rd: responses.prod_est_year_3rd || "0",
            coffee_farms: responses.coffee_farms || "0",
            trees_20_more: responses.trees_20_more || "0",
          });
        }
      };
    }, [])
  );

  /*  year 1st = 2021,
    year 2nd = 2022,
    year 3rd = 2023,
    year 4th = 2024
*/

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
          trees_less_than_10: responses.trees_less_than_10 || "0",
          trees_10_20: responses.trees_10_20 || "0",
          other_crops_in_farm: responses.other_crops_in_farm || "",
          other_crops_in_coffee_farm:
            responses.other_crops_in_coffee_farm || "",
          shade_trees: responses.shade_trees || "0",
          natural_shade_trees: responses.natural_shade_trees || "0",
          nitrogen_fixing_shade_trees:
            responses.nitrogen_fixing_shade_trees || "0",
          prod_est_year_4th: responses.prod_est_year_4th || "0",
          prod_est_year_3rd: responses.prod_est_year_3rd || "0",
          coffee_farms: responses.coffee_farms || "0",
          trees_20_more: responses.trees_20_more || "0",
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
                  Planting year for the old productive trees
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
                  handleChange={handleChange("trees_less_than_10")}
                  handleBlur={handleBlur("trees_less_than_10")}
                  label={"Trees less than 10 years"}
                  keyboardType={"numeric"}
                  value={values.trees_less_than_10}
                  active={true}
                  error={errors.trees_less_than_10}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("trees_10_20")}
                  handleBlur={handleBlur("trees_10_20")}
                  label={"Trees between 10 and 20 years old"}
                  keyboardType={"numeric"}
                  active={true}
                  value={values.trees_10_20}
                  error={errors.trees_10_20}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("trees_20_more")}
                  handleBlur={handleBlur("trees_20_more")}
                  label={"Trees 20+ years old"}
                  keyboardType={"numeric"}
                  value={values.trees_20_more}
                  active={true}
                  error={errors.trees_20_more}
                />

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
                  handleChange={handleChange("coffee_farms")}
                  handleBlur={handleBlur("coffee_farms")}
                  label={"Number of coffee plots/Farms "}
                  keyboardType={"numeric"}
                  value={values.coffee_farms}
                  active={true}
                  error={errors.coffee_farms}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("prod_est_year_3rd")}
                  handleBlur={handleBlur("prod_est_year_3rd")}
                  label={`Estimated production in ${YEAR_3RD} (in Kg)`}
                  keyboardType={"numeric"}
                  value={values.prod_est_year_3rd}
                  active={true}
                  error={errors.prod_est_year_3rd}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("prod_est_year_4th")}
                  handleBlur={handleBlur("prod_est_year_4th")}
                  label={`Estimated production in ${YEAR_4TH} (in Kg)`}
                  keyboardType={"numeric"}
                  value={values.prod_est_year_4th}
                  active={true}
                  error={errors.prod_est_year_4th}
                />

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
                  handleChange={handleChange("nitrogen_fixing_shade_trees")}
                  handleBlur={handleBlur("nitrogen_fixing_shade_trees")}
                  label={"Total of nitrogen fixing shade trees"}
                  keyboardType={"numeric"}
                  value={values.nitrogen_fixing_shade_trees}
                  active={true}
                  error={errors.nitrogen_fixing_shade_trees}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("natural_shade_trees")}
                  handleBlur={handleBlur("natural_shade_trees")}
                  label={"Total of natural shade trees"}
                  keyboardType={"numeric"}
                  value={values.natural_shade_trees}
                  active={true}
                  error={errors.natural_shade_trees}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("shade_trees")}
                  handleBlur={handleBlur("shade_trees")}
                  label={"Total number of shade trees"}
                  keyboardType={"numeric"}
                  value={values.shade_trees}
                  active={true}
                  error={errors.shade_trees}
                />
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
                  handleChange={handleChange("other_crops_in_coffee_farm")}
                  handleBlur={handleBlur("other_crops_in_coffee_farm")}
                  label={"Other crops in the coffee farm? (List them)"}
                  keyboardType={"numeric"}
                  value={values.other_crops_in_coffee_farm}
                  active={true}
                  error={errors.other_crops_in_coffee_farm}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("other_crops_in_farm")}
                  handleBlur={handleBlur("other_crops_in_farm")}
                  label={"Other crops in your farm? (List them)"}
                  keyboardType={"numeric"}
                  value={values.other_crops_in_farm}
                  active={true}
                  error={errors.other_crops_in_farm}
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
