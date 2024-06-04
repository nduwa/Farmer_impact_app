import React, { useEffect } from "react";
import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";

export const HouseholdCard = ({ setHouseholdChoice, data, setModalOpen }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleClick = () => {
    setHouseholdChoice(data.__kp_Household);
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.white_variant,
        padding: screenWidth * 0.02,
        borderRadius: 10,
        marginBottom: screenHeight * 0.009,
        elevation: 3,
      }}
    >
      <Text
        style={{
          fontSize: screenHeight * 0.02,
          fontWeight: "500",
        }}
      >
        {`[${data.householdid}] > ${data.z_Farmer_Primary}`}
      </Text>
      <AntDesign name="right" size={screenHeight * 0.02} color="black" />
    </TouchableOpacity>
  );
};
