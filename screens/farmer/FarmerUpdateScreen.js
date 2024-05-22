import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../components/BuyCoffeeInput";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import * as SecureStore from "expo-secure-store";

export const FarmerUpdateScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [gender, setGender] = useState("CP");
  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const navigation = useNavigation();

  const { data } = route.params;

  const handleBackButton = () => {
    navigation.navigate("ChooseFarmerUpdateScreen", { data: data.destination });
  };

  const validateInputs = (values) => {
    return true;
  };

  const submitFarmer = async (farmerData) => {
    try {
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

//   useFocusEffect(
//     React.useCallback(() => {
//       console.log(data);

//       return () => {};
//     }, [])
//   );

  return (
    <View
      style={{
        flex: 1,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: screenHeight * 0.11,
          backgroundColor: colors.white,
          paddingTop: screenHeight * 0.042,
          padding: 10,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            padding: screenWidth * 0.005,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
          }}
        >
          Update Farmer
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            groupName: "",
            farmerName: "",
            birthYear: "",
            householdID: "",
            cell: "",
            village: "",
            totalPlots: "",
            prodTrees: "",
            totTrees: "",
            stp1: "",
            stp2: "",
          }}
          onSubmit={async (values) => {
            submitFarmer(values);
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
                    backgroundColor: colors.white,
                    elevation: 2,
                    borderRadius: 15,
                    marginTop: screenHeight * 0.025,
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
                    Household information
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("groupName")}
                    handleBlur={handleBlur("groupName")}
                    label={"Choose group name"}
                    value={values.groupName}
                    active={false}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("householdID")}
                    handleBlur={handleBlur("householdID")}
                    label={"Household ID(if any)"}
                    value={values.householdID}
                    active={false}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("cell")}
                    handleBlur={handleBlur("cell")}
                    label={"Cell"}
                    value={values.cell}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("village")}
                    handleBlur={handleBlur("village")}
                    label={"Village"}
                    value={values.village}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalPlots")}
                    handleBlur={handleBlur("totalPlots")}
                    label={"Total plots of land with coffee"}
                    value={values.totalPlots}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("prodTrees")}
                    handleBlur={handleBlur("prodTrees")}
                    label={"Productive Trees"}
                    value={values.prodTrees}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totTrees")}
                    handleBlur={handleBlur("totTrees")}
                    label={"Total Trees"}
                    value={values.totTrees}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("stp1")}
                    handleBlur={handleBlur("totTrees")}
                    label={"Seasonal Total produced for 2023"}
                    value={values.totTrees}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("stp2")}
                    handleBlur={handleBlur("totTrees")}
                    label={"Seasonal Total produced for 2024"}
                    value={values.totTrees}
                  />
                </View>

                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
                    borderRadius: 15,
                    marginTop: screenHeight * 0.025,
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
                    Farmer information
                  </Text>

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer Name"}
                    value={values.farmerName}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("phoneNumber")}
                    handleBlur={handleBlur("phoneNumber")}
                    label={"Phone number"}
                    value={values.phoneNumber}
                  />

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
                      Gender
                    </Text>

                    <RadioButtonGroup
                      containerStyle={{
                        marginLeft: 10,
                        marginBottom: 10,
                        gap: 5,
                      }}
                      selected={gender}
                      onSelected={(value) => setGender(value)}
                      radioBackground={colors.secondary}
                    >
                      <RadioButtonItem
                        value={"Male"}
                        label={
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              marginLeft: 8,
                              color: colors.black,
                            }}
                          >
                            Male
                          </Text>
                        }
                      />
                      <RadioButtonItem
                        value={"Female"}
                        label={
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 16,
                              marginLeft: 8,
                              color: colors.black,
                            }}
                          >
                            Female
                          </Text>
                        }
                      />
                    </RadioButtonGroup>
                  </View>

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("birthYear")}
                    handleBlur={handleBlur("birthYear")}
                    label={"Year of Birth"}
                    value={values.birthYear}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nationalID")}
                    handleBlur={handleBlur("nationalID")}
                    label={"National ID"}
                    value={values.nationalID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("position")}
                    handleBlur={handleBlur("position")}
                    label={"Position"}
                    value={values.position}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("maritalStatus")}
                    handleBlur={handleBlur("maritalStatus")}
                    label={"Marital Status"}
                    value={values.maritalStatus}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("basicMathSkills")}
                    handleBlur={handleBlur("basicMathSkills")}
                    label={"Basic Math Skills"}
                    value={values.basicMathSkills}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("readingSkills")}
                    handleBlur={handleBlur("readingSkills")}
                    label={"Reading Skills"}
                    value={values.readingSkills}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("educationalLevel")}
                    handleBlur={handleBlur("educationalLevel")}
                    label={"Educational Level"}
                    value={values.educationalLevel}
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

                <CustomButton
                  bg={colors.secondary}
                  color={"white"}
                  width="95%"
                  text="Update"
                  bdcolor="transparent"
                  mt={screenHeight * 0.017}
                  mb={
                    isKeyboardActive ? screenHeight * 0.04 : screenHeight * 0.03
                  }
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
