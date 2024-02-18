import React from "react";
import { Dimensions, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const StationLocation = () => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        alignSelf: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        padding: screenWidth * 0.03,
      }}
    >
      <Entypo name="location-pin" size={screenWidth * 0.07} color="white" />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: screenWidth * 0.05,
          color: "white",
          textShadowColor: colors.black,
          textShadowOffset: { width: 0, height: 2.5 },
          textShadowRadius: 5,
        }}
      >
        Gakenke, Station 7
      </Text>
    </View>
  );
};
