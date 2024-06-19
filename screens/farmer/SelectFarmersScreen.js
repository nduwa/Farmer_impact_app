import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { colors } from "../../data/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Feather } from "@expo/vector-icons";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { GroupsModal } from "../../components/GroupsModal";
import { InspectionHoverSubmitBtn } from "../../components/InspectionHoverSubmitBtn";
import { InspectionHoverPrevBtn } from "../../components/InspectionHoverPrevBtn";
import LottieView from "lottie-react-native";
import FarmerTrainingCard from "../../components/FarmerTrainingCard";
import { useSelector } from "react-redux";
import { SyncModal } from "../../components/SyncModal";
import { updateDBdata } from "../../helpers/updateDBdata";

export const SelectFarmersScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userName = useSelector((state) => state.user.userData.user.Name_User);

  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [farmers, setFarmers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState([]);
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dataStart, setDataStart] = useState(0);
  const [dataEnd, setDataEnd] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [deletedFarmers, setDeletedFarmers] = useState([]);

  const filterChecked = (id) => {
    const allChecked = selectedFarmers.filter((item) => item.farmerid !== id);

    setSelectedFarmers(allChecked);
  };

  const scrollToTop = () => {
    flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const toggleGroupsModal = () => {
    setGroupsModalOpen(true);
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handlePrevPg = () => {
    let newpg = currentPage - 1;
    let newpg_fitted = newpg % totalPages; // fitted in the range 0 -> max page
    setCurrentPage(newpg_fitted);
    setLoadingPage(true);
  };

  const handleDataPagination = (data) => {
    const totalItems = data.length;
    const pages = Math.ceil(totalItems / limit);
    setTotalPages(pages);

    let start = (currentPage - 1) * limit;
    let end = start + limit;

    setDataStart(start);
    setDataEnd(end);

    let currentItems = data.slice(start, end);

    setDisplayData(currentItems);
    setLoadingData(false);
    setLoadingPage(false);

    if (pages > 0) displayToast(`Page ${currentPage} of ${pages} loaded`);
  };

  const handleBackButton = () => {
    navigation.replace("Homepage", { data: null });
  };

  const handleSearch = (text) => {
    setCurrentPage(1);

    if (text !== "") {
      text = text.toLowerCase();
      const results = farmers.filter((item) => {
        return Object.values(item).some((value) => {
          return String(value).toLowerCase().includes(text);
        });
      });

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = () => {
    setDeleteModalOpen(true);
  };

  const handleCheckbox = (farmer) => {
    const foundItem = selectedFarmers.find(
      (item) => item?.farmerid === farmer.farmerid
    );

    return foundItem?.checked;
  };

  const handlePress = () => {
    setLoadingPage(true);
    let current = currentPage;
    let newpg = (current % totalPages) + 1; // a % b statement restricts value a from ever getting bigger than b.... :)
    setCurrentPage(newpg);
  };

  const handleDelete = async () => {
    setDeleteModalOpen(false);
    let farmersToDelete = [];
    let strIDs = "";
    let query = "";
    let i = 0;

    for (const farmer of selectedFarmers) {
      farmersToDelete.push(farmer.__kf_farmer);
      strIDs += `'${farmer.__kf_farmer}'`;
      if (i < selectedFarmers.length - 1) strIDs += ",";
      i++;
    }

    setDeletedFarmers(farmersToDelete);

    query = `UPDATE rtc_farmers SET deleted = 1, deleted_by = '${userName}', deleted_at = '${new Date()}', sync = 0 WHERE __kp_Farmer IN(${strIDs})`;

    updateDBdata({
      id: 0,
      query,
      setCurrentJob,
      msgYes: "Farmers removed",
      msgNo: "not removed",
    });
  };

  const handleSyncModal = () => {
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    if (selectedFarmers.length > 0) {
      setSubmitted(false);
    } else {
      setSubmitted(true);
    }
  }, [selectedFarmers]);

  useEffect(() => {
    if (currentJob === "Farmers removed") {
      const newDisplaydata = displayData.reduce((accumulator, currentItem) => {
        if (!deletedFarmers.includes(currentItem.__kp_Farmer)) {
          accumulator.push(currentItem);
        }

        return accumulator;
      }, []);

      setDisplayData(newDisplaydata);

      displayToast("Farmers removed");
      setSelectedFarmers([]);
      setCurrentJob("");
    }
  }, [currentJob]);

  useEffect(() => {
    handleDataPagination(farmers);
    scrollToTop();
  }, [currentPage]);

  useEffect(() => {
    let data = searchResults.length > 0 ? searchResults : farmers;

    if (data.length > 0) {
      handleDataPagination(data);
    }
  }, [farmers, searchResults]);

  useEffect(() => {
    const fetchFarmers = () => {
      retrieveDBdata({
        tableName: "rtc_farmers",
        stationId: selectedGroup._kf_Station,
        groupID: selectedGroup.__kp_Group,
        setData: setFarmers,
      });
    };

    if (selectedGroup) {
      setActiveGroup(selectedGroup);
      setLoadingData(true);
      setLoadingPage(true);
      setCurrentPage(1);
      fetchFarmers();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (activeGroup.id) {
      retrieveDBdata({
        tableName: "rtc_farmers",
        stationId: activeGroup._kf_Station,
        groupID: activeGroup.__kp_Group,
        setData: setFarmers,
      });
    }
  }, [activeGroup]);

  useEffect(() => {
    if (groups.length > 0) {
      setActiveGroup(groups[0]);
    }
  }, [groups.length]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const stationId = await SecureStore.getItemAsync("rtc-station-id");

        setLoadingData(true);
        if (stationId) {
          retrieveDBdata({
            tableName: "rtc_groups",
            stationId,
            setData: setGroups,
          });
        }
      };

      fetchData();
      return () => {
        setFarmers([]);
        setGroups([]);
        setSelectedGroup(null);
        setSearchResults([]);
        setDisplayData([]);
        setGroupsModalOpen(false);
        setActiveGroup([]);
        setSelectedFarmers([]);
        setDeletedFarmers([]);
        setCurrentJob(null);
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg_variant,
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
          Choose Farmers For Training
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: screenHeight * 0.1,
          padding: screenWidth * 0.015,
        }}
      >
        <TouchableOpacity
          onPress={toggleGroupsModal}
          style={{
            backgroundColor: colors.white_variant,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            height: "62%",
            paddingVertical: screenWidth * 0.013,
            paddingHorizontal: screenWidth * 0.03,
            elevation: 6,
          }}
        >
          <Text style={{ fontWeight: "600" }}>
            {activeGroup.ID_GROUP || "loading.."}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: colors.white_variant,
            marginVertical: screenHeight * 0.014,
            paddingHorizontal: screenWidth * 0.015,
            paddingVertical: screenWidth * 0.02,
            borderRadius: screenWidth * 0.03,
            width: "78%",
            elevation: 6,
          }}
        >
          <Formik
            initialValues={{
              search: "",
            }}
            onSubmit={async (values) => {}}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
            }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: screenWidth * 0.01,
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <AntDesign
                  name="search1"
                  size={screenWidth * 0.05}
                  color={colors.black_a}
                />

                <TextInput
                  placeholderTextColor={colors.black_a}
                  placeholder="Farmer Name, Household or Farmer ID"
                  onChangeText={(text) => {
                    handleChange("search")(text);
                    handleSearch(text);
                  }}
                  onBlur={handleBlur("search")}
                  value={values.search}
                  style={{
                    backgroundColor: colors.white_variant,
                    padding: screenWidth * 0.005,
                    fontWeight: "400",
                    fontSize: screenWidth * 0.032,
                    color: colors.secondary_variant,
                    width: "100%",
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setFieldValue("search", "");
                    setSearchResults([]);
                  }}
                >
                  <Feather
                    name="x"
                    size={screenWidth * 0.05}
                    color={colors.black_a}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {loadingData ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              style={{
                height: 160,
                width: 160,
                alignSelf: "center",
                marginVertical: 30,
              }}
              source={require("../../assets/lottie/loader.json")}
              autoPlay
              speed={0.8}
              loop={true}
              resizeMode="cover"
            />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            contentContainerStyle={{
              padding: screenHeight * 0.01,
              gap: screenHeight * 0.02,
            }}
            data={displayData}
            initialNumToRender={6}
            renderItem={({ item }) => (
              <FarmerTrainingCard
                data={{
                  farmerName: item.Name,
                  farmerId: item.farmerid,
                  Year_Birth: item.Year_Birth,
                  __kf_farmer: item.__kp_Farmer,
                  __kf_group: item._kf_Group,
                }}
                filterFn={filterChecked}
                isChecked={handleCheckbox(item) || false}
                setChecked={setSelectedFarmers}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      {currentPage > 1 && (
        <InspectionHoverPrevBtn
          topRatio={selectedFarmers.length > 0 ? 0.66 : 0.75}
          handlePress={handlePrevPg}
        />
      )}
      {displayData.length > 0 && (
        <InspectionHoverSubmitBtn
          handlePress={handlePress}
          currentPage={currentPage}
          totalPages={totalPages}
          active={currentPage < totalPages ? true : false}
          topRatio={selectedFarmers.length > 0 ? 0.75 : 0.85}
          mode="pagination"
        />
      )}

      {selectedFarmers.length > 0 && (
        <InspectionHoverSubmitBtn
          handlePress={handleSubmit}
          active={!submitted}
        />
      )}

      {/* page loader */}
      {loadingPage && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.195,
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

      {/* delete modal */}
      {deleteModalOpen && (
        <SyncModal
          label={`You're about to remove the selected farmers, are you sure?`}
          onYes={handleDelete}
          OnNo={handleSyncModal}
          labelYes="Ok"
          labelNo="No"
        />
      )}
    </View>
  );
};
