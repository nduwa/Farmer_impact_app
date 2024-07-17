import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const FarmerMgtItem = ({
  destination,
  label,
  setIsFarmerModalOpen,
  isActive = true,
}) => {
  const navigation = useNavigation();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleNavigation = () => {
    setIsFarmerModalOpen(false);
    navigation.navigate(destination);
  };

  return (
    <TouchableOpacity
      disabled={!isActive}
      style={{
        flexDirection: "row",
        gap: screenWidth * 0.02,
        backgroundColor: colors.white,
        paddingVertical: screenHeight * 0.01,
        paddingHorizontal: screenHeight * 0.018,
        borderRadius: 12,
        opacity: isActive ? 1 : 0.5,
        ...Platform.select({
          ios: {
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
      }}
      onPress={handleNavigation}
    >
      {label === "New Farmer" && (
        <Feather name="save" size={24} color="black" />
      )}

      {label === "Remove Farmers" && (
        <MaterialCommunityIcons
          name="delete-forever-outline"
          size={24}
          color="black"
        />
      )}
      {label === "Groups" && (
        <FontAwesome6 name="people-group" size={24} color="black" />
      )}
      {label === "Update Trees" && (
        <Foundation name="trees" size={24} color="black" />
      )}
      {label === "Weekly Reports" && (
        <AntDesign name="barchart" size={24} color="black" />
      )}

      <Text style={{ fontWeight: "600", fontSize: 20, textAlign: "left" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
