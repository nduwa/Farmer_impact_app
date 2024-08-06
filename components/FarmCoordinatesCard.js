import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import SimpleIconButton from "./SimpleIconButton";

export const FarmCoordinatesCard = ({
  data,
  registrationDate,
  active = true,
  deleteFn = null,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const farmTypes = [
    { id: 1, name: "Banana Plantation", id: 1 },
    { id: 2, name: "Coffee", id: 2 },
    { id: 3, name: "Diverse food crop", id: 3 },
    { id: 4, name: "Forest", id: 4 },
  ];

  const handleFarmType = (id) => {
    let foundItem = farmTypes.find((item) => item.id === id);

    return foundItem.name;
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: colors.white_variant,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
        gap: screenHeight * 0.03,
        elevation: 3,
      }}
    >
      <View style={{ gap: screenHeight * 0.008 }}>
        <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
          {data.farmer_name}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Farmer ID: {data.farmer_ID}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Farm Unit Area (ha): {data.farm_unit_area}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Farm Crop Name: {handleFarmType(data.cropNameId) || "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Soil Slope: {data.soil_slope}
        </Text>

        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Latitude: {data.latitude}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Longitude: {data.longitude}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Pending since: {registrationDate}
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SimpleIconButton
          label={"Delete"}
          width="90%"
          active={active}
          handlePress={deleteFn}
          icon={<Ionicons name="trash" size={24} color="white" />}
        />
      </View>
    </View>
  );
};
