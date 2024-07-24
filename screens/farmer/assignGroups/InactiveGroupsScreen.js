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
import { colors } from "../../../data/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Feather } from "@expo/vector-icons";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import { InspectionHoverSubmitBtn } from "../../../components/InspectionHoverSubmitBtn";
import { InspectionHoverPrevBtn } from "../../../components/InspectionHoverPrevBtn";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import GroupSelectCard from "../../../components/GroupSelectCard";
import { dataTodb } from "../../../helpers/dataTodb";
import { SyncModal } from "../../../components/SyncModal";
import { updateDBdata } from "../../../helpers/updateDBdata";
import { getCurrentDate } from "../../../helpers/getCurrentDate";

export const InactiveGroupsScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const userName = useSelector((state) => state.user.userData.user.Name_User);

  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [groups, setGroups] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [activatedGroups, setActivatedGroups] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dataStart, setDataStart] = useState(0);
  const [dataEnd, setDataEnd] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const handleDeactivateGroups = () => {
    navigation.navigate("ActiveGroupsScreen", { data: null });
  };
  const filterChecked = (id) => {
    const allChecked = selectedGroups.filter((item) => item.__kp_Group !== id);

    setSelectedGroups(allChecked);
  };

  const scrollToTop = () => {
    flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
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
    navigation.replace("ActiveGroupsScreen", { data: null });
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

  const handleCheckbox = (group) => {
    const foundItem = selectedGroups.find(
      (item) => item?.__kp_Group === group.__kp_Group
    );

    return foundItem?.checked;
  };

  const handlePress = () => {
    setLoadingPage(true);
    let current = currentPage;
    let newpg = (current % totalPages) + 1; // a % b statement restricts value a from ever getting bigger than b.... :)
    setCurrentPage(newpg);
  };

  const handleActivation = () => {
    setActivateModalOpen(false);
    let groupsToActivate = [];
    let strIDs = "";
    let query = "";
    let i = 0;

    for (const group of selectedGroups) {
      let tmpObj = {
        ...group,
        ...{ active: 1, created_at: getCurrentDate() },
      };
      groupsToActivate.push(tmpObj);
      strIDs += `'${group.__kp_Group}'`;
      if (i < selectedGroups.length - 1) strIDs += ",";
      i++;
    }

    setActivatedGroups(groupsToActivate);

    query = `UPDATE rtc_groups SET active = 1 WHERE __kp_Group IN(${strIDs})`;

    updateDBdata({
      id: 0,
      query,
      setCurrentJob,
      msgYes: "Groups activated",
      msgNo: "not activated",
    });
  };

  useEffect(() => {
    if (currentJob === "Groups activated") {
      dataTodb({
        tableName: "groupActive",
        syncData: activatedGroups,
        setCurrentJob,
        extraVal: userName,
      });
    } else if (currentJob === "Groups changes saved") {
      const newDisplaydata = groups.reduce((accumulator, currentItem) => {
        if (
          !activatedGroups.some(
            (group) => group.__kp_Group === currentItem.__kp_Group
          )
        ) {
          accumulator.push(currentItem);
        }

        return accumulator;
      }, []);

      handleDataPagination(newDisplaydata);

      displayToast("Groups activated");
      setSelectedGroups([]);
      setCurrentJob("");
    } else if (
      currentJob === "not activated" ||
      currentJob === "Error saving groups changes"
    ) {
      displayToast("Error: Groups not activated");
      setCurrentJob("");
    }
  }, [currentJob]);

  useEffect(() => {
    if (selectedGroups.length > 0) {
      setSubmitted(false);
    } else {
      setSubmitted(true);
    }
  }, [selectedGroups]);

  useEffect(() => {
    handleDataPagination(groups);
    scrollToTop();
  }, [currentPage]);

  useEffect(() => {
    let data = searchResults.length > 0 ? searchResults : groups;

    if (data.length > 0) {
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

        setLoadingData(true);
        if (stationId) {
          retrieveDBdata({
            tableName: "rtc_groups",
            stationId,
            setData: setGroups,
            queryArg: `SELECT * FROM rtc_groups WHERE _kf_Station='${stationId}' AND active = 0`,
          });
        }
      };

      fetchData();
      return () => {
        setGroups([]);
        setSearchResults([]);
        setDisplayData([]);
        setCurrentJob(null);
        setLoadingData(false);
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
          In-Active Groups
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: screenHeight * 0.1,
          padding: screenWidth * 0.015,
        }}
      >
        <TouchableOpacity
          onPress={handleDeactivateGroups}
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
              fontSize: screenWidth * 0.04,
            }}
          >
            {"Deactivate more"}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: colors.white_variant,
            marginVertical: screenHeight * 0.014,
            paddingHorizontal: screenWidth * 0.015,
            paddingVertical: screenWidth * 0.02,
            borderRadius: screenWidth * 0.03,
            width: "60%",
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
                  width: "78%",
                }}
              >
                <AntDesign
                  name="search1"
                  size={screenWidth * 0.05}
                  color={colors.black_a}
                />

                <TextInput
                  placeholderTextColor={colors.black_a}
                  placeholder="Group Name or Group ID"
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
              source={require("../../../assets/lottie/loader.json")}
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
              <GroupSelectCard
                data={item}
                filterFn={filterChecked}
                isChecked={handleCheckbox(item) || false}
                setChecked={setSelectedGroups}
                use={"activate"}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}

        {displayData.length < 1 && !loadingData && (
          <View
            style={{
              gap: screenHeight * 0.02,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              No In-Active groups found
            </Text>
            <TouchableOpacity onPress={handleBackButton}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.secondary,
                  fontWeight: "600",
                  fontSize: screenWidth * 0.04,
                  textDecorationLine: "underline",
                }}
              >
                Go back?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {currentPage > 1 && (
        <InspectionHoverPrevBtn
          topRatio={selectedGroups.length > 0 ? 0.66 : 0.75}
          handlePress={handlePrevPg}
        />
      )}
      {displayData.length > 0 && (
        <InspectionHoverSubmitBtn
          handlePress={handlePress}
          currentPage={currentPage}
          totalPages={totalPages}
          active={currentPage < totalPages ? true : false}
          topRatio={selectedGroups.length > 0 ? 0.75 : 0.85}
          mode="pagination"
        />
      )}

      {selectedGroups.length > 0 && (
        <InspectionHoverSubmitBtn
          handlePress={() => setActivateModalOpen(true)}
          active={!submitted}
          positive={true}
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

      {/* submit modal */}
      {activateModalOpen && (
        <SyncModal
          label={`You're about to activate the selected groups, are you sure?`}
          onYes={handleActivation}
          OnNo={() => setActivateModalOpen(false)}
          labelYes="Ok"
          labelNo="No"
        />
      )}
    </View>
  );
};
