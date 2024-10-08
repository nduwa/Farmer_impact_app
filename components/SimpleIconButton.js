import React from "react";
import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";

const SimpleIconButton = ({
  label,
  handlePress,
  width = "45%",
  active = true,
  selected = false,
  color = colors.secondary,
  labelColor = "white",
  mv = 0,
  bdRadiusRatio = 0.045,
  icon = null,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <TouchableOpacity
      disabled={!active}
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: screenWidth * 0.03,
        backgroundColor: color,
        height: screenHeight * 0.045,
        borderRadius: screenHeight * bdRadiusRatio,
        borderLeftWidth: screenWidth * 0.03,
        borderRightWidth: screenWidth * 0.03,
        borderLeftColor: selected ? "white" : "transparent",
        borderRightColor: selected ? "white" : "transparent",
        marginVertical: mv,
        width,
        elevation: 3,
        opacity: active ? 1 : 0.4,
      }}
    >
      {icon && icon}

      <Text
        style={{
          fontSize: screenHeight * 0.023,
          fontWeight: "600",
          color: labelColor,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SimpleIconButton;
