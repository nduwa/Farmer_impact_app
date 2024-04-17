import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { FontAwesome6 } from "@expo/vector-icons";

export const InspectionRecordItems = ({ data, deleteFn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: colors.white,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
        elevation: 3,
      }}
    >
      <View style={{ gap: screenHeight * 0.008 }}>
        <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
          {data.date}
        </Text>
        <Text
          style={{
            fontSize: screenWidth * 0.035,
            fontWeight: "500",
            color: colors.black_letter,
          }}
        >
          {data.type}
        </Text>
        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
          <Text
            style={{
              fontSize: screenWidth * 0.035,
              fontWeight: "500",
              color: colors.black_letter,
            }}
          >
            Household:
          </Text>
          <Text
            style={{
              fontSize: screenWidth * 0.03,
              fontWeight: "500",
              color: colors.black_letter,
            }}
          >
            {" "}
            {data.householdid}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={deleteFn}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome6 name="trash" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};
