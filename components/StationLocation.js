import React from "react";
import { Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const StationLocation = () => {
  return (
    <View
      style={{
        alignSelf: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
      }}
    >
      <Entypo name="location-pin" size={24} color="white" />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
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
