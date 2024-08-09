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
import { LocalizationModal } from "../../../components/LocalizationModal";
import { newFarmerSchema } from "../../../validation/newFarmerSchema";
import { SyncModal } from "../../../components/SyncModal";
import { deleteDBdataAsync } from "../../../helpers/deleteDBdataAsync";
import { updateDBdataAsync } from "../../../helpers/updateDBdataAsync";
import LottieView from "lottie-react-native";

export const FarmerEditScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { data } = route.params;

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

  const [maritalChoice, setMaritalChoice] = useState(null);
  const [readingChoice, setReadingChoice] = useState(null);
  const [educationChoice, setEducationChoice] = useState(null);
  const [mathChoice, setMathChoice] = useState(null);

  const [activeGroup, setActiveGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(true);

  const [gender, setGender] = useState(data.farmerData.Gender || "");
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const [errors, setErrors] = useState({}); // validation errors
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const farmerMarital = [
    { id: 1, name: "Single", value: "S" },
    { id: 2, name: "Married", value: "M" },
    { id: 3, name: "Widowed", value: "W" },
    { id: 4, name: "Divorced", value: "D" },
  ];

  const farmerReading = [
    { id: 1, name: "Cannot Read", value: "A" },
    { id: 2, name: "Can read with some assistance", value: "B" },
    { id: 3, name: "Can read without some assistance from others", value: "C" },
  ];

  const farmerEducation = [
    { id: 1, name: "No formal education", value: "A" },
    { id: 2, name: "Some primary", value: "B" },
    { id: 3, name: "Complete primary", value: "C" },
    { id: 4, name: "Some secondary", value: "D" },
    { id: 5, name: "Complete secondary", value: "E" },
    { id: 6, name: "Some technical school or university", value: "F" },
    { id: 7, name: "Complete technical school or university", value: "G" },
  ];

  const farmerMath = [
    { id: 1, name: "No math skills", value: "A" },
    {
      id: 2,
      name: "Can do basic math with assistance from others",
      value: "B",
    },
    {
      id: 3,
      name: "Can do basic math without assistance from others",
      value: "C",
    },
  ];

  const getLabel = (val = "", arr = []) => {
    for (const item of arr) {
      if (val === item.value) return item.name;
    }
  };

  const getValue = (val = "", arr = []) => {
    if (val.length > 1) {
      for (const item of arr) {
        if (val === item.name) return item.value;
      }
    } else return val;
  };

  const navigation = useNavigation();

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
      let farmerInfo = {
        farmer_name: farmerData?.farmerName.trim(),
        phone: farmerData?.phoneNumber.trim(),
        Gender: gender,
        Year_Birth: String(farmerData?.birthYear).trim(),
        National_ID: String(farmerData?.nationalID).trim(),
        Marital_Status:
          maritalChoice?.value ||
          getValue(farmerData?.maritalStatus, farmerMarital),
        Math_Skills:
          mathChoice?.value ||
          getValue(farmerData?.basicMathSkills, farmerMath),
        Skills:
          readingChoice?.value ||
          getValue(farmerData?.readingSkills, farmerReading),
        education_level:
          educationChoice?.value ||
          getValue(farmerData?.educationalLevel, farmerEducation),
        created_at: data.farmerData.created_at,
        cell: cellChoice?.name || data.farmerData.cell,
        village: villageChoice?.name || data.farmerData.village,
        sector: data.farmerData.sector,
        Trees: String(farmerData?.totTrees).trim(),
        Trees_Producing: String(farmerData?.prodTrees).trim(),
        number_of_plots: String(farmerData?.totalPlots).trim(),
        full_name: data.farmerData.full_name,
        _kf_User: data.farmerData._kf_User,
        user_code: data.farmerData.user_code,
        _kf_Staff: data.farmerData._kf_Staff,
        farm_GPS: data.farmerData.farm_GPS,
      };

      setErrors({});
      let submitData = {
        ...farmerInfo,
      };

      if (!validateForm(submitData, newFarmerSchema)) return;

      let updateQuery = `UPDATE rtc_field_farmers SET Group_ID = '${activeGroup.ID_GROUP}', farmer_name='${farmerInfo.farmer_name}', phone='${farmerInfo.phone}', Gender='${farmerInfo.Gender}',Year_Birth='${farmerInfo.Year_Birth}', National_ID = '${farmerInfo.National_ID}', Marital_Status = '${farmerInfo.Marital_Status}', Math_Skills = '${farmerInfo.Math_Skills}', Skills = '${farmerInfo.Skills}', education_level = '${farmerInfo.education_level}', cell = '${farmerInfo.cell}', village = '${farmerInfo.village}', Trees = '${farmerInfo.Trees}', Trees_Producing = '${farmerInfo.Trees_Producing}', number_of_plots = '${farmerInfo.number_of_plots}' WHERE id = '${data.farmerData.id}' `;

      updateDBdataAsync({ id: data.farmerData.id, query: updateQuery })
        .then((result) => {
          if (result.success) {
            setCurrentJob("Farmer details updated");
          } else {
            setCurrentJob("Failed to update farmer details");
          }
        })
        .catch((error) => {
          setCurrentJob("Failed to update farmer details");
          console.log("Failed to update farmer details: ", error);
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

  const handleDelete = () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "rtc_field_farmers",
      targetId: id,
      customQuery: `DELETE FROM rtc_field_farmers WHERE id = '${id}';`,
    })
      .then((result) => {
        if (result.success) {
          displayToast("Farmer deleted");
          setCurrentJob("Farmer deleted");
        } else {
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
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
    if (currentJob === "Farmer details updated") {
      displayToast("Farmer details updated");
      setFormSubmitted(true);
      setCurrentJob("");
    } else if (currentJob === "Farmer deleted") {
      navigation.navigate("PendingRegistrationScreen");
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

  useEffect(() => {
    if (groups.length > 0) {
      setLoading(false);
      for (const group of groups) {
        if (group.ID_GROUP === data.farmerData.Group_ID) {
          setActiveGroup(group);
        }
      }
    }
  }, [groups.length]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const stationId = await SecureStore.getItemAsync("rtc-station-id");

        if (stationId) {
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
        setLoading(false);
        setGroups([]);
        setSelectedGroup(null);
        setGroupsModalOpen(false);
        setActiveGroup([]);
        setVillageList([]);
        setCellList([]);
        setVillageChoice(null);
        setCellChoice(null);
        setErrors({});
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
          title={"Cells"}
        />
      )}

      {villagesModalOpen && (
        <LocalizationModal
          setChoice={setVillageChoice}
          data={villageList}
          setModalOpen={setvillagesModalOpen}
          heightRatio={isKeyboardActive ? 0.5 : 0.8}
          title={"Villages"}
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
          New Farmer
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
            farmerName: data.farmerData.farmer_name,
            phoneNumber: data.farmerData.phone,
            gender,
            nationalID: data.farmerData.National_ID,
            maritalStatus: data.farmerData.Marital_Status,
            basicMathSkills: data.farmerData.Math_Skills,
            readingSkills: data.farmerData.Skills,
            educationalLevel: data.farmerData.education_level,
            birthYear: data.farmerData.Year_Birth,
            cell: data.farmerData.cell,
            village: data.farmerData.village,
            totalPlots: data.farmerData.number_of_plots,
            prodTrees: data.farmerData.Trees_Producing,
            totTrees: data.farmerData.Trees,
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
                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("groupName")}
                      handleBlur={handleBlur("groupName")}
                      label={"Choose group name"}
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
                  </View>

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("cell")}
                      handleBlur={handleBlur("cell")}
                      label={"Cell"}
                      value={cellChoice?.name || values.cell}
                      active={false}
                      error={errors.cell}
                    />
                    <>
                      <TouchableOpacity
                        onPress={() => setCellsModalOpen(true)}
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
                          setFieldValue("cell", "");
                          setFieldValue("village", "");
                          setCellChoice(null);
                          setVillageChoice(null);
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
                    </>
                  </View>

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("village")}
                      handleBlur={handleBlur("village")}
                      label={"Village"}
                      value={villageChoice?.name || values.village}
                      active={false}
                      error={errors.village}
                    />
                    <>
                      <TouchableOpacity
                        onPress={() => setvillagesModalOpen(true)}
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
                          setFieldValue("village", "");
                          setVillageChoice(null);
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
                    </>
                  </View>

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalPlots")}
                    handleBlur={handleBlur("totalPlots")}
                    label={"Total plots of land with coffee"}
                    value={`${values.totalPlots}`}
                    active={true}
                    error={errors.number_of_plots}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("prodTrees")}
                    handleBlur={handleBlur("prodTrees")}
                    label={"Productive Trees"}
                    value={`${values.prodTrees}`}
                    active={true}
                    error={errors.Trees_Producing}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totTrees")}
                    handleBlur={handleBlur("totTrees")}
                    label={"Total Trees"}
                    value={`${values.totTrees}`}
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
                    Farmer information
                  </Text>

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer Name"}
                    value={values.farmerName}
                    error={errors.farmer_name}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("phoneNumber")}
                    handleBlur={handleBlur("phoneNumber")}
                    label={"Phone number"}
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
                    value={`${values.birthYear}`}
                    error={errors.Year_Birth}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nationalID")}
                    handleBlur={handleBlur("nationalID")}
                    label={"National ID"}
                    value={values.nationalID}
                    error={errors.National_ID}
                  />

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("maritalStatus")}
                      handleBlur={handleBlur("maritalStatus")}
                      label={"Marital Status"}
                      value={
                        maritalChoice?.name ||
                        getLabel(values.maritalStatus, farmerMarital)
                      }
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
                      value={
                        mathChoice?.name ||
                        getLabel(values.basicMathSkills, farmerMath)
                      }
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
                      value={
                        readingChoice?.name ||
                        getLabel(values.readingSkills, farmerReading)
                      }
                      error={errors.Skills}
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
                      value={
                        educationChoice?.name ||
                        getLabel(values.educationalLevel, farmerEducation)
                      }
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

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: screenWidth * 0.98,
                  }}
                >
                  <CustomButton
                    bg={colors.secondary}
                    color={"white"}
                    width="48%"
                    text="Delete"
                    bdcolor="transparent"
                    fontSizeRatio={0.043}
                    mt={screenHeight * 0.017}
                    mb={
                      isKeyboardActive
                        ? screenHeight * 0.04
                        : screenHeight * 0.03
                    }
                    radius={5}
                    disabled={formSubmitted}
                    onPress={() =>
                      setDeleteModal({
                        id: data?.farmerData?.id,
                        open: true,
                      })
                    }
                  />
                  <CustomButton
                    bg={colors.blue_font}
                    color={"white"}
                    width="48%"
                    text="Edit"
                    bdcolor="transparent"
                    fontSizeRatio={0.043}
                    mt={screenHeight * 0.017}
                    mb={
                      isKeyboardActive
                        ? screenHeight * 0.04
                        : screenHeight * 0.03
                    }
                    radius={5}
                    disabled={formSubmitted}
                    onPress={handleSubmit}
                  />
                </View>
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>

      {deleteModal.open && (
        <SyncModal
          label={"Are you sure you want to delete this farmer?"}
          onYes={handleDelete}
          OnNo={() =>
            setDeleteModal((prevState) => ({ ...prevState, open: false }))
          }
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
