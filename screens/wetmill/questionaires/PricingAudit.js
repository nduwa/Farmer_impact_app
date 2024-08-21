import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import CustomButton from "../../../components/CustomButton";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

export const PricingAudit = ({ stationName }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [choice, setChoice] = useState(false);
  const [discrepancy, setDiscrepancy] = useState({
    percentage: 0,
    kgs: 0,
  });
  const [buckets, setBuckets] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [errors, setErrors] = useState({}); // validation errors
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

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
          GLC647: choice,
          GLC648: "",
          GLC649: "",
          comment: "",
        }}
        onSubmit={async (values) => {}}
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
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC648")}
                  handleBlur={handleBlur("GLC648")}
                  label={
                    "How many total buckets of parchment have been counted for season to date?"
                  }
                  value={values.GLC648}
                  active={true}
                  error={errors.GLC648 === "GLC648"}
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
                  {discrepancy.percentage}% ({buckets} buckets)
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
                  handleChange={handleChange("comment")}
                  handleBlur={handleBlur("comment")}
                  label={"Why is there any discrepancy"}
                  value={values.comment}
                  active={true}
                  error={errors.comment === "comment"}
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
