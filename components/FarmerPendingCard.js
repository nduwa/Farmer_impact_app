import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const FarmerPendingCard = ({ data, registrationDate }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.replace("PendingFarmerEditScreen", {
      data: { farmerData: data },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
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
          Cell: {data.cell.length > 0 ? data.cell : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Village: {data.village.length > 0 ? data.village : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Gender: {data.Gender}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Phone: {data.phone.length > 0 ? data.phone : "N/A"}
        </Text>

        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Date of birth: {data.Year_Birth}
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
        <AntDesign name="right" size={screenHeight * 0.034} color="black" />
      </View>
    </TouchableOpacity>
  );
};
