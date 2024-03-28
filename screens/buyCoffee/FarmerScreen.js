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
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";
import { FarmerCard } from "../../components/FarmerCard";
import { GroupsModal } from "../../components/GroupsModal";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";

export const FarmerScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [groups, setGroups] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const navigation = useNavigation();

  const handleSearch = (text) => {
    if (text !== "") {
      const results = farmers.filter((item) =>
        item.Name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      console.log("hehe");
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
    if (groups.length > 0) {
      setActiveGroup(groups[0]);
    }
  }, [groups.length]);

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

  const displayData = searchResults.length > 0 ? searchResults : farmers;

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
  }, []);

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
            padding: 5,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
            marginLeft: screenWidth * 0.12,
          }}
        >
          Registered ATP Farmer
        </Text>
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
              marginVertical: 12,
              paddingHorizontal: 12,
              paddingVertical: 4,
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
                  <AntDesign name="search1" size={24} color={colors.black_a} />

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
                    <Feather name="x" size={24} color={colors.black_a} />
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
          {farmers.length > 0 ? (
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
          ) : (
            <Text style={{ textAlign: "center" }}>No farmers found</Text>
          )}
        </View>
      </View>
    </View>
  );
};
