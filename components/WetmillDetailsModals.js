import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../data/colors";
import CustomButton from "./CustomButton";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { BuyCoffeeInput } from "./BuyCoffeeInput";
import { Formik } from "formik";
import SimpleIconButton from "./SimpleIconButton";

export const WetmillDetailsModal = ({ label, setDetails, CloseFn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { t } = useTranslation();

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  const handleClose = () => {
    CloseFn(false);
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

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 10,
        backgroundColor: colors.black_a,
        zIndex: 11,
      }}
    >
      <View
        style={{
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          gap: screenHeight * 0.02,
          borderRadius: 15,
          backgroundColor: colors.white,
          paddingVertical: screenHeight * 0.04,
          paddingHorizontal: screenWidth * 0.04,
        }}
      >
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: "absolute",
            top: -screenHeight * 0.018,
            left: screenWidth * 0.8,
            backgroundColor: colors.white,
            borderRadius: 100,
            padding: screenHeight * 0.004,
            elevation: 4,
          }}
        >
          <AntDesign
            name="closecircleo"
            size={screenHeight * 0.035}
            color="black"
          />
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            gap: screenHeight * 0.02,
          }}
        >
          <Text style={{ fontSize: screenWidth * 0.04, fontWeight: "500" }}>
            {label}
          </Text>
          <Formik
            initialValues={{
              total_kgs: "0",
              total_buckets: "0",
            }}
            onSubmit={async (values) => {
              setDetails(values);
              handleClose();
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
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: screenHeight * 0.03,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    gap: screenHeight * 0.01,
                    width: "100%",
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
                    Total kilograms reported to FileMaker
                  </Text>
                  <TextInput
                    style={{
                      borderColor: colors.bg_variant_font,
                      backgroundColor: colors.white_variant,
                      borderWidth: 0.3,
                      borderRadius: 10,
                      padding: 7,
                      fontWeight: "500",
                      fontSize: screenWidth * 0.05,
                      color: colors.blue_font,
                      textAlign: "left",
                      width: "100%",
                    }}
                    onChangeText={handleChange("total_kgs")}
                    onBlur={handleBlur("total_kgs")}
                    value={values.total_kgs}
                    keyboardType={"numeric"}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    gap: screenHeight * 0.01,
                    width: "100%",
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
                    Total buckets reported to FileMaker
                  </Text>
                  <TextInput
                    style={{
                      borderColor: colors.bg_variant_font,
                      backgroundColor: colors.white_variant,
                      borderWidth: 0.3,
                      borderRadius: 10,
                      padding: 7,
                      fontWeight: "500",
                      fontSize: screenWidth * 0.05,
                      color: colors.blue_font,
                      textAlign: "left",
                      width: "100%",
                    }}
                    onChangeText={handleChange("total_buckets")}
                    onBlur={handleBlur("total_buckets")}
                    value={values.total_buckets}
                    keyboardType={"numeric"}
                  />
                </View>

                <SimpleIconButton
                  label={"Confirm Details"}
                  width="100%"
                  bdRadiusRatio={0.008}
                  color={colors.black}
                  labelColor="white"
                  active={true}
                  handlePress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
};
