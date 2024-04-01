import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const ScRecordItem = ({ data }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate("ScDailySummary", { data });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
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
            fontSize: screenWidth * 0.04,
            fontWeight: "500",
            color: colors.black_letter,
          }}
        >
          Records: {data.records}
        </Text>
        <Text
          style={{
            fontSize: screenWidth * 0.04,
            fontWeight: "500",
            color: colors.black_letter,
          }}
        >
          Weight: {data.weight} Kg(s)
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="right" size={screenHeight * 0.034} color="black" />
      </View>
    </TouchableOpacity>
  );
};
