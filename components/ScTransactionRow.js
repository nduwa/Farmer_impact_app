import React from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";

export const ScTransactionRow = ({ header, data }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        gap: screenWidth * 0.018,
      }}
    >
      <Text style={{ fontSize: screenWidth * 0.04, fontWeight: "500" }}>
        {header}
      </Text>
      <Text
        style={{
          padding: screenWidth * 0.015,
          borderWidth: 0.3,
          borderColor: colors.black_a,
          backgroundColor: "white",
          fontSize: screenWidth * 0.04,
          fontWeight: "500",
          borderRadius: 5,
          width: screenWidth * 0.34,
        }}
      >
        {data}
      </Text>
    </View>
  );
};
