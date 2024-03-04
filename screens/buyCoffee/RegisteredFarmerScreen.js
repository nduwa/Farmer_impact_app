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
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

export const RegisteredFarmerScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [current, setCurrent] = useState("test");
  const [indicatorVisible, setIndicatorVisibility] = useState(false);

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("FarmerScreen");
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
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
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
            farmerID: "",
            farmerName: "",
            sanID: "",
            cafeID: "",
            utzID: "",
            receiptNumber: "",
            transactionDate: "",
            kgGood: "",
            priceGood: "",
            kgBad: "",
            priceBad: "",
            cashTotal: "",
            cashTotalMobile: "",
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
                    marginTop: screenHeight * 0.025,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
                    gap: screenHeight * 0.01,
                  }}
                >
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerID")}
                    handleBlur={handleBlur("farmerID")}
                    label={"Confirm Purchase"}
                    value={values.farmerID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer Name"}
                    value={values.farmerName}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("sanID")}
                    handleBlur={handleBlur("sanID")}
                    label={"SAN ID"}
                    value={values.sanID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("cafeID")}
                    handleBlur={handleBlur("cafeID")}
                    label={"CAFE ID"}
                    value={values.cafeID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("utzID")}
                    handleBlur={handleBlur("utzID")}
                    label={"UTZ ID"}
                    value={values.utzID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("receiptNumber")}
                    handleBlur={handleBlur("receiptNumber")}
                    label={"Receipt Number"}
                    value={values.receiptNumber}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("transactionDate")}
                    handleBlur={handleBlur("transactionDate")}
                    label={"Transaction Date"}
                    value={values.transactionDate}
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

                {/* quantity */}
                <View
                  style={{
                    justifyContent: "space-between",
                    width: "95%",
                    backgroundColor: colors.bg_variant_x,
                    elevation: 2,
                    borderRadius: 15,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
                    rowGap: screenWidth * 0.04,
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
                    Coffee Quantity
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        width: "48%",
                        gap: screenHeight * 0.01,
                        paddingBottom: screenHeight * 0.03,
                      }}
                    >
                      <BuyCoffeeInput
                        values={values}
                        handleChange={handleChange("kgGood")}
                        handleBlur={handleBlur("kgGood")}
                        label={"Kgs(Good)"}
                        radius={4}
                        value={values.kgGood}
                      />
                      <View
                        style={{
                          backgroundColor: colors.bg_variant_font,
                          height: "0.5%",
                          width: "100%",
                          marginVertical: screenHeight * 0.008,
                        }}
                      />
                      <BuyCoffeeInput
                        values={values}
                        handleChange={handleChange("kgsBad")}
                        handleBlur={handleBlur("kgsBad")}
                        label={"Kgs(Bad)"}
                        radius={4}
                        value={values.kgBad}
                      />
                    </View>
                    <View
                      style={{
                        width: "48%",
                        gap: screenHeight * 0.01,
                        paddingBottom: screenHeight * 0.03,
                      }}
                    >
                      <BuyCoffeeInput
                        values={values}
                        handleChange={handleChange("priceGood")}
                        handleBlur={handleBlur("priceGood")}
                        label={"Price/Kg"}
                        radius={4}
                        value={values.priceGood}
                      />
                      <View
                        style={{
                          backgroundColor: colors.bg_variant_font,
                          height: "0.5%",
                          width: "100%",
                          marginVertical: screenHeight * 0.008,
                        }}
                      />
                      <BuyCoffeeInput
                        values={values}
                        handleChange={handleChange("priceBad")}
                        handleBlur={handleBlur("priceBad")}
                        label={"Price/Kg"}
                        radius={4}
                        value={values.priceBad}
                      />
                    </View>
                  </View>
                </View>

                {/* coffee value */}
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
                    Coffee Value
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("cashTotal")}
                    handleBlur={handleBlur("cashTotal")}
                    label={"Total Cash Paid"}
                    radius={4}
                    value={values.cashTotal}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("cashTotalMobile")}
                    handleBlur={handleBlur("cashTotalMobile")}
                    label={"Total Paid By Mobile Payment"}
                    radius={4}
                    value={values.cashTotalMobile}
                  />
                </View>
                <CustomButton
                  bg={colors.blue_font}
                  color={"white"}
                  width="95%"
                  text="Confirm Purchase"
                  bdcolor="transparent"
                  mt={8}
                  mb={8}
                  radius={10}
                  disabled={indicatorVisible}
                  onPress={handleSubmit}
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};
