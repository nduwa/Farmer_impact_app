import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../components/BuyCoffeeInput";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { LinearGradient } from "expo-linear-gradient";

export const RegisteredFarmerScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [current, setCurrent] = useState("test");

  const handleBackButton = () => {
    navigation.navigate("Homepage");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg_variant_x,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: screenHeight * 0.11,
          backgroundColor: colors.bg_variant_x,
          paddingTop: screenHeight * 0.042,
          padding: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            padding: 5,
          }}
        >
          <AntDesign name="left" size={30} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
            marginLeft: screenWidth * 0.12,
          }}
        >
          Registered ATP Farmer
        </Text>
      </View>
      <View style={{ backgroundColor: colors.bg_variant_x }}>
        <Formik
          initialValues={{
            uname: "",
            password: "",
          }}
          onSubmit={async (values) => {
            dispatch(
              login({
                Name_User: values.uname,
                password: values.password,
              })
            );
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View
              style={{
                gap: 18,
                // marginTop: screenHeight * 0.025,
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  height: "94%",
                }}
                contentContainerStyle={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: screenHeight * 0.01,
                  paddingVertical: screenHeight * 0.005,
                }}
              >
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.bg_variant_x,
                    elevation: 2,
                    borderRadius: 15,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
                    gap: screenHeight * 0.01,
                  }}
                >
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("uname")}
                    handleBlur={handleBlur("uname")}
                    label={"Confirm Purchase"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("uname")}
                    handleBlur={handleBlur("uname")}
                    label={"Farmer Name"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("uname")}
                    handleBlur={handleBlur("uname")}
                    label={"SAN ID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("uname")}
                    handleBlur={handleBlur("uname")}
                    label={"CAFE ID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("uname")}
                    handleBlur={handleBlur("uname")}
                    label={"UTZ ID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("uname")}
                    handleBlur={handleBlur("uname")}
                    label={"Receipt Number"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("uname")}
                    handleBlur={handleBlur("uname")}
                    label={"Transaction Date"}
                  />
                </View>

                {/* Certification type */}
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.bg_variant_x,
                    elevation: 2,
                    borderRadius: 15,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
                    gap: screenHeight * 0.01,
                    marginBottom: screenHeight * 0.03,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: screenWidth * 0.05,
                      color: colors.bg_variant_font,
                      marginLeft: screenWidth * 0.02,
                    }}
                  >
                    Certification Type
                  </Text>
                  <RadioButtonGroup
                    containerStyle={{ marginBottom: 10, gap: 5 }}
                    selected={current}
                    onSelected={(value) => setCurrent(value)}
                    radioBackground={colors.blue_font}
                  >
                    <RadioButtonItem
                      value="test2"
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.blue_font,
                          }}
                        >
                          Cafe Practices Provisional
                        </Text>
                      }
                    />
                    <RadioButtonItem
                      value="test"
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.blue_font,
                          }}
                        >
                          Rainforest Alliance
                        </Text>
                      }
                    />
                    <RadioButtonItem
                      value="test3"
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.blue_font,
                          }}
                        >
                          Not Certified
                        </Text>
                      }
                    />
                  </RadioButtonGroup>
                </View>

                {/* coffee type */}
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.bg_variant_x,
                    elevation: 2,
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
                      color: colors.bg_variant_font,
                      marginLeft: screenWidth * 0.02,
                    }}
                  >
                    Coffee Type
                  </Text>
                  <RadioButtonGroup
                    containerStyle={{ marginBottom: 10, gap: 5 }}
                    selected={current}
                    onSelected={(value) => setCurrent(value)}
                    radioBackground={colors.blue_font}
                  >
                    <RadioButtonItem
                      value="test2"
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.blue_font,
                          }}
                        >
                          Cherry
                        </Text>
                      }
                    />
                    <RadioButtonItem
                      value="test"
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.blue_font,
                          }}
                        >
                          Parchment
                        </Text>
                      }
                    />
                  </RadioButtonGroup>
                </View>
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};
