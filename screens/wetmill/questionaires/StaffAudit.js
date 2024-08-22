import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import Feather from "@expo/vector-icons/Feather";
import { staffSchema } from "../../../validation/wetmillAuditSchema";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";

export const StaffAudit = ({ setNextModal, totalParchment, setAudit }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

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

    setErrors(newErrors);
    return false;
  };

  const submitForm = (values) => {
    try {
      let staffObj = {
        ...values,
      };

      if (!validateForm(staffObj, staffSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...staffObj }));
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
            std_salary_expense: "0",
            std_other_expense: "0",
            std_fuel_expense: "0",
            salary_cost_kg: "0",
            fuel_cost_kg: "0",
            other_cost_kg: "0",
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
        Staff
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
          std_salary_expense: "0",
          std_other_expense: "0",
          std_fuel_expense: "0",
          salary_cost_kg: "0",
          fuel_cost_kg: "0",
          other_cost_kg: "0",
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
                    handleChange("std_salary_expense")(text);

                    let cost = parseFloat(text) / parseFloat(totalParchment);

                    setFieldValue("salary_cost_kg", cost.toFixed(2));
                  }}
                  handleBlur={handleBlur("std_salary_expense")}
                  label={"How much money has paid for salaries season to date?"}
                  value={values.std_salary_expense}
                  active={true}
                  error={errors.std_salary_expense === "std_salary_expense"}
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
                  The station is averaging {values.salary_cost_kg || 0} RWF per
                  kilogram of parchment for salary expenses this season.
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
                    handleChange("std_fuel_expense")(text);

                    let cost = parseFloat(text) / parseFloat(totalParchment);

                    setFieldValue("fuel_cost_kg", cost.toFixed(2));
                  }}
                  handleBlur={handleBlur("std_fuel_expense")}
                  label={"How much money has paid for fuel season to date?"}
                  value={values.std_fuel_expense}
                  active={true}
                  error={errors.std_fuel_expense === "std_fuel_expense"}
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
                  The station averaging {values.fuel_cost_kg || 0} RWF per
                  kilogram of parchment for fuel expenses this season.
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
                    handleChange("std_other_expense")(text);

                    let cost = parseFloat(text) / parseFloat(totalParchment);

                    setFieldValue("other_cost_kg", cost.toFixed(2));
                  }}
                  handleBlur={handleBlur("std_other_expense")}
                  label={
                    "How much money has paid for all other expenses season to date?"
                  }
                  value={values.std_other_expense}
                  active={true}
                  error={errors.std_other_expense === "std_other_expense"}
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
                  The station is averaging {values.other_cost_kg || 0} RWF per
                  kilogram of parchment for all other expenses this season
                </Text>

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
