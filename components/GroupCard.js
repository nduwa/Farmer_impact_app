import React from "react";
import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";

export const GroupCard = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.white_variant,
        padding: screenWidth * 0.015,
        borderRadius: 10,
        marginBottom: screenHeight * 0.009,
        elevation: 3,
      }}
    >
      <Text
        style={{
          fontSize: screenHeight * 0.03,
        }}
      >
        Group 1
      </Text>
      <AntDesign name="right" size={screenHeight * 0.02} color="black" />
    </TouchableOpacity>
  );
};
