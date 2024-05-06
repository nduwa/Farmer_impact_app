import React from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const SheetItem = ({ label, setModal, Fn }) => {
  const handleClick = () => {
    setModal(false);
    Fn();
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
      onPress={handleClick}
    >
      {label === "Take photo" && (
        <AntDesign name="camera" size={24} color="black" />
      )}

      {label === "Choose from gallery" && (
        <Fontisto name="photograph" size={24} color="black" />
      )}

      <Text style={{ fontWeight: "600", fontSize: 20 }}>{label}</Text>
    </TouchableOpacity>
  );
};
