import React from "react";
import { colors } from "../data/colors";
import { Dimensions, Text, TextInput, View } from "react-native";

export const BuyCoffeeInput = ({
  handleChange,
  handleBlur,
  value,
  label,
  error = false,
  active = true,
  radius = 10,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flexDirection: "column",
        gap: screenHeight * 0.01,
      }}
    >
      <Text
        style={{
          fontWeight: "400",
          fontSize: screenWidth * 0.04,
          color: colors.black,
          marginLeft: screenWidth * 0.02,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.black_a}
        onChangeText={handleChange}
        onBlur={handleBlur}
        value={value}
        editable={active}
        style={{
          borderColor: error ? "red" : colors.bg_variant_font,
          backgroundColor: colors.white_variant,
          borderWidth: error ? 1 : 0.3,
          borderRadius: radius,
          padding: 7,
          fontWeight: "500",
          fontSize: screenWidth * 0.05,
          color: colors.blue_font,
        }}
      />
    </View>
  );
};
