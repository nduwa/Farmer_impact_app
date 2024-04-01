import React from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";

export const ScSummaryItem = ({ header, label }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        paddingHorizontal: screenWidth * 0.03,
        gap: screenWidth * 0.03,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text style={{ fontSize: screenWidth * 0.04 }}>{header}</Text>
        <Text
          style={{
            fontSize: screenWidth * 0.04,
            fontWeight: "600",
            color: colors.secondary_variant,
          }}
        >
          {label}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: colors.secondary_variant,
        }}
      />
    </View>
  );
};
