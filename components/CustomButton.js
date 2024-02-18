import { View, Text, TouchableOpacity, Dimensions } from "react-native";
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
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        backgroundColor: disabled ? colors.white_a : bg,
        justifyContent: "center",
        alignItems: "center",
        padding: screenWidth * 0.02,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: bdcolor,
        marginTop: mt,
        width: width,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: color,
          fontWeight: "bold",
          fontSize: screenWidth * 0.055,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
