import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import { FarmerCard } from "../../components/FarmerCard";
import { GroupsModal } from "../../components/GroupsModal";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import LottieView from "lottie-react-native";

export const FarmerScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [groups, setGroups] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [emptyResults, setEmptyResults] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const navigation = useNavigation();

  const handleActivateGroups = () => {
    navigation.navigate("InactiveGroupsScreen", { data: null });
  };

  const handlePress = () => {
    navigation.navigate("Sync", { data: null });
  };
  const handleSearch = (text) => {
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

  const toggleGroupsModal = () => {
    setGroupsModalOpen(true);
  };
  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  useEffect(() => {
    setLoadingData(false);
  }, [farmers]);

  useEffect(() => {
    if (activeGroup.id) {
      setEmptyResults(false);

      retrieveDBdata({
        tableName: "rtc_farmers",
        stationId: activeGroup._kf_Station,
        groupID: activeGroup.__kp_Group,
        setData: setFarmers,
        setEmpty: setEmptyResults,
      });
    }
  }, [activeGroup]);

  const displayData = searchResults.length > 0 ? searchResults : farmers;

  useEffect(() => {
    const fetchFarmers = () => {
      setEmptyResults(false);

      retrieveDBdata({
        tableName: "rtc_farmers",
        stationId: selectedGroup._kf_Station,
        groupID: selectedGroup.__kp_Group,
        setData: setFarmers,
        setEmpty: setEmptyResults,
      });
    };

    if (selectedGroup) {
      setActiveGroup(selectedGroup);
      fetchFarmers();
    }
  }, [selectedGroup]);

  useEffect(() => {
    setLoadingData(false);

    if (groups.length > 0) {
      setActiveGroup(groups[0]);
    }
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
        setLoadingData(false);
        setFarmers([]);
        setGroups([]);
        setSelectedGroup(null);
        setGroupsModalOpen(false);
        setSearchResults([]);
        setEmptyResults(false);
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
          Registered ATP Farmer
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          gap: 10,
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
          <TouchableOpacity
            onPress={toggleGroupsModal}
            style={{
              backgroundColor: colors.white_variant,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              height: "62%",
              paddingVertical: screenWidth * 0.012,
              paddingHorizontal: screenWidth * 0.02,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontSize: activeGroup.ID_GROUP
                  ? screenWidth * 0.04
                  : screenWidth * 0.03,
                fontWeight: "600",
              }}
            >
              {activeGroup.ID_GROUP || "No groups"}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.white_variant,
              marginVertical: screenHeight * 0.018,
              paddingHorizontal: screenWidth * 0.018,
              paddingVertical: screenWidth * 0.02,
              borderRadius: 15,
              width: "80%",
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
                    onChangeText={(text) => {
                      handleChange("search")(text);
                      handleSearch(text);
                    }}
                    onBlur={handleBlur("search")}
                    value={values.search}
                    style={{
                      backgroundColor: colors.white_variant,
                      padding: 5,
                      fontWeight: "700",
                      fontSize: screenWidth * 0.05,
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
              contentContainerStyle={{
                padding: 5,
                gap: 15,
              }}
              initialNumToRender={12}
              data={displayData}
              renderItem={({ item }) => <FarmerCard data={item} />}
              keyExtractor={(item) => item.id}
            />
          )}

          {displayData.length < 1 && groups.length > 0 && (
            <View
              style={{
                gap: screenHeight * 0.02,
              }}
            >
              <Text style={{ textAlign: "center" }}>No farmers found</Text>
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
              <Text style={{ textAlign: "center" }}>
                No active groups found
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
    </View>
  );
};
