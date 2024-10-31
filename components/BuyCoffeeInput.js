import React from "react";
import { colors } from "../data/colors";
import { Dimensions, Text, TextInput, View } from "react-native";
import SimpleIconButton from "./SimpleIconButton";
import { MaterialIcons } from "@expo/vector-icons";

export const BuyCoffeeInput = ({
  handleChange,
  handleBlur,
  value,
  label,
  error = false,
  active = true,
  multiline = false,
  radius = 10,
  keyboardType = null,
  font_sm = 0.03,
  font_lg = 0.05,
  weirdMode = false,
  weirdModeBtnLabel,
  weirdModePressFn,
  weirdModeBtnIcon = null,
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
          opacity: active ? 1 : 0.8,
        }}
      >
        {label}
      </Text>
      {weirdMode ? (
        <View
          style={{
            flexDirection: "column",
            gap: screenHeight * 0.008,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SimpleIconButton
            label={weirdModeBtnLabel}
            width="100%"
            bdRadiusRatio={0.008}
            color={colors.black}
            labelColor="white"
            active={true}
            handlePress={weirdModePressFn}
            icon={weirdModeBtnIcon}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: screenHeight * 0.004,
            }}
          >
            <MaterialIcons
              name="error"
              size={screenHeight * 0.025}
              color={colors.black_letter}
            />
            <Text
              style={{
                fontWeight: "600",
                color: colors.black_letter,
                fontSize: screenWidth * 0.029,
              }}
            >
              Requires internet connectivity
            </Text>
          </View>
        </View>
      ) : (
        <TextInput
          placeholderTextColor={colors.black_a}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={value}
          editable={active}
          multiline={multiline}
          keyboardType={keyboardType || "default"}
          style={{
            borderColor: error ? "red" : colors.bg_variant_font,
            backgroundColor: active ? colors.white_variant : colors.white_a,
            borderWidth: error || !active ? 1 : 0.3,
            borderRadius: radius,
            padding: 7,
            fontWeight: "500",
            fontSize:
              value?.length > 30
                ? screenWidth * font_sm
                : screenWidth * font_lg,
            color: colors.blue_font,
            textAlign: "left",
            opacity: active ? 1 : 0.8,
          }}
        />
      )}
    </View>
  );
};
