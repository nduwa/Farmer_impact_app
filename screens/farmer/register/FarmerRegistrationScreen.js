import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { sectors, cells, villages } from "rwanda-relational";
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
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import { GroupsModal } from "../../../components/GroupsModal";
import { dataTodb } from "../../../helpers/dataTodb";
import { LocalizationModal } from "../../../components/LocalizationModal";
import { newFarmerSchema } from "../../../validation/newFarmerSchema";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { getCurrentDate } from "../../../helpers/getCurrentDate";
import { useTranslation } from "react-i18next";

export const FarmerRegistrationScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userData = useSelector((state) => state.user.userData);
  const { t } = useTranslation();

  const [currentStationID, setCurrentStationID] = useState();
  const [supplierID, setSupplierID] = useState();

  const [CWname, setCWName] = useState();

  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [cellsModalOpen, setCellsModalOpen] = useState(false);
  const [villagesModalOpen, setvillagesModalOpen] = useState(false);
  const [readingModalOpen, setReadingModalOpen] = useState(false);
  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [maritalModalOpen, setMaritalModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);

  const [cellChoice, setCellChoice] = useState(null);
  const [villageChoice, setVillageChoice] = useState(null);
  const [cellList, setCellList] = useState([]);
  const [villageList, setVillageList] = useState([]);

  const [sector, setSector] = useState(null);
  const [maritalChoice, setMaritalChoice] = useState(null);
  const [readingChoice, setReadingChoice] = useState(null);
  const [educationChoice, setEducationChoice] = useState(null);
  const [mathChoice, setMathChoice] = useState(null);

  const [activeGroup, setActiveGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  const [gender, setGender] = useState("");
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [accurateHeight, setAccurateHeight] = useState(0);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const [errors, setErrors] = useState({}); // validation errors
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const farmerMarital = [
    { id: 1, name: t("new_farmer.marital_status.single"), value: "S" },
    { id: 2, name: t("new_farmer.marital_status.married"), value: "M" },
    { id: 3, name: t("new_farmer.marital_status.widowed"), value: "W" },
    { id: 4, name: t("new_farmer.marital_status.divorced"), value: "D" },
  ];

  const farmerReading = [
    { id: 1, name: t("new_farmer.reading_skills.none"), value: "A" },
    { id: 2, name: t("new_farmer.reading_skills.with_assistance"), value: "B" },
    {
      id: 3,
      name: t("new_farmer.reading_skills.without_assistance"),
      value: "C",
    },
  ];

  const farmerEducation = [
    { id: 1, name: t("new_farmer.educational_level.none"), value: "A" },
    { id: 2, name: t("new_farmer.educational_level.some_primary"), value: "B" },
    {
      id: 3,
      name: t("new_farmer.educational_level.complete_primary"),
      value: "C",
    },
    {
      id: 4,
      name: t("new_farmer.educational_level.some_secondary"),
      value: "D",
    },
    {
      id: 5,
      name: t("new_farmer.educational_level.complete_secondary"),
      value: "E",
    },
    {
      id: 6,
      name: t("new_farmer.educational_level.some_techi_uni"),
      value: "F",
    },
    {
      id: 7,
      name: t("new_farmer.educational_level.complete_techi_uni"),
      value: "G",
    },
  ];

  const farmerMath = [
    { id: 1, name: t("new_farmer.math_skills.none"), value: "A" },
    {
      id: 2,
      name: t("new_farmer.math_skills.with_assistance"),
      value: "B",
    },
    {
      id: 3,
      name: t("new_farmer.math_skills.without_assistance"),
      value: "C",
    },
  ];

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
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
          message: t("new_farmer.errors.prod_tree_error"),
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
      let nameFull = userData.user.Name_Full;
      let userId = userData.user.__kp_User;
      let userCode = userData.staff.userID;
      let staffKf = userData.staff.__kp_Staff;

      let farmerInfo = {
        farmer_name: farmerData?.farmerName.trim(),
        phone: farmerData?.phoneNumber.trim(),
        Gender: gender,
        Year_Birth: farmerData?.birthYear.trim(),
        National_ID: farmerData?.nationalID.trim(),
        Marital_Status: maritalChoice?.value || farmerData?.maritalStatus,
        Math_Skills: mathChoice?.value || farmerData?.basicMathSkills,
        Skills: readingChoice?.value || farmerData?.readingSkills,
        education_level: educationChoice?.value || farmerData?.educationalLevel,
        created_at: getCurrentDate(),
        cell: cellChoice?.name,
        village: villageChoice?.name,
        sector,
        Trees: farmerData?.totTrees.trim(),
        Trees_Producing: farmerData?.prodTrees.trim(),
        number_of_plots: farmerData?.totalPlots.trim(),
        full_name: nameFull,
        _kf_User: userId,
        user_code: userCode,
        _kf_Staff: staffKf,
        farm_GPS: "",
      };

      setErrors({});
      let submitData = {
        ...farmerInfo,
      };

      if (!validateForm(submitData, newFarmerSchema)) return;

      let kfsupplier = supplierID;
      let kfstation = currentStationID;
      let groupid = selectedGroup
        ? selectedGroup.ID_GROUP
        : activeGroup.ID_GROUP;
      let stationName = CWname;

      dataTodb({
        tableName: "fieldFarmers",
        syncData: [farmerInfo],
        setCurrentJob,
        extraValArr: [kfsupplier, kfstation, stationName, groupid],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const calculateHeight = () => {
    setAccurateHeight(0);

    let heightAdjustmentRatio = 0.4;

    setAccurateHeight(screenHeight * heightAdjustmentRatio);
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "Math_Skills") output = t("new_farmer.inputs.math");
    if (input === "Year_Birth") output = t("new_farmer.inputs.birth");
    if (input === "Area_Small") output = t("new_farmer.inputs.cell");
    if (input === "Area_Smallest") output = t("new_farmer.inputs.village");
    if (input === "National_ID_t") output = t("new_farmer.inputs.national_id");
    if (input === "Trees_Producing") output = t("new_farmer.inputs.prd_tree");
    if (input === "Trees") output = t("new_farmer.inputs.tot_tree");
    if (input === "number_of_plots_with_coffee")
      output = t("new_farmer.inputs.plots");

    return output;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setValidationError({
        type: "emptyOrInvalidData",
        message: t("new_farmer.errors.invalid_input_error", {
          name: getInputLabel(Object.keys(errors)[0]),
        }),
        inputBox: null,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (currentJob === "Farmer information saved") {
      displayToast(t("new_farmer.toast.saved_registration_pending"));
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

    calculateHeight();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isKeyboardActive]);

  useEffect(() => {
    if (groups.length > 0) {
      setActiveGroup(groups[0]);
    }
    setLoading(false);
  }, [groups]);

  useEffect(() => {
    if (selectedGroup) {
      setActiveGroup(selectedGroup);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (cellChoice) {
      setVillageChoice(null);
      const allVillages = villages();
      let stationVillages = [];

      for (const village of allVillages) {
        if (village.parent_id === cellChoice.id) {
          stationVillages.push(village);
        }
      }

      setVillageList(stationVillages);
    }
  }, [cellChoice]);

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
          setLoading(true);

          retrieveDBdata({
            tableName: "rtc_groups",
            stationId,
            setData: setGroups,
            queryArg: `SELECT * FROM rtc_groups WHERE _kf_Station='${stationId}' AND active = "1"`,
          });
        }
      };

      const fetchPlace = async () => {
        const stationSector = await SecureStore.getItemAsync(
          "rtc-station-location-sector"
        );

        if (stationSector) {
          setSector(stationSector);
        }

        const allSectors = sectors();
        const allCells = cells();
        const stationCells = [];

        for (const sector of allSectors) {
          if (sector.name === stationSector) {
            for (const cell of allCells) {
              if (cell.parent_id === sector.id) {
                stationCells.push(cell);
              }
            }
          }
        }

        setCellList(stationCells);
      };

      fetchData();
      fetchPlace();

      return () => {
        setGroups([]);
        setSelectedGroup(null);
        setGroupsModalOpen(false);
        setActiveGroup([]);
        setVillageList([]);
        setCellList([]);
        setVillageChoice(null);
        setCellChoice(null);
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
      {groupsModalOpen && (
        <GroupsModal
          setGroupChoice={setSelectedGroup}
          data={groups}
          setModalOpen={setGroupsModalOpen}
        />
      )}

      {cellsModalOpen && (
        <LocalizationModal
          setChoice={setCellChoice}
          data={cellList}
          setModalOpen={setCellsModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={t("new_farmer.inputs.cell")}
        />
      )}

      {villagesModalOpen && (
        <LocalizationModal
          setChoice={setVillageChoice}
          data={villageList}
          setModalOpen={setvillagesModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={t("new_farmer.inputs.village")}
        />
      )}

      {maritalModalOpen && (
        <LocalizationModal
          setChoice={setMaritalChoice}
          data={farmerMarital}
          setModalOpen={setMaritalModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={t("new_farmer.inputs.marital")}
        />
      )}

      {mathModalOpen && (
        <LocalizationModal
          setChoice={setMathChoice}
          data={farmerMath}
          setModalOpen={setMathModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={t("new_farmer.inputs.math")}
        />
      )}

      {readingModalOpen && (
        <LocalizationModal
          setChoice={setReadingChoice}
          data={farmerReading}
          setModalOpen={setReadingModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={t("new_farmer.inputs.reading")}
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
          {t("new_farmer.title")}
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            groupName:
              activeGroup?.Name?.length > 0
                ? activeGroup?.Name
                : activeGroup?.ID_GROUP,
            farmerName: "",
            phoneNumber: "",
            gender,
            nationalID: "",
            maritalStatus: "",
            basicMathSkills: "",
            readingSkills: "",
            educationalLevel: "",
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
                    {t("new_farmer.title_household")}
                  </Text>
                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("groupName")}
                      handleBlur={handleBlur("groupName")}
                      label={t("new_farmer.inputs.group")}
                      value={
                        activeGroup?.Name?.length > 0
                          ? activeGroup?.Name
                          : activeGroup?.ID_GROUP
                      }
                      active={false}
                      error={errors.Group_ID}
                    />
                    <TouchableOpacity
                      onPress={() => setGroupsModalOpen(true)}
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
                  </View>

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("cell")}
                      handleBlur={handleBlur("cell")}
                      label={t("new_farmer.inputs.cell")}
                      value={cellChoice?.name}
                      active={false}
                      error={errors.cell}
                    />
                    <>
                      <TouchableOpacity
                        onPress={() => setCellsModalOpen(true)}
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
                          setFieldValue("cell", "");
                          setFieldValue("village", "");
                          setCellChoice(null);
                          setVillageChoice(null);
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

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("village")}
                      handleBlur={handleBlur("village")}
                      label={t("new_farmer.inputs.village")}
                      value={villageChoice?.name}
                      active={false}
                      error={errors.village}
                    />
                    <>
                      <TouchableOpacity
                        onPress={() => setvillagesModalOpen(true)}
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
                          setFieldValue("village", "");
                          setVillageChoice(null);
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
                    handleChange={handleChange("totalPlots")}
                    handleBlur={handleBlur("totalPlots")}
                    label={t("new_farmer.inputs.coffee_plots")}
                    value={values.totalPlots}
                    active={true}
                    error={errors.number_of_plots}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("prodTrees")}
                    handleBlur={handleBlur("prodTrees")}
                    label={t("new_farmer.inputs.prd_tree")}
                    value={values.prodTrees}
                    active={true}
                    error={errors.Trees_Producing}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totTrees")}
                    handleBlur={handleBlur("totTrees")}
                    label={t("new_farmer.inputs.tot_tree")}
                    value={values.totTrees}
                    active={true}
                    error={errors.Trees}
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
                    {t("new_farmer.title_farmer")}
                  </Text>

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={t("new_farmer.inputs.name")}
                    value={values.farmerName}
                    error={errors.Name}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("phoneNumber")}
                    handleBlur={handleBlur("phoneNumber")}
                    label={t("new_farmer.inputs.phone")}
                    value={values.phoneNumber}
                    error={errors.phone}
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
                      {t("new_farmer.inputs.gender.label")}
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
                            {t("new_farmer.inputs.gender.male")}
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
                            {t("new_farmer.inputs.gender.female")}
                          </Text>
                        }
                      />
                    </RadioButtonGroup>
                  </View>

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("birthYear")}
                    handleBlur={handleBlur("birthYear")}
                    label={t("new_farmer.inputs.birth")}
                    value={values.birthYear}
                    error={errors.Year_Birth}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nationalID")}
                    handleBlur={handleBlur("nationalID")}
                    label={t("new_farmer.inputs.national_id")}
                    value={values.nationalID}
                    error={errors.National_ID}
                  />

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("maritalStatus")}
                      handleBlur={handleBlur("maritalStatus")}
                      label={t("new_farmer.inputs.marital")}
                      value={maritalChoice?.name || values.maritalStatus}
                      error={errors.Marital_Status}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setMaritalModalOpen(true)}
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
                        setFieldValue("maritalStatus", "");
                        setMaritalChoice(null);
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
                  </View>

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("basicMathSkills")}
                      handleBlur={handleBlur("basicMathSkills")}
                      label={t("new_farmer.inputs.math")}
                      value={mathChoice?.name || values.basicMathSkills}
                      error={errors.Math_Skills}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setMathModalOpen(true)}
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
                        setFieldValue("basicMathSkills", "");
                        setMathChoice(null);
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
                  </View>

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("readingSkills")}
                      handleBlur={handleBlur("readingSkills")}
                      label={t("new_farmer.inputs.reading")}
                      value={readingChoice?.name || values.readingSkills}
                      error={errors.Skills}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setReadingModalOpen(true)}
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
                        setFieldValue("readingSkills", "");
                        setReadingChoice(null);
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
                  </View>

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("educationalLevel")}
                      handleBlur={handleBlur("educationalLevel")}
                      label={t("new_farmer.inputs.educational")}
                      value={educationChoice?.name || values.educationalLevel}
                      error={errors.education_level}
                      active={false}
                    />
                    <TouchableOpacity
                      onPress={() => setEducationModalOpen(true)}
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
                        setFieldValue("educationalLevel", "");
                        setEducationChoice(null);
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
                      {t("new_farmer.errors.validation_error")}
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
                  text={t("new_farmer.button")}
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
