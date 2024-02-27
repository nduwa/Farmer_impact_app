import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";

export const SyncButton = ({ label, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        alignSelf: "center",
        paddingVertical: 5,
        paddingHorizontal: 18,
        backgroundColor: disabled ? colors.bg_variant : colors.secondary,
        borderRadius: 20,
        width: "50%",
      }}
    >
      <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
