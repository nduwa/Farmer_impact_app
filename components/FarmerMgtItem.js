import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { colors } from "../data/colors";

export const FarmerMgtItem = ({ destination, label, setIsFarmerModalOpen }) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    setIsFarmerModalOpen(false);
    navigation.navigate(destination);
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        gap: 20,
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
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
      {label === "Farmer GPS" && (
        <MaterialCommunityIcons name="crosshairs-gps" size={24} color="black" />
      )}
      {label === "Update Trees" && (
        <Foundation name="trees" size={24} color="black" />
      )}
      {label === "Weekly Reports" && (
        <AntDesign name="barchart" size={24} color="black" />
      )}

      <Text style={{ fontWeight: "600", fontSize: 20 }}>{label}</Text>
    </TouchableOpacity>
  );
};