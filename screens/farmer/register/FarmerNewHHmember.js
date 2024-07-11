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
import * as SecureStore from "expo-secure-store";
import { colors } from "../../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import { FontAwesome6 } from "@expo/vector-icons";
import { generateID } from "../../../helpers/generateID";
import { dataTodb } from "../../../helpers/dataTodb";
import { LocalizationModal } from "../../../components/LocalizationModal";
import { useSelector } from "react-redux";
import { FarmerOnlySchema } from "../../../validation/FarmerOnlySchema";
import LottieView from "lottie-react-native";

export const FarmerNewHHmember = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userData = useSelector((state) => state.user);
  const navigation = useNavigation();
  const { data } = route.params;

  const [currentStationID, setCurrentStationID] = useState();
  const [supplierID, setSupplierID] = useState();
  const [userName, setUserName] = useState();

  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [readingModalOpen, setReadingModalOpen] = useState(false);
  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [maritalModalOpen, setMaritalModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);

  const [positionChoice, setPositionChoice] = useState(null);
  const [maritalChoice, setMaritalChoice] = useState(null);
  const [readingChoice, setReadingChoice] = useState(null);
  const [educationChoice, setEducationChoice] = useState(null);
  const [mathChoice, setMathChoice] = useState(null);

  const [gender, setGender] = useState("");
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const [errors, setErrors] = useState({}); // validation errors
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const farmerPositions = [
    { id: 1, name: "Member" },
    { id: 2, name: "President" },
    { id: 3, name: "Secretary" },
    { id: 4, name: "Promoted Farmer" },
    { id: 5, name: "Site Collector" },
    { id: 6, name: "Savings Group Treasurer" },
    { id: 7, name: "Farm Advisor" },
  ];

  const farmerMarital = [
    { id: 1, name: "Single" },
    { id: 2, name: "Married" },
    { id: 3, name: "Widowed" },
    { id: 4, name: "Divorced" },
  ];

  const farmerReading = [
    { id: 1, name: "Cannot Read" },
    { id: 2, name: "Can read with some assistance" },
    { id: 3, name: "Can read without some assistance from others" },
  ];

  const farmerEducation = [
    { id: 1, name: "No formal education" },
    { id: 2, name: "Some primary" },
    { id: 3, name: "Complete primary" },
    { id: 4, name: "Some secondary" },
    { id: 5, name: "Complete secondary" },
    { id: 6, name: "Some technical school or university" },
    { id: 7, name: "Complete technical school or university" },
  ];

  const farmerMath = [
    { id: 1, name: "No math skills" },
    { id: 2, name: "Can do basic math with assistance from others" },
    { id: 3, name: "Can do basic math without assistance from others" },
  ];

  const handleBackButton = () => {
    navigation.navigate("PendingRegistrationScreen", { data: null });
  };

  const validateForm = (data, schema) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) {
      setErrors({});
      setValidationError({
        type: null,
        message: null,
        inputBox: null,
      });

      let productionTress = +data.prodTrees;
      let totalTrees = +data.totTrees;

      if (productionTress > totalTrees) {
        setValidationError({
          type: "invalidTrees",
          message: "Production trees can't be more than total trees",
          inputBox: null,
        });

        return false;
      }
      return true;
    }

    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.path[0]] = detail.message;
    });
    setErrors(newErrors);
    return false;
  };

  const submitFarmer = async (farmerData) => {
    try {
      let currentMemberLevel = +data.farmerData.farmerid;
      let newMemberLevel = currentMemberLevel + 1;

      let farmerInfo = {
        __kp_Farmer: generateID({ type: "fm_uuid" }).toUpperCase(),
        _kf_Group: data.farmerData._kf_Group,
        _kf_Station: data.farmerData._kf_Station,
        Name: farmerData?.farmerName.trim(),
        Phone: farmerData?.phoneNumber.trim(),
        Gender: gender,
        Year_Birth: farmerData?.birthYear.trim(),
        National_ID_t: farmerData?.nationalID.trim(),
        Position: positionChoice?.name || farmerData?.position,
        Marital_Status: maritalChoice?.name || farmerData?.maritalStatus,
        Math_Skills: mathChoice?.name || farmerData?.basicMathSkills,
        Reading_Skills: readingChoice?.name || farmerData?.readingSkills,
        education_level: educationChoice?.name || farmerData?.educationalLevel,
        farmerid: String(newMemberLevel), /// generated on the server, 1 means the primary member of the household
        CAFE_ID: "",
        SAN_ID: "",
        UTZ_ID: "",
        created_at: new Date(),
        created_by: userName,
        registered_at: new Date(),
        updated_at: "0000-00-00 00:00:0",
        type: "new",
        sync_farmers: "0",
        uploaded: "0",
        uploaded_at: "0000-00-00 00:00:0",
        Area_Small: data.farmerData.Area_Small,
        Area_Smallest: data.farmerData.Area_Smallest,
        STP_Weight: String(data.farmerData.STP_Weight),
        Trees: String(data.farmerData.Trees),
        Trees_Producing: String(data.farmerData.Trees_Producing),
        number_of_plots_with_coffee: String(
          data.farmerData.number_of_plots_with_coffee
        ),
        latitude: userData.location.coords.latitude,
        longitude: userData.location.coords.longitude,
        householdid: "",
        seasonal_goal: "",
        recordid: "",
      };

      setErrors({});
      let submitData = {
        ...farmerInfo,
        ...{ _kf_Household: data.farmerData.__kp_Household },
      };

      if (!validateForm(submitData, FarmerOnlySchema)) return;

      let kfgroup = data.farmerData._kf_Group;
      let kphousehold = data.farmerData.__kp_Household;
      let kflocation = "";
      let kfsupplier = supplierID;
      let kfstation = currentStationID;

      dataTodb({
        tableName: "farmers_new",
        syncData: [farmerInfo],
        setCurrentJob,
        extraValArr: [kfgroup, kphousehold, kflocation, kfsupplier, kfstation],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "Year_Birth") output = "Birth year";
    if (input === "Area_Small") output = "Cell";
    if (input === "Area_Smallest") output = "Village";
    if (input === "National_ID_t") output = "National ID";
    if (input === "Trees_Producing") output = "Production Trees";
    if (input === "Trees") output = "Total Trees";
    if (input === "number_of_plots_with_coffee")
      output = "Total plots of land with coffee";

    return output;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setValidationError({
        type: "emptyOrInvalidData",
        message: `Invalid input in ${getInputLabel(
          Object.keys(errors)[0]
        )}, check the inputs highlighted in red`,
        inputBox: null,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (currentJob === "Farmer details saved") {
      displayToast("Farmer pending registration");
      setFormSubmitted(true);
      setLoading(false);
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
        const currentUser = await SecureStore.getItemAsync("rtc-user-name");

        if (stationId) {
          setCurrentStationID(stationId);
          setSupplierID(supplierID);
          setUserName(currentUser);
        }
      };

      fetchData();

      return () => {
        setErrors({});
        setLoading(false);
        setValidationError({
          type: null,
          message: null,
          inputBox: null,
        });
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
      {positionModalOpen && (
        <LocalizationModal
          setChoice={setPositionChoice}
          data={farmerPositions}
          setModalOpen={setPositionModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Positions"}
        />
      )}

      {maritalModalOpen && (
        <LocalizationModal
          setChoice={setMaritalChoice}
          data={farmerMarital}
          setModalOpen={setMaritalModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Marital Status"}
        />
      )}

      {mathModalOpen && (
        <LocalizationModal
          setChoice={setMathChoice}
          data={farmerMath}
          setModalOpen={setMathModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Basic Math Skills"}
        />
      )}

      {readingModalOpen && (
        <LocalizationModal
          setChoice={setReadingChoice}
          data={farmerReading}
          setModalOpen={setReadingModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Reading Skills"}
        />
      )}

      {educationModalOpen && (
        <LocalizationModal
          setChoice={setEducationChoice}
          data={farmerEducation}
          setModalOpen={setEducationModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Education Level"}
        />
      )}

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
          New Household Member
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            farmerName: "",
            phoneNumber: "",
            gender,
            nationalID: "",
            position: "",
            maritalStatus: "",
            basicMathSkills: "",
            readingSkills: "",
            educationalLevel: "",
            birthYear: "",
            householdID: "",
            cell: "",
            village: "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
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
                    Farmer information
                  </Text>

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer Name"}
                    value={values.farmerName}
                    error={errors.Name}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("phoneNumber")}
                    handleBlur={handleBlur("phoneNumber")}
                    label={"Phone number"}
                    value={values.phoneNumber}
                    error={errors.Phone}
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
                        value={"M"}
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
                        value={"F"}
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
                    error={errors.Year_Birth}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nationalID")}
                    handleBlur={handleBlur("nationalID")}
                    label={"National ID"}
                    value={values.nationalID}
                    error={errors.National_ID_t}
                  />
                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("position")}
                      handleBlur={handleBlur("position")}
                      label={"Position"}
                      value={positionChoice?.name || values.position}
                      error={errors.Position}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setPositionModalOpen(true)}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.775,
                        top: screenHeight * 0.043,
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
                        setFieldValue("position", "");
                        setPositionChoice(null);
                      }}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.68,
                        top: screenHeight * 0.043,
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

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("maritalStatus")}
                      handleBlur={handleBlur("maritalStatus")}
                      label={"Marital Status"}
                      value={maritalChoice?.name || values.maritalStatus}
                      error={errors.Marital_Status}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setMaritalModalOpen(true)}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.775,
                        top: screenHeight * 0.043,
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
                        setFieldValue("maritalStatus", "");
                        setMaritalChoice(null);
                      }}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.68,
                        top: screenHeight * 0.043,
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

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("basicMathSkills")}
                      handleBlur={handleBlur("basicMathSkills")}
                      label={"Basic Math Skills"}
                      value={mathChoice?.name || values.basicMathSkills}
                      error={errors.Math_Skills}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setMathModalOpen(true)}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.775,
                        top: screenHeight * 0.043,
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
                        setFieldValue("basicMathSkills", "");
                        setMathChoice(null);
                      }}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.68,
                        top: screenHeight * 0.043,
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

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("readingSkills")}
                      handleBlur={handleBlur("readingSkills")}
                      label={"Reading Skills"}
                      value={readingChoice?.name || values.readingSkills}
                      error={errors.Reading_Skills}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setReadingModalOpen(true)}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.775,
                        top: screenHeight * 0.043,
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
                        setFieldValue("readingSkills", "");
                        setReadingChoice(null);
                      }}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.68,
                        top: screenHeight * 0.043,
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

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("educationalLevel")}
                      handleBlur={handleBlur("educationalLevel")}
                      label={"Educational Level"}
                      value={educationChoice?.name || values.educationalLevel}
                      error={errors.education_level}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setEducationModalOpen(true)}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.775,
                        top: screenHeight * 0.043,
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
                        setFieldValue("educationalLevel", "");
                        setEducationChoice(null);
                      }}
                      style={{
                        position: "absolute",
                        left: screenWidth * 0.68,
                        top: screenHeight * 0.043,
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
                  text="Register"
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
