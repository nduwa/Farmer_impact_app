import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../../data/colors";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import { FarmerUpdateCard } from "../../../components/FarmerUpdateCard";
import { GroupAssignCard } from "../../../components/GroupAssignCard";
import { SyncModal } from "../../../components/SyncModal";
import LottieView from "lottie-react-native";
import { InspectionHoverSubmitBtn } from "../../../components/InspectionHoverSubmitBtn";
import { InspectionHoverPrevBtn } from "../../../components/InspectionHoverPrevBtn";
import { updateDBdata } from "../../../helpers/updateDBdata";
import { dataTodb } from "../../../helpers/dataTodb";
import { useSelector } from "react-redux";

export const ChooseGroupScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userData = useSelector((state) => state.user);
  const userName = useSelector((state) => state.user.userData.user.Name_User);

  const { data } = route.params;

  const [groups, setGroups] = useState([]);
  const [stationData, setStationData] = useState({
    kp: null,
    id: null,
    name: null,
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [startAssignModalOpen, setStartAssignModalOpen] = useState(false);
  const [displayData, setDisplayData] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dataStart, setDataStart] = useState(0);
  const [dataEnd, setDataEnd] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const flatListRef = useRef(null);

  const navigation = useNavigation();

  const handleActivateGroups = () => {
    navigation.navigate("InactiveGroupsScreen", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
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

  const handleNextPg = () => {
    setLoadingPage(true);
    let current = currentPage;
    let newpg = (current % totalPages) + 1; // a % b statement restricts value a from ever getting bigger than b.... :)
    setCurrentPage(newpg);
  };

  const handlePrevPg = () => {
    let newpg = currentPage - 1;
    let newpg_fitted = newpg % totalPages; // fitted in the range 0 -> max page
    setCurrentPage(newpg_fitted);
    setLoadingPage(true);
  };

  const handleAssignment = () => {
    setLoadingPage(true);
    let submitData = [];

    for (const farmer of data) {
      let date = new Date();
      let formattedDate = date.toISOString().split("T")[0];
      let formattedTime = date.toISOString().split("T")[1].split(".")[0];

      let tmpObj = {
        _kf_farmer: farmer.__kp_Farmer,
        farmerid: farmer.farmerid,
        farmer_name: farmer.Name,
        _kf_Household: farmer._kf_Household,
        _kf_Supplier: farmer._kf_Supplier,
        _kf_station: farmer._kf_Station,
        station_name: stationData.name,
        station_id: stationData.id,
        kf_group_old: farmer._kf_Group,
        group_name_old: farmer.group_name_old,
        group_id_old: farmer.group_id_old,
        kf_group_new: selectedGroup.__kp_Group,
        group_name_new: selectedGroup.Name,
        group_id_new: selectedGroup.ID_GROUP,
        assigned_by: userData.userData.user.Name_User,
        status: "new",
        created_at: `${formattedDate} ${formattedTime}`,
      };

      submitData.push(tmpObj);
    }

    console.log(submitData);
    dataTodb({
      tableName: "groupAssign",
      syncData: submitData,
      extraValArr: [stationData.kp, stationData.name, stationData.id],
      setCurrentJob,
    });
  };

  const handleSearch = (text) => {
    if (text !== "") {
      text = text.toLowerCase();
      const results = groups.filter((item) => {
        return Object.values(item).some((value) => {
          return String(value).toLowerCase().includes(text);
        });
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleBackButton = () => {
    navigation.navigate("FarmerAssignGroupScreen", { data: null });
  };

  const scrollToTop = () => {
    flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    if (currentJob === "Group assignments saved") {
      setLoadingPage(false);
      displayToast("Assignments to new groups are now pending");
      navigation.navigate("FarmerAssignGroupScreen", { data: null });
    } else if (currentJob === "Error assigning modules") {
      setLoadingPage(false);
      displayToast("Error assigning groups");
    }
  }, [currentJob]);

  useEffect(() => {
    handleDataPagination(groups);
    scrollToTop();
  }, [currentPage]);

  useEffect(() => {
    if (selectedGroup) {
      setStartAssignModalOpen(true);
    }
  }, [selectedGroup]);

  useEffect(() => {
    let data = searchResults.length > 0 ? searchResults : groups;

    if (groups.length > 0) {
      handleDataPagination(data);
    } else {
      setLoadingData(false);
      setLoadingPage(false);
    }
  }, [groups, searchResults]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const stationId = await SecureStore.getItemAsync("rtc-station-id");
        const stationReadableId = await SecureStore.getItemAsync(
          "rtc-station-readable-id"
        );
        const stationName = await SecureStore.getItemAsync("rtc-station-name");

        setLoadingData(true);
        if (stationId) {
          setStationData({
            kp: stationId,
            name: stationName,
            id: stationReadableId,
          });
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
        setGroups([]);
        setSelectedGroup(null);
        setSearchResults([]);
        setStartAssignModalOpen(false);
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
      {startAssignModalOpen && (
        <SyncModal
          label={
            "You are about to assign the selected farmers to this group, proceed?"
          }
          onYes={handleAssignment}
          OnNo={() => {
            setStartAssignModalOpen(false);
            setSelectedGroup(null);
          }}
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
          Choose Group
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          gap: screenWidth * 0.001,
          width: screenWidth,
          padding: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: screenHeight * 0.1,
          }}
        >
          <View
            style={{
              backgroundColor: colors.white_variant,
              marginVertical: screenHeight * 0.018,
              paddingHorizontal: screenWidth * 0.018,
              paddingVertical: screenWidth * 0.008,
              borderRadius: screenWidth * 0.02,
              width: "100%",
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
                    gap: screenWidth * 0.02,
                    alignItems: "center",
                    width: screenWidth * 0.8,
                    paddingHorizontal: screenWidth * 0.014,
                  }}
                >
                  <AntDesign
                    name="search1"
                    size={screenWidth * 0.05}
                    color={colors.black_a}
                  />

                  <TextInput
                    placeholder="Group Name or Group ID"
                    placeholderTextColor={colors.black_a}
                    onChangeText={(text) => {
                      handleChange("search")(text);
                      handleSearch(text);
                    }}
                    onBlur={handleBlur("search")}
                    value={values.search}
                    style={{
                      backgroundColor: colors.white_variant,
                      padding: 5,
                      fontWeight: "500",
                      fontSize: screenWidth * 0.04,
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
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: colors.white,
            borderRadius: 15,
            padding: 8,
            elevation: 6,
          }}
        >
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
                source={require("../../../assets/lottie/loader.json")}
                autoPlay
                speed={0.8}
                loop={true}
                resizeMode="cover"
              />
            </View>
          )}

          {displayData.length > 0 ? (
            <FlatList
              ref={flatListRef}
              contentContainerStyle={{
                padding: 5,
                gap: 15,
              }}
              initialNumToRender={12}
              data={displayData}
              renderItem={({ item }) => (
                <GroupAssignCard data={item} setGroupFn={setSelectedGroup} />
              )}
              keyExtractor={(item, index) => index}
            />
          ) : (
            <View
              style={{
                gap: screenHeight * 0.02,
              }}
            >
              <Text style={{ textAlign: "center" }}>
                No Active Groups found
              </Text>
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
      </View>
      {currentPage > 1 && <InspectionHoverPrevBtn handlePress={handlePrevPg} />}

      {displayData.length > 0 && (
        <InspectionHoverSubmitBtn
          handlePress={handleNextPg}
          currentPage={currentPage}
          totalPages={totalPages}
          active={currentPage < totalPages ? true : false}
          mode="pagination"
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
