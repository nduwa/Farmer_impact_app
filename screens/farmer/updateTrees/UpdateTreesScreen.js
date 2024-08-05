import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import { FarmerTressSchema } from "../../../validation/FarmerTreesSchema";
import { getCurrentDate } from "../../../helpers/getCurrentDate";
import { dataTodb } from "../../../helpers/dataTodb";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";

export const UpdateTreesScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { data } = route.params;
  const userData = useSelector((state) => state.user.userData);

  const [currentStationID, setCurrentStationID] = useState();
  const [supplierID, setSupplierID] = useState();
  const [CWname, setCWName] = useState();
  const [errors, setErrors] = useState({}); // validation errors

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("FarmerUpdateHome", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const submitTreesDetails = (formData) => {
    try {
      let nameFull = userData.user.Name_Full;
      let userkf = userData.user.__kp_User;
      let staffKf = userData.staff.__kp_Staff;

      let submitData = {
        _kf_Staff: staffKf,
        _kf_User: userkf,
        Group_ID: formData.groupID,
        farmer_ID: formData.farmerID,
        farmer_name: formData.farmerName,
        national_ID: formData.nationalID,
        full_name: nameFull,
        created_at: getCurrentDate(),
        received_seedling: formData.nmbrReceivedSeedlings,
        survived_seedling: formData.nmbrSurvivedSeedlings,
        planted_year: formData.yearPlantedReceivedSeedlings,
        old_trees: formData.nmbrOldTrees,
        old_trees_planted_year: formData.yearPlantedOldTrees,
        coffee_plot: formData.nmbrCoffeeFarms,
        nitrogen: formData.totalNitrogenFixingShadeTrees,
        natural_shade: formData.totalNaturalShadeTrees,
        shade_trees: formData.totalNbrShadeTrees,
      };

      if (!validateInputs(submitData, FarmerTressSchema)) return;

      let kfsupplier = supplierID;
      let kfstation = currentStationID;
      let stationName = CWname;

      dataTodb({
        tableName: "householdTrees",
        syncData: [submitData],
        setCurrentJob,
        extraValArr: [kfstation, kfsupplier, stationName],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = (data, schema) => {
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

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "received_seedling") output = "received seedlings";
    if (input === "survived_seedling") output = "Survived seedlings";
    if (input === "planted_year")
      output = "Year planted of the received seedlings";
    if (input === "old_trees") output = "Old trees";
    if (input === "old_trees_planted_year") output = "Year of the old trees";
    if (input === "coffee_plot") output = "Number of coffee plots";
    if (input === "nitrogen") output = "Total of nitrogen  fixing shade trees";
    if (input === "natural_shade") output = "Total of natural shade";
    if (input === "shade_trees") output = "Total number of shade trees";

    return output;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setValidationError({
        type: "emptyOrInvalidData",
        message: `Invalid input in '${getInputLabel(
          Object.keys(errors)[0]
        )}', check the inputs highlighted in red`,
        inputBox: null,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (currentJob === "tree details saved") {
      displayToast("Tree Details saved, pending upload");
      setLoading(false);
      setFormSubmitted(true);
    }
  }, [currentJob]);

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
      const fetchData = async () => {
        const stationId = await SecureStore.getItemAsync("rtc-station-id");
        const supplierID = await SecureStore.getItemAsync("rtc-supplier-id");
        const stationName = await SecureStore.getItemAsync("rtc-station-name");

        if (stationId) {
          setCurrentStationID(stationId);
          setSupplierID(supplierID);
          setCWName(stationName);
        }
      };

      fetchData();
      return () => {
        setLoading(false);
        setFormSubmitted(false);
        setErrors({});
      };
    }, [])
  );

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
                    active={false}
                    error={errors.farmer_ID === "farmer_ID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer name"}
                    value={values.farmerName}
                    active={false}
                    error={errors.farmer_name}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nationalID")}
                    handleBlur={handleBlur("nationalID")}
                    label={"National ID"}
                    value={values.nationalID}
                    active={false}
                    error={errors.national_ID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("groupID")}
                    handleBlur={handleBlur("groupID")}
                    label={"Group ID"}
                    value={values.groupID}
                    active={false}
                    error={errors.Group_ID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrReceivedSeedlings")}
                    handleBlur={handleBlur("nmbrReceivedSeedlings")}
                    label={"Number of received seedlings"}
                    value={values.nmbrReceivedSeedlings}
                    error={errors.received_seedling}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrSurvivedSeedlings")}
                    handleBlur={handleBlur("nmbrSurvivedSeedlings")}
                    label={"Number of survived seedlings"}
                    value={values.nmbrSurvivedSeedlings}
                    error={errors.survived_seedling}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("yearPlantedReceivedSeedlings")}
                    handleBlur={handleBlur("yearPlantedReceivedSeedlings")}
                    label={"Year planted of the received seedlings"}
                    value={values.yearPlantedReceivedSeedlings}
                    error={errors.planted_year}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrOldTrees")}
                    handleBlur={handleBlur("nmbrOldTrees")}
                    label={"Number of old trees"}
                    value={values.nmbrOldTrees}
                    error={errors.old_trees}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("yearPlantedOldTrees")}
                    handleBlur={handleBlur("yearPlantedOldTrees")}
                    label={"Year of planted for the old trees"}
                    value={values.yearPlantedOldTrees}
                    error={errors.old_trees_planted_year}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrCoffeeFarms")}
                    handleBlur={handleBlur("nmbrCoffeeFarms")}
                    label={"Number of coffee plots/Farms in general"}
                    value={values.nmbrCoffeeFarms}
                    error={errors.coffee_plot}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNitrogenFixingShadeTrees")}
                    handleBlur={handleBlur("totalNitrogenFixingShadeTrees")}
                    label={"Total of nitrogen fixing shade trees"}
                    value={values.totalNitrogenFixingShadeTrees}
                    error={errors.nitrogen}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNaturalShadeTrees")}
                    handleBlur={handleBlur("totalNaturalShadeTrees")}
                    label={"Total of natural shade trees"}
                    value={values.totalNaturalShadeTrees}
                    error={errors.natural_shade}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNbrShadeTrees")}
                    handleBlur={handleBlur("totalNbrShadeTrees")}
                    label={"Total number of shade trees"}
                    value={values.totalNbrShadeTrees}
                    error={errors.shade_trees}
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
                  disabled={formSubmitted}
                  onPress={handleSubmit}
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>

      {/* loader */}
      {loading && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.12,
            width: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "auto",
              backgroundColor: "white",
              borderRadius: screenHeight * 0.5,
              elevation: 4,
            }}
          >
            <LottieView
              style={{
                height: screenHeight * 0.05,
                width: screenHeight * 0.05,
                alignSelf: "center",
              }}
              source={require("../../../assets/lottie/spinner.json")}
              autoPlay
              speed={1}
              loop={true}
              resizeMode="cover"
            />
          </View>
        </View>
      )}
    </View>
  );
};
