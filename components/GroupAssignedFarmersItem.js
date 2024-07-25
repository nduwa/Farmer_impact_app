import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";

export const GroupAssignedFarmersItem = ({ date, records, handlePress }) => {
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
        elevation: 4,
      }}
    >
      <View style={{ gap: screenHeight * 0.008 }}>
        <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
          Activities | {date}
        </Text>
        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
          <Text
            style={{
              fontSize: screenWidth * 0.035,
              fontWeight: "500",
              color: colors.black_letter,
            }}
          >
            Records:
          </Text>
          <Text
            style={{
              fontSize: screenWidth * 0.03,
              fontWeight: "500",
              color: colors.black_letter,
            }}
          >
            {" "}
            {records}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="right" size={screenHeight * 0.034} color="black" />
      </TouchableOpacity>
    </View>
  );
};
