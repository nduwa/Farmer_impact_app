import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../data/colors";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { HouseholdCard } from "./HouseholdCard";
import { Formik } from "formik";

export const HouseholdModal = ({
  setModalOpen,
  data,
  setHouseholdChoice,
  heightRatio = 0.8,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [selectedHouseholdID, setSelectedHouseholdID] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (text) => {
    if (text !== "") {
      text = text.toLowerCase();
      const results = data.filter((item) => {
        return Object.values(item).some((value) => {
          return String(value).toLowerCase().includes(text);
        });
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleHouseholdSelection = () => {
    setFetching(true);
    for (const household of data) {
      if (household.__kp_Household === selectedHouseholdID) {
        setHouseholdChoice(household);
        setModalOpen(false);
      }
    }
  };
  const handleClick = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (selectedHouseholdID) handleHouseholdSelection();
  }, [selectedHouseholdID]);

  const displayData = searchResults.length > 0 ? searchResults : data;

  return (
    <View
      style={{
        flexGrow: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.black_a,
        zIndex: 10,
        pointerEvents: fetching ? "none" : "auto",
      }}
    >
      <View
        style={{
          backgroundColor: colors.white,
          height: screenHeight * heightRatio,
          width: screenWidth * 0.95,
          borderRadius: screenWidth * 0.04,
          paddingHorizontal: screenWidth * 0.01,
          paddingVertical: screenHeight * 0.02,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: screenWidth * 0.055,
              fontWeight: "600",
              marginLeft: screenWidth * 0.03,
            }}
          >
            Households
          </Text>
          <TouchableOpacity onPress={handleClick}>
            <Ionicons
              name="close-circle-sharp"
              size={screenWidth * 0.08}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: colors.white_variant,
            marginVertical: screenHeight * 0.01,
            paddingHorizontal: screenWidth * 0.018,
            paddingVertical: screenWidth * 0.002,
            borderRadius: 5,
            width: "90%",
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

        <FlatList
          style={{
            width: "100%",
            marginTop: screenHeight * 0.015,
          }}
          initialNumToRender={15}
          contentContainerStyle={{
            marginBottom: 25,
            padding: screenWidth * 0.03,
          }}
          data={displayData}
          renderItem={({ item }) => (
            <HouseholdCard
              setHouseholdChoice={setSelectedHouseholdID}
              HouseholdID={item.householdid}
              HouseholdName={`${item.z_Farmer_Primary}` || null}
              householdKpID={item.__kp_Household}
              setModalOpen={setModalOpen}
              data={item}
            />
          )}
          keyExtractor={(item) => item.__kp_Household}
        />
      </View>
    </View>
  );
};
