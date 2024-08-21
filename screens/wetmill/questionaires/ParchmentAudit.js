import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import CustomButton from "../../../components/CustomButton";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import { useEffect, useState } from "react";
import { Formik } from "formik";

export const ParchmentAudit = ({
  stationName,
  parchmentYield = 0,
  cherriesReported = 0,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [discrepancy, setDiscrepancy] = useState({
    percentage: 0,
    kgs: 0,
  });
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
          GLC640: "",
          GLC641: "",
          GLC642: "",
          GLC643: "",
          GLC644: "",
          GLC645: "",
          GLC646: "",
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
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC640")}
                  handleBlur={handleBlur("GLC640")}
                  label={`Based on a cherry / parchment ratio of 5.3 and reported cherries of ${cherriesReported}, the expected parchment yield is ${parchmentYield} kilograms (season to date)`}
                  value={values.GLC640}
                  active={true}
                  error={errors.GLC640 === "GLC640"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC641")}
                  handleBlur={handleBlur("GLC641")}
                  label={`Of the ${parchmentYield} kilograms of expected parchment, how much has been delivered to Kigali?`}
                  value={values.GLC641}
                  active={true}
                  error={errors.GLC641 === "GLC641"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC642")}
                  handleBlur={handleBlur("GLC642")}
                  label={`Of the ${parchmentYield} kilograms of expected parchment, how much is currently on the tables?`}
                  value={values.GLC642}
                  active={true}
                  error={errors.GLC642 === "GLC642"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC643")}
                  handleBlur={handleBlur("GLC643")}
                  label={`Of the ${parchmentYield} kilograms of expected parchment, how much is currently in the tanks?`}
                  value={values.GLC643}
                  active={true}
                  error={errors.GLC643 === "GLC643"}
                />
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC644")}
                  handleBlur={handleBlur("GLC644")}
                  label={`Of the ${parchmentYield} kilograms of expected parchment, how much is currently in the storehouse?`}
                  value={values.GLC644}
                  active={true}
                  error={errors.GLC644 === "GLC644"}
                />
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: screenWidth * 0.04,
                    color: colors.black,
                    marginLeft: screenWidth * 0.02,
                  }}
                >
                  The station has a parchment discrepancy of{" "}
                  {discrepancy.percentage}% ({discrepancy.kgs} kilograms).
                </Text>
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC646")}
                  handleBlur={handleBlur("GLC646")}
                  label={"Why is there any discrepancy"}
                  value={values.GLC646}
                  active={true}
                  error={errors.GLC646 === "GLC646"}
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
