import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { LocalizationModal } from "../../../components/LocalizationModal";

export const ConclusionAudit = ({
  stationName,
  setChoice,
  choice,
  setModalOpen,
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
        Conclusion
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
          GLC670: "",
          GLC671: "",
          GLC672: "",
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
              height: "94%",
              width: screenWidth,
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
              <View>
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("GLC670")}
                  handleBlur={handleBlur("GLC670")}
                  label={"How much congestion is on the drying tables?"}
                  value={choice?.name}
                  error={errors.GLC670}
                  active={false}
                />
                <TouchableOpacity
                  onPress={() => setModalOpen(true)}
                  style={{
                    position: "absolute",
                    left: screenWidth * 0.775,
                    top: screenHeight * 0.045,
                    backgroundColor: "white",
                    borderRadius: screenWidth * 0.009,
                    padding: screenHeight * 0.007,
                    elevation: 3,
                  }}
                >
                  <FontAwesome6
                    name="expand"
                    size={screenWidth * 0.05}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFieldValue("GLC670", "");
                    setChoice(null);
                  }}
                  style={{
                    position: "absolute",
                    left: screenWidth * 0.68,
                    top: screenHeight * 0.045,
                    backgroundColor: "white",
                    borderRadius: screenWidth * 0.009,
                    padding: screenHeight * 0.007,
                    elevation: 3,
                  }}
                >
                  <MaterialIcons
                    name="clear"
                    size={screenWidth * 0.05}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <BuyCoffeeInput
                values={values}
                handleChange={handleChange("comment")}
                handleBlur={handleBlur("comment")}
                label={"Comments"}
                value={values.GLC668}
                active={true}
                error={errors.comment === "comment"}
              />
              <Text
                style={{
                  fontSize: screenWidth * 0.04,
                  marginLeft: screenWidth * 0.02,
                }}
              >
                Please take a good photo, which shows strengths.
              </Text>
              <SimpleIconButton
                label={"Take picture"}
                width="100%"
                color={colors.blue_font}
                labelColor="white"
                active={true}
                mv={screenHeight * 0.01}
                icon={<Entypo name="camera" size={24} color="white" />}
              />

              <BuyCoffeeInput
                values={values}
                handleChange={handleChange("GLC671")}
                handleBlur={handleBlur("GLC671")}
                label={"Do you have any other notes?"}
                value={values.GLC668}
                active={true}
                error={errors.GLC671 === "GLC671"}
              />
              <SimpleIconButton
                label={"Take picture"}
                width="100%"
                color={colors.blue_font}
                labelColor="white"
                active={true}
                mv={screenHeight * 0.01}
                icon={<Entypo name="camera" size={24} color="white" />}
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
          </View>
        )}
      </Formik>
    </View>
  );
};
