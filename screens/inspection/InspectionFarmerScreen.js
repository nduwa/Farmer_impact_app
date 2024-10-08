import {
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
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
import FarmerInspectionCard from "../../components/FarmerInspectionCard";
import { UpdateChildrenModal } from "../../components/UpdateChildrenModal";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { GroupsModal } from "../../components/GroupsModal";
import { InspectionHoverSubmitBtn } from "../../components/InspectionHoverSubmitBtn";
import { InspectionHoverPrevBtn } from "../../components/InspectionHoverPrevBtn";
import LottieView from "lottie-react-native";

export const InspectionFarmerScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [farmers, setFarmers] = useState([]);
  const [farmersXhouseholdsData, setFarmersXhouseholdsData] = useState([]); // each farmer info is merged with their corresponding household data
  const [groups, setGroups] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState([]);
  const [childrenModal, setChildrenModal] = useState({
    open: false,
    data: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dataStart, setDataStart] = useState(0);
  const [dataEnd, setDataEnd] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [searchQueryLength, setSearchQueryLength] = useState(0);

  const { data } = route.params;

  const handleActivateGroups = () => {
    navigation.navigate("InactiveGroupsScreen", { data: null });
  };

  const handleSync = () => {
    navigation.navigate("Sync", { data: null });
  };

  const scrollToTop = () => {
    flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const toggleGroupsModal = () => {
    setGroupsModalOpen(true);
    Keyboard.dismiss();
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

    if (searchQueryLength > 0) return;
    if (pages > 0) displayToast(`Page ${currentPage} of ${pages} loaded`);
  };

  const handleBackButton = () => {
    navigation.replace("chooseInspection");
  };

  const handleSearch = (text) => {
    setSearchQueryLength(text.length);
    setCurrentPage(1);

    if (text !== "") {
      text = text.toLowerCase();
      const results = farmersXhouseholdsData.filter((item) => {
        return Object.values(item).some((value) => {
          return String(value).toLowerCase().includes(text);
        });
      });

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const formatDisplayStr = (text) => {
    return text === "" ? "0" : text;
  };

  const handlePress = () => {
    setLoadingPage(true);
    let current = currentPage;
    let newpg = (current % totalPages) + 1; // a % b statement restricts value a from ever getting bigger than b.... :)
    setCurrentPage(newpg);
  };

  useEffect(() => {
    handleDataPagination(farmersXhouseholdsData);
    scrollToTop();
  }, [currentPage]);

  useEffect(() => {
    let data =
      searchResults.length > 0 ? searchResults : farmersXhouseholdsData;

    if (data.length > 0) {
      handleDataPagination(data);
    } else {
      setLoadingData(false);
      setLoadingPage(false);
    }
  }, [farmersXhouseholdsData, searchResults]);

  useEffect(() => {
    const fetchFarmers = () => {
      retrieveDBdata({
        tableName: "rtc_farmers",
        stationId: selectedGroup._kf_Station,
        groupID: selectedGroup.__kp_Group,
        setData: setFarmers,
        queryArg: `SELECT * FROM rtc_farmers WHERE type = 'online' AND _kf_Station = '${selectedGroup._kf_Station}' AND _kf_Group = '${selectedGroup.__kp_Group}' AND deleted = 0`,
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
    if (households.length > 0) {
      let thisGroupFarmers = farmers;
      let newFarmersData = [];
      for (const farmer of thisGroupFarmers) {
        let extendedFarmerData = {};
        let farmerHouseholdData = households.filter(
          (item) => item.__kp_Household === farmer._kf_Household
        );
        if (farmerHouseholdData && farmerHouseholdData.length > 0) {
          let neededHouseholdInfo = {
            prodTrees: formatDisplayStr(farmerHouseholdData[0].Trees_Producing),
            totalTrees: formatDisplayStr(farmerHouseholdData[0].Trees),
            cell: formatDisplayStr(farmerHouseholdData[0].Area_Small),
            village: formatDisplayStr(farmerHouseholdData[0].Area_Smallest),
            children: formatDisplayStr(farmerHouseholdData[0].Children),
            householdId: farmerHouseholdData[0].__kp_Household,
          };
          extendedFarmerData = { ...farmer, ...neededHouseholdInfo };
          newFarmersData.push(extendedFarmerData);
        }
      }

      setFarmersXhouseholdsData(newFarmersData);
    }
  }, [households]);

  useEffect(() => {
    if (farmers.length > 0) {
      if (activeGroup.id) {
        retrieveDBdata({
          tableName: "rtc_households",
          groupID: activeGroup.ID_GROUP,
          setData: setHouseholds,
        });
      }
    } else {
      setLoadingData(false);
      setLoadingPage(false);
    }
  }, [farmers]);

  useEffect(() => {
    if (activeGroup.id) {
      retrieveDBdata({
        tableName: "rtc_farmers",
        stationId: activeGroup._kf_Station,
        groupID: activeGroup.__kp_Group,
        setData: setFarmers,
        queryArg: `SELECT * FROM rtc_farmers WHERE type = 'online' AND _kf_Station = '${activeGroup._kf_Station}' AND _kf_Group = '${activeGroup.__kp_Group}' AND deleted = 0`,
      });
    }
  }, [activeGroup]);

  useEffect(() => {
    if (groups.length > 0) {
      setActiveGroup(groups[0]);
    }
    setLoadingData(false);
    setLoadingPage(false);
  }, [groups]);

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
            queryArg: `SELECT * FROM rtc_groups WHERE _kf_Station='${stationId}' AND active = "1"`,
          });
        }
      };

      fetchData();
      return () => {
        setFarmers([]);
        setFarmersXhouseholdsData([]); // each farmer info is merged with their corresponding household data
        setGroups([]);
        setHouseholds([]);
        setSelectedGroup(null);
        setSearchResults([]);
        setDisplayData([]);
        setGroupsModalOpen(false);
        setActiveGroup([]);
        setChildrenModal({ open: false, data: null });
        setLoadingData(false);
        setLoadingPage(false);
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
          Choose Farmer For Inspection
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
          <Text
            style={{
              fontWeight: "600",
              fontSize: activeGroup.ID_GROUP
                ? screenWidth * 0.04
                : screenWidth * 0.03,
            }}
          >
            {activeGroup.ID_GROUP || "No groups"}
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
        {loadingData && (
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
        )}

        {displayData.length > 0 && (
          <FlatList
            ref={flatListRef}
            contentContainerStyle={{
              padding: screenHeight * 0.01,
              gap: screenHeight * 0.02,
            }}
            data={displayData}
            initialNumToRender={6}
            renderItem={({ item }) => (
              <FarmerInspectionCard
                data={{
                  farmerName: item.Name,
                  farmerId: item.farmerid,
                  householdKey: item._kf_Household,
                  cell: item.cell,
                  village: item.village,
                  prodTrees: item.prodTrees,
                  totTrees: item.totalTrees,
                  children: item.children,
                  destination: data,
                }}
                setModal={setChildrenModal}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}

        {displayData.length < 1 && groups.length > 0 && (
          <View
            style={{
              gap: screenHeight * 0.02,
            }}
          >
            <Text style={{ textAlign: "center" }}>No active farmers found</Text>
            <TouchableOpacity onPress={handlePress}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.secondary,
                  fontWeight: "600",
                  fontSize: screenWidth * 0.04,
                  textDecorationLine: "underline",
                }}
              >
                Perform data synchronization?
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {groups.length < 1 && !loadingData && (
          <View
            style={{
              gap: screenHeight * 0.02,
            }}
          >
            <Text style={{ textAlign: "center" }}>No active groups found</Text>
            <TouchableOpacity onPress={handleActivateGroups}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.secondary,
                  fontWeight: "600",
                  fontSize: screenWidth * 0.04,
                  textDecorationLine: "underline",
                }}
              >
                Activate groups?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {currentPage > 1 && <InspectionHoverPrevBtn handlePress={handlePrevPg} />}
      {displayData.length > 0 && (
        <InspectionHoverSubmitBtn
          handlePress={handlePress}
          currentPage={currentPage}
          totalPages={totalPages}
          active={currentPage < totalPages ? true : false}
          mode="pagination"
        />
      )}

      {childrenModal.open && (
        <UpdateChildrenModal
          setModal={setChildrenModal}
          data={childrenModal.data}
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
    </View>
  );
};
