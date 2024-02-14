import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../data/colors";

export default function CustomButton({
  onPress,
  bg,
  color,
  width,
  text,
  mt = 0,
  bdcolor = colors.primary,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        backgroundColor: disabled ? colors.white_a : bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 6,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: bdcolor,
        marginTop: mt,
        width: width,
      }}
      onPress={onPress}
    >
      <Text style={{ color: color, fontWeight: "bold", fontSize: 20 }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
