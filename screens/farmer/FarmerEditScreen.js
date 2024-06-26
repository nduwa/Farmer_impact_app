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
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../components/BuyCoffeeInput";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import { FontAwesome6 } from "@expo/vector-icons";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { GroupsModal } from "../../components/GroupsModal";
import { LocalizationModal } from "../../components/LocalizationModal";
import { newFarmerSchema } from "../../validation/newFarmerSchema";
import { useSelector } from "react-redux";
import { SyncModal } from "../../components/SyncModal";
import { deleteDBdataAsync } from "../../helpers/deleteDBdataAsync";
import { updateDBdataAsync } from "../../helpers/updateDBdataAsync";
import LottieView from "lottie-react-native";

export const FarmerEditScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userData = useSelector((state) => state.user);
  const { data } = route.params;

  const [currentStationID, setCurrentStationID] = useState();
  const [supplierID, setSupplierID] = useState();
  const [userName, setUserName] = useState();

  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [cellsModalOpen, setCellsModalOpen] = useState(false);
  const [villagesModalOpen, setvillagesModalOpen] = useState(false);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [readingModalOpen, setReadingModalOpen] = useState(false);
  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [maritalModalOpen, setMaritalModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);

  const [cellChoice, setCellChoice] = useState(null);
  const [villageChoice, setVillageChoice] = useState(null);
  const [cellList, setCellList] = useState([]);
  const [villageList, setVillageList] = useState([]);

  const [positionChoice, setPositionChoice] = useState(null);
  const [maritalChoice, setMaritalChoice] = useState(null);
  const [readingChoice, setReadingChoice] = useState(null);
  const [educationChoice, setEducationChoice] = useState(null);
  const [mathChoice, setMathChoice] = useState(null);

  const [activeGroup, setActiveGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  const [householdSubmitData, setHouseholdSubmitData] = useState();
  const [loading, setLoading] = useState(true);

  const [gender, setGender] = useState(data.farmerData.Gender || "");
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
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

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
    console.log(newErrors);
    return false;
  };

  const submitFarmer = async (farmerData) => {
    try {
      let farmerInfo = {
        __kp_Farmer: data.farmerData.__kp_Farmer,
        Name: farmerData?.farmerName.trim(),
        Phone: String(farmerData?.phoneNumber).trim(),
        Gender: gender,
        Year_Birth: String(farmerData?.birthYear).trim(),
        National_ID_t: String(farmerData?.nationalID).trim(),
        Position: positionChoice?.name || farmerData?.position,
        Marital_Status: maritalChoice?.name || farmerData?.maritalStatus,
        Math_Skills: mathChoice?.name || farmerData?.basicMathSkills,
        Reading_Skills: readingChoice?.name || farmerData?.readingSkills,
        education_level: educationChoice?.name || farmerData?.educationalLevel,
        farmerid: "", // generated on the server
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
        Area_Small: cellChoice?.name || data.farmerData.Area_Small,
        Area_Smallest: villageChoice?.name || data.farmerData.Area_Smallest,
        Trees: farmerData?.totTrees.trim(),
        Trees_Producing: farmerData?.prodTrees.trim(),
        number_of_plots_with_coffee: farmerData?.totalPlots.trim(),
        STP_Weight: `${farmerData?.stp1.trim()} ${farmerData?.stp2.trim()}`,
        latitude: userData.location.coords.latitude,
        longitude: userData.location.coords.longitude,
        householdid: "",
        seasonal_goal: "",
        recordid: "",
      };

      let householdInfo = {
        _kf_Group: activeGroup.__kp_Group,
        __kp_Household: data.farmerData.__kp_Household,
        _kf_Location: "",
        _kf_Supplier: supplierID,
        _kf_Station: currentStationID,
        Area_Small: cellChoice?.name || data.farmerData.Area_Small,
        Area_Smallest: villageChoice?.name || data.farmerData.Area_Smallest,
        Trees_Producing: farmerData?.prodTrees.trim(),
        Trees: farmerData?.totTrees.trim(),
        number_of_plots_with_coffee: farmerData?.totalPlots.trim(),
        STP_Weight: `${farmerData?.stp1.trim()} ${farmerData?.stp2.trim()}`,
        householdid: "",
        z_Farmer_Primary: "",
        created_at: new Date(),
        type: "new",
        farmerid: "", // generated on the server
        group_id: activeGroup.ID_GROUP,
        latitude: userData.location.coords.latitude,
        longitude: userData.location.coords.longitude,
        Children: "",
        Childen_gender: "",
        Childen_below_18: "",
        recordid: "",
        status: "Active",
        inspectionId: "",
        cafeId: "0",
        InspectionStatus: "Inactive",
        sync: "0",
      };

      setErrors({});
      let submitData = {
        ...farmerInfo,
        ...householdInfo,
        ...{ _kf_Household: householdInfo.__kp_Household },
      };

      if (!validateForm(submitData, newFarmerSchema)) return;

      setHouseholdSubmitData(householdInfo);

      let updateQuery = `UPDATE rtc_farmers SET _kf_Group = '${
        activeGroup.__kp_Group
      }', Name='${farmerInfo.Name}', Phone='${farmerInfo.Phone}', Gender='${
        farmerInfo.Gender
      }',Year_Birth='${farmerInfo.Year_Birth}', National_ID_t = '${
        farmerInfo.National_ID_t
      }', Position = '${farmerInfo.Position}', Marital_Status = '${
        farmerInfo.Marital_Status
      }', Math_Skills = '${farmerInfo.Math_Skills}', Reading_Skills = '${
        farmerInfo.Reading_Skills
      }', education_level = '${
        farmerInfo.education_level
      }', updated_at = '${new Date()}', Area_Small = '${
        farmerInfo.Area_Small
      }', Area_Smallest = '${farmerInfo.Area_Smallest}', Trees = '${
        farmerInfo.Trees
      }', Trees_Producing = '${
        farmerInfo.Trees_Producing
      }', number_of_plots_with_coffee = '${
        farmerInfo.number_of_plots_with_coffee
      }',STP_Weight = '${farmerInfo.STP_Weight}' WHERE __kp_Farmer = '${
        farmerInfo.__kp_Farmer
      }' `;

      updateDBdataAsync({ id: data.farmerData.__kp_Farmer, query: updateQuery })
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

  const handleNewMember = () => {
    navigation.navigate("FarmerNewHHmember", { data });
  };

  const handleDelete = () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "rtc_farmers",
      targetId: id,
      customQuery: `DELETE FROM rtc_farmers WHERE __kp_Farmer = '${id}';`,
    })
      .then((result) => {
        if (result.success) {
          displayToast("Farmer deleted");
          setCurrentJob("Farmer deleted");
          navigation.navigate();
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
      let updateQuery = `UPDATE rtc_households SET _kf_Group = '${householdSubmitData._kf_Group}', Area_Small = '${householdSubmitData.Area_Small}', Area_Smallest = '${householdSubmitData.Area_Smallest}', Trees_Producing = '${householdSubmitData.Trees_Producing}', Trees = '${householdSubmitData.Trees}', number_of_plots_with_coffee = '${householdSubmitData.number_of_plots_with_coffee}', STP_Weight = '${householdSubmitData.STP_Weight}', group_id = '${householdSubmitData.group_id}' WHERE __kp_Household = '${data.farmerData.__kp_Household}'`;
      updateDBdataAsync({
        id: data.farmerData.__kp_Household,
        query: updateQuery,
      })
        .then((result) => {
          setLoading(false);
          if (result.success) {
            setCurrentJob("Household details updated");
          } else {
            setCurrentJob("Failed to update Household details");
          }
        })
        .catch((error) => {
          setLoading(false);
          setCurrentJob("Failed to update Household details");
          console.log("Failed to update Household details: ", error);
        });
    } else if (currentJob === "Household details updated") {
      displayToast("All details updated");
      setFormSubmitted(true);
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
        if (group.__kp_Group === data.farmerData._kf_Group) {
          setActiveGroup(group);
        }
      }
    }
  }, [groups.length]);

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
          setLoading(true);

          retrieveDBdata({
            tableName: "rtc_groups",
            stationId,
            setData: setGroups,
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
            farmerName: data.farmerData.Name,
            phoneNumber: data.farmerData.Phone,
            gender,
            nationalID: data.farmerData.National_ID_t,
            position: data.farmerData.Position,
            maritalStatus: data.farmerData.Marital_Status,
            basicMathSkills: data.farmerData.Math_Skills,
            readingSkills: data.farmerData.Reading_Skills,
            educationalLevel: data.farmerData.education_level,
            birthYear: data.farmerData.Year_Birth,
            householdID: "",
            cell: data.farmerData.Area_Small,
            village: data.farmerData.Area_Smallest,
            totalPlots: data.farmerData.number_of_plots_with_coffee,
            prodTrees: data.farmerData.Trees_Producing,
            totTrees: data.farmerData.Trees,
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
                      error={errors._kf_Group}
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
                      handleChange={handleChange("householdID")}
                      handleBlur={handleBlur("householdID")}
                      label={"Household ID(if any)"}
                      value={values.householdID}
                      active={false}
                    />
                  </View>

                  <View>
                    <BuyCoffeeInput
                      values={values}
                      handleChange={handleChange("cell")}
                      handleBlur={handleBlur("cell")}
                      label={"Cell"}
                      value={cellChoice?.name || values.cell}
                      active={false}
                      error={errors.Area_Small}
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
                      error={errors.Area_Smallest}
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
                    error={errors.number_of_plots_with_coffee}
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
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("stp1")}
                    handleBlur={handleBlur("stp1")}
                    label={"Seasonal Total produced for previous year"}
                    value={`${values.stp1}`}
                    active={true}
                    error={errors.STP_Weight}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("stp2")}
                    handleBlur={handleBlur("stp2")}
                    label={"Seasonal Total produced for current year"}
                    value={`${values.stp2}`}
                    active={true}
                    error={errors.STP_Weight}
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
                    value={`${values.birthYear}`}
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
                    width="32%"
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
                        id: data?.farmerData?.__kp_Farmer,
                        open: true,
                      })
                    }
                  />
                  <CustomButton
                    bg={colors.blue_font}
                    color={"white"}
                    width="32%"
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
                  <CustomButton
                    bg={colors.black}
                    color={"white"}
                    width="32%"
                    text="Add member"
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
                    onPress={handleNewMember}
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
              source={require("../../assets/lottie/spinner.json")}
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
