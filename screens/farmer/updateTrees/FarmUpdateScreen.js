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
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import { LocalizationModal } from "../../../components/LocalizationModal";
import { useSelector } from "react-redux";
import { getCurrentDate } from "../../../helpers/getCurrentDate";
import { dataTodb } from "../../../helpers/dataTodb";
import { FarmSchema } from "../../../validation/FarmSchema";
import LottieView from "lottie-react-native";
import { getCurrentLocation } from "../../../helpers/getCurrentLocation";
import { SyncModal } from "../../../components/SyncModal";

export const FarmUpdateScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userData = useSelector((state) => state.user);

  const [currentStationID, setCurrentStationID] = useState();
  const [supplierID, setSupplierID] = useState();
  const [CWname, setCWName] = useState();

  const [errors, setErrors] = useState({}); // validation errors
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationModal, setLocationModal] = useState(false);

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [typesModalOpen, setTypesModalOpen] = useState(false);
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

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleLocation = async () => {
    setLocationModal(false);
    setLoading(true);

    let loc = await getCurrentLocation();
    if (loc) {
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      displayToast("Coordinates have been set");
      setLoading(false);
    } else {
      displayToast("Could not get coordinates");
      setLoading(false);
    }
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

      return true;
    }

    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.path[0]] = detail.message;
    });
    setErrors(newErrors);
    return false;
  };

  const submitFarm = async (farmData) => {
    try {
      let nameFull = userData.userData.user.Name_Full;
      let uname = userData.userData.user.Name_User;
      let userId = userData.userData.user.__kp_User;
      let userCode = userData.userData.staff.userID;
      let staffKf = userData.userData.staff.__kp_Staff;

      let submitData = {
        _kf_Staff: staffKf,
        _kf_User: userId,
        user_code: userCode,
        farmer_name: data.farmerData.Name,
        farmer_ID: data.farmerData.farmerid,
        national_ID: data.farmerData.National_ID_t,
        latitude: location?.latitude || "",
        longitude: location?.longitude || "",
        status: "0",
        uploaded_at: null,
        cropNameId: `${selectedType?.id || ""}`,
        farm_unit_area: farmData.unitArea,
        soil_slope: farmData.slope,
        uuid: "",
        created_at: getCurrentDate(),
        created_by: uname,
        full_name: nameFull,
      };

      let kfsupplier = supplierID;
      let kfstation = currentStationID;
      let stationName = CWname;

      if (
        !validateForm(
          {
            soil_slope: submitData.soil_slope,
            farm_unit_area: submitData.farm_unit_area,
            cropNameId: submitData.cropNameId,
          },
          FarmSchema
        )
      )
        return;

      dataTodb({
        tableName: "farmDetails",
        syncData: [submitData],
        setCurrentJob,
        extraValArr: [kfsupplier, kfstation, stationName],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const farmTypes = [
    { id: 1, name: "Banana Plantation", id: 1 },
    { id: 2, name: "Coffee", id: 2 },
    { id: 3, name: "Diverse food crop", id: 3 },
    { id: 4, name: "Forest", id: 4 },
  ];

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "cropNameId") output = "Farm type";
    if (input === "soil_slope") output = "Soil slope";
    if (input === "farm_unit_area") output = "Unit area";
    if (input === "latitude" || input === "longitude") output = "Location";

    return output;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setLoading(false);
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
    if (currentJob === "farm details saved") {
      displayToast("Farm details saved");
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
        setTypesModalOpen(false);
        setSelectedType(null);
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
      {typesModalOpen && (
        <LocalizationModal
          setChoice={setSelectedType}
          data={farmTypes}
          setModalOpen={setTypesModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Farm type"}
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
          Update Farm details
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            farmType: "",
            unitArea: "",
            slope: "",
            farmLocation: "",
          }}
          onSubmit={async (values) => {
            submitFarm(values);
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
                    Farm information
                  </Text>
                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("farmType")}
                      handleBlur={handleBlur("farmType")}
                      label={"Farm Type"}
                      value={selectedType?.name}
                      active={false}
                      error={errors.cropNameId}
                    />
                    <>
                      <TouchableOpacity
                        onPress={() => setTypesModalOpen(true)}
                        style={{
                          position: "absolute",
                          left: screenWidth * 0.775,
                          top: "47%",
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
                          setFieldValue("farmType", "");
                          setSelectedType(null);
                        }}
                        style={{
                          position: "absolute",
                          left: screenWidth * 0.68,
                          top: "47%",
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
                    </>
                  </View>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("unitArea")}
                    handleBlur={handleBlur("unitArea")}
                    label={"Farm Unit Area(ha)"}
                    value={values.farm_unit_area}
                    error={errors.farm_unit_area}
                    active={true}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("slope")}
                    handleBlur={handleBlur("slope")}
                    label={"Soil Slope"}
                    value={values.slope}
                    error={errors.soil_slope}
                  />
                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("farmLocation")}
                      handleBlur={handleBlur("farmLocation")}
                      label={"Farm coordinates"}
                      value={
                        location
                          ? `${location?.latitude}, ${location.longitude}`
                          : ""
                      }
                      active={false}
                      error={errors.latitude || errors.longitude}
                    />
                    <>
                      <TouchableOpacity
                        onPress={() => setLocationModal(true)}
                        style={{
                          position: "absolute",
                          left: screenWidth * 0.775,
                          top: "47%",
                          backgroundColor: "white",
                          borderRadius: screenWidth * 0.009,
                          padding: screenHeight * 0.007,
                          elevation: 3,
                        }}
                      >
                        <FontAwesome6
                          name="location-dot"
                          size={20}
                          color="black"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue("farmLocation", "");
                          setLocation(null);
                        }}
                        style={{
                          position: "absolute",
                          left: screenWidth * 0.68,
                          top: "47%",
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
                    </>
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

      {locationModal && (
        <SyncModal
          label={"Do you want to capture this farm's coordinates?"}
          onYes={handleLocation}
          OnNo={() => setLocationModal(false)}
        />
      )}

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
