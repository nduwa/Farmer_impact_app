import React from "react";
import { colors } from "../data/colors";
import { Dimensions, Text, TextInput, View } from "react-native";

export const BuyCoffeeInput = ({ handleChange, handleBlur, values, label }) => {
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
          color: colors.bg_variant_font,
          marginLeft: screenWidth * 0.02,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.black_a}
        onChangeText={handleChange}
        onBlur={handleBlur}
        value={values.uname}
        style={{
          borderColor: colors.bg_variant_font,
          backgroundColor: "white",
          borderWidth: 0.3,
          borderRadius: 10,
          padding: 7,
          fontWeight: "700",
          fontSize: screenWidth * 0.05,
          color: colors.blue_font,
        }}
      />
    </View>
  );
};
