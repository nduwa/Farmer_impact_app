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
import { colors } from "../../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";

export const UpdateTreesScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { data } = route.params;

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });
  const [reportValidated, setReportValidated] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const submitTreesDetails = () => {
    try {
      if (validateInputs(transactionData)) {
        setReportValidated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = (values) => {
    return true;
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
          elevation: 5,
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
          Update Trees
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            farmerID: data.farmerData.farmerid,
            farmerName: data.farmerData.Name,
            nationalID: data.farmerData.National_ID_t,
            groupID: data.farmerData.farmerGroupID,
            nmbrReceivedSeedlings: "0",
            nmbrSurvivedSeedlings: "0",
            yearPlantedReceivedSeedlings: "",
            nmbrOldTrees: "0",
            yearPlantedOldTrees: "",
            nmbrCoffeeFarms: "0",
            totalNitrogenFixingShadeTrees: "0",
            totalNaturalShadeTrees: "0",
            totalNbrShadeTrees: "0",
          }}
          onSubmit={async (values) => {
            submitTreesDetails(values);
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
                    Fill the form accordingly
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerID")}
                    handleBlur={handleBlur("farmerID")}
                    label={"Farmer ID"}
                    value={values.farmerID}
                    active={true}
                    error={validationError.inputBox === "farmerID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer name"}
                    value={values.farmerName}
                    error={validationError.inputBox === "farmerName"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nationalID")}
                    handleBlur={handleBlur("nationalID")}
                    label={"National ID"}
                    value={values.nationalID}
                    error={validationError.inputBox === "nationalID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("groupID")}
                    handleBlur={handleBlur("groupID")}
                    label={"Group ID"}
                    value={values.groupID}
                    error={validationError.inputBox === "groupID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrReceivedSeedlings")}
                    handleBlur={handleBlur("nmbrReceivedSeedlings")}
                    label={"Number of received seedlings"}
                    value={values.nmbrReceivedSeedlings}
                    error={validationError.inputBox === "nmbrReceivedSeedlings"}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrSurvivedSeedlings")}
                    handleBlur={handleBlur("nmbrSurvivedSeedlings")}
                    label={"Number of survived seedlings"}
                    value={values.nmbrSurvivedSeedlings}
                    multiline={true}
                    error={validationError.inputBox === "nmbrSurvivedSeedlings"}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("yearPlantedReceivedSeedings")}
                    handleBlur={handleBlur("yearPlantedReceivedSeedings")}
                    label={"Year planted of the received seedlings"}
                    value={values.yearPlantedReceivedSeedlings}
                    multiline={true}
                    error={
                      validationError.inputBox === "yearPlantedReceivedSeedings"
                    }
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrOldTrees")}
                    handleBlur={handleBlur("nmbrOldTrees")}
                    label={"Number of old trees"}
                    value={values.nmbrOldTrees}
                    multiline={true}
                    error={validationError.inputBox === "nmbrOldTrees"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("yearPlantedOldTrees")}
                    handleBlur={handleBlur("yearPlantedOldTrees")}
                    label={"Year of planted for the old trees"}
                    value={values.yearPlantedOldTrees}
                    multiline={true}
                    error={validationError.inputBox === "yearPlantedOldTrees"}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrCoffeeFarms")}
                    handleBlur={handleBlur("nmbrCoffeeFarms")}
                    label={"Number of coffee plots/Farms in general"}
                    value={values.nmbrCoffeeFarms}
                    multiline={true}
                    error={validationError.inputBox === "nmbrCoffeeFarms"}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNitrogenFixingShadeTrees")}
                    handleBlur={handleBlur("totalNitrogenFixingShadeTrees")}
                    label={"Total of nitrogen fixing shade trees"}
                    value={values.totalNitrogenFixingShadeTrees}
                    multiline={true}
                    error={
                      validationError.inputBox ===
                      "totalNitrogenFixingShadeTrees"
                    }
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNaturalShadeTrees")}
                    handleBlur={handleBlur("totalNaturalShadeTrees")}
                    label={"Total of natural shade trees"}
                    value={values.totalNaturalShadeTrees}
                    multiline={true}
                    error={
                      validationError.inputBox === "totalNaturalShadeTrees"
                    }
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNbrShadeTrees")}
                    handleBlur={handleBlur("totalNbrShadeTrees")}
                    label={"Total number of shade trees"}
                    value={values.totalNbrShadeTrees}
                    multiline={true}
                    error={validationError.inputBox === "totalNbrShadeTrees"}
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
                  text="Submit"
                  bdcolor="transparent"
                  mt={screenHeight * 0.017}
                  mb={
                    isKeyboardActive ? screenHeight * 0.04 : screenHeight * 0.03
                  }
                  radius={10}
                  disabled={submitted}
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
