import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import Feather from "@expo/vector-icons/Feather";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { expenseSchema } from "../../../validation/wetmillAuditSchema";

export const ExpensesAudit = ({
  stationName,
  setNextModal,
  cherriesPurchased,
  setAudit,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [cherriesKgs, setCherriesKgs] = useState(0);
  const [discrepancy, setDiscrepancy] = useState({
    percentage: 0,
    kgs: 0,
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
      let expObj = {
        ...values,
        ...{
          discrepancy_perc_expenses: String(discrepancy.percentage),
          discrepancy_kgs_expenses: String(discrepancy.kgs),
          expected_std_cherries: String(cherriesKgs),
        },
      };

      if (!validateForm(expObj, expenseSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...expObj }));
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
            std_price: "0",
            std_total_paid: "0",
          });
          setDiscrepancy({ percentage: 0, kgs: 0 });
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
        Expenses
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
          std_price: "0",
          std_total_paid: "0",
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
                    handleChange("std_price")(text);

                    let cherriesWeight =
                      parseFloat(values.std_total_paid) / parseFloat(text);

                    setCherriesKgs(cherriesWeight.toFixed(2));

                    let diff =
                      parseFloat(cherriesPurchased.toFixed(2)) -
                      parseFloat(cherriesWeight.toFixed(2));
                    let perc = (diff / parseFloat(cherriesPurchased)) * 100;
                    setDiscrepancy({
                      percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                      kgs: isNaN(diff) ? 0 : diff.toFixed(2),
                    });
                  }}
                  handleBlur={handleBlur("std_price")}
                  label={
                    "Average price per kilogram approved by RTC this season"
                  }
                  value={values.std_price}
                  active={true}
                  error={errors.std_price === "std_price"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={(text) => {
                    handleChange("std_total_paid")(text);

                    let cherriesWeight =
                      parseFloat(text) / parseFloat(values.std_price);

                    setCherriesKgs(cherriesWeight.toFixed(2));

                    let diff =
                      parseFloat(cherriesPurchased.toFixed(2)) -
                      parseFloat(cherriesWeight.toFixed(2));
                    let perc = (diff / parseFloat(cherriesPurchased)) * 100;
                    setDiscrepancy({
                      percentage: isNaN(perc) ? 0 : perc.toFixed(2),
                      kgs: isNaN(diff) ? 0 : diff.toFixed(2),
                    });
                  }}
                  handleBlur={handleBlur("std_total_paid")}
                  label={
                    "According to their books, what is the total amount of money that has paid for cherries this season?"
                  }
                  value={values.std_total_paid}
                  active={true}
                  error={errors.std_total_paid === "std_total_paid"}
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
                  Based on the total money paid of {values.std_total_paid || 0}{" "}
                  RWF divided by the average price per kg of{" "}
                  {values.std_price || 0} RWF, we would expect{" "}
                  {isNaN(cherriesKgs) ? 0 : cherriesKgs} kilograms of cherries.
                  The station has reported cherry purchases of{" "}
                  {cherriesPurchased || 0} kilograms, which results in a
                  discrepancy of {discrepancy.percentage || 0}%.
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
