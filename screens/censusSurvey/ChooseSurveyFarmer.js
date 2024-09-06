import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
import {
  Dimensions,
  FlatList,
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
import { GroupsModal } from "../../components/GroupsModal";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { FarmerUpdateCard } from "../../components/FarmerUpdateCard";

export const ChooseSurveyFarmerScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [groups, setGroups] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingFarmerUpdates, setPendingFarmerUpdates] = useState([]);

  const navigation = useNavigation();

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

  const checkPending = (farmerid) => {
    if (pendingFarmerUpdates.length == 0) return null;

    for (const farmer of pendingFarmerUpdates) {
      if (farmer.farmer_ID === farmerid) return true;
    }
  };

  useEffect(() => {
    if (groups.length > 0) {
      setActiveGroup(groups[0]);
    }
  }, [groups.length]);

  useEffect(() => {
    if (activeGroup.id) {
      retrieveDBdata({
        tableName: "farmers",
        setData: setFarmers,
        queryArg: `SELECT farmer.*,household.* FROM rtc_farmers AS farmer INNER JOIN rtc_households AS household ON farmer._kf_Household = household.__kp_Household WHERE farmer.deleted = 0 AND household._kf_Group='${activeGroup.__kp_Group}'`,
      });
    }
  }, [activeGroup]);

  const displayData = searchResults.length > 0 ? searchResults : farmers;

  useEffect(() => {
    const fetchFarmers = () => {
      retrieveDBdata({
        tableName: "farmers",
        setData: setFarmers,
        queryArg: `SELECT farmer.*,household.* FROM rtc_farmers AS farmer INNER JOIN rtc_households AS household ON farmer._kf_Household = household.__kp_Household WHERE farmer.deleted = 0 AND farmer.sync = 1 AND household._kf_Group='${selectedGroup.__kp_Group}'`,
      });
    };

    if (selectedGroup) {
      setActiveGroup(selectedGroup);
      fetchFarmers();
    }
  }, [selectedGroup]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const stationId = await SecureStore.getItemAsync("rtc-station-id");

        if (stationId) {
          retrieveDBdata({
            tableName: "rtc_groups",
            stationId,
            setData: setGroups,
            queryArg: `SELECT * FROM rtc_groups WHERE _kf_Station='${stationId}' AND active = "1"`,
          });
        }
      };

      const fetchPendings = async () => {
        retrieveDBdata({
          tableName: "tmp_farmer_updates",
          setData: setPendingFarmerUpdates,
          queryArg: "SELECT * FROM tmp_farmer_updates WHERE uploaded = 0",
        });
      };

      fetchPendings();
      fetchData();

      return () => {
        setFarmers([]);
        setGroups([]);
        setSelectedGroup(null);
        setSearchResults([]);
        setGroupsModalOpen(false);
        setActiveGroup([]);
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
          Choose Farmer
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
              marginVertical: screenHeight * 0.018,
              paddingHorizontal: screenWidth * 0.018,
              paddingVertical: screenWidth * 0.02,
              borderRadius: 15,
              width: "77%",
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
                    placeholder="Search by name, id, etc"
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
          {displayData.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                padding: 5,
                gap: 15,
              }}
              initialNumToRender={12}
              data={displayData}
              renderItem={({ item }) => (
                <FarmerUpdateCard
                  data={{ ...item, ...{ farmerGroupID: activeGroup.ID_GROUP } }}
                  destination={"CensusSurveyScreen"}
                  pending={checkPending(item.farmerid)}
                />
              )}
              keyExtractor={(item, index) => index}
            />
          ) : (
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
        </View>
      </View>
    </View>
  );
};
