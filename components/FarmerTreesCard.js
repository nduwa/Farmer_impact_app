import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const FarmerTreesCard = ({ data, registrationDate, active = true }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.replace("EditTreesScreen", {
      data: { farmerData: data },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      disabled={!active}
      style={{
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: colors.white_variant,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
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
          Received Seedling: {data.received_seedling}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Survived Seedling: {data.survived_seedling}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Old trees: {data.old_trees}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Plots/Farms: {data.coffee_plot}
        </Text>

        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Shade Trees: {data.shade_trees}
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
        {active && (
          <AntDesign name="right" size={screenHeight * 0.034} color="black" />
        )}
      </View>
    </TouchableOpacity>
  );
};
