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
  mb = 0,
  radius = 50,
  paddingRatio = 0.02,
  bdcolor = colors.primary,
  fontSizeRatio=0.055,
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
        padding: screenWidth * paddingRatio,
        borderRadius: radius,
        borderWidth: 1,
        borderColor: bdcolor,
        marginTop: mt,
        marginBottom: mb,
        width: width,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: color,
          fontWeight: "bold",
          fontSize: screenWidth * fontSizeRatio,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
