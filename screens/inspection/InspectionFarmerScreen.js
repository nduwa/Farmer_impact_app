import {
  Dimensions,
  FlatList,
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

  const { data } = route.params;

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

    if (pages > 0) displayToast(`Page ${currentPage} of ${pages} loaded`);
  };

  const handleBackButton = () => {
    navigation.replace("chooseInspection");
  };

  const handleSearch = (text) => {
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
    }
  }, [farmersXhouseholdsData, searchResults]);

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
          (item) => item.farmerid === farmer.farmerid
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
    }
  }, [farmers]);

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
        setFarmersXhouseholdsData([]); // each farmer info is merged with their corresponding household data
        setGroups([]);
        setHouseholds([]);
        setSelectedGroup(null);
        setSearchResults([]);
        setDisplayData([]);
        setGroupsModalOpen(false);
        setActiveGroup([]);
        setChildrenModal({ open: false, data: null });
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
                <AntDesign name="search1" size={24} color={colors.black_a} />

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
                  <Feather name="x" size={24} color={colors.black_a} />
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
      <View style={{ flex: 1 }}>
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
    </View>
  );
};
