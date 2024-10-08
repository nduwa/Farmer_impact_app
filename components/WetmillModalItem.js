import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { colors } from "../data/colors";

export const WetmillModalItem = ({
  type,
  label,
  setIsWetmillModalOpen,
  icon,
  disabled = false,
}) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    setIsWetmillModalOpen(false);
    navigation.replace("ChooseStationScreen", { data: type });
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
        opacity: disabled ? 0.6 : 1,
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
      {icon}
      <Text style={{ fontWeight: "600", fontSize: 20 }}>{label}</Text>
    </TouchableOpacity>
  );
};
