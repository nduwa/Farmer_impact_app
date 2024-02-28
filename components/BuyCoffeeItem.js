import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const BuyCoffeeItem = ({ destination, label }) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
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
      {label === "Registered ATP Farmer" && (
        <Feather name="save" size={24} color="black" />
      )}

      {label === "Unregistered ATP Farmer" && (
        <MaterialCommunityIcons
          name="content-save-alert"
          size={24}
          color="black"
        />
      )}

      <Text style={{ fontWeight: "600", fontSize: 20 }}>{label}</Text>
    </TouchableOpacity>
  );
};
