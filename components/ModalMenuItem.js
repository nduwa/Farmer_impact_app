import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { colors } from "../data/colors";
import { useTranslation } from "react-i18next";

export const ModalMenuItem = ({
  destination,
  label,
  setIsModalOpen,
  isActive = true,
  icon = null,
}) => {
  const navigation = useNavigation();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { t } = useTranslation();

  const handleNavigation = () => {
    setIsModalOpen(false);
    navigation.navigate(destination);
  };

  return (
    <TouchableOpacity
      disabled={!isActive}
      style={{
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
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
      {icon && icon}

      <Text style={{ fontWeight: "600", fontSize: 20, textAlign: "left" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
