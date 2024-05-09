import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const SheetItem = ({ label, setModal, supportedVersion = true, Fn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleClick = () => {
    setModal(false);
    Fn();
  };

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: 20,
          backgroundColor: colors.white,
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 12,
          opacity: supportedVersion ? 1 : 0.65,
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
      {label === "Take photo" && !supportedVersion && (
        <View
          style={{
            position: "absolute",
            backgroundColor: colors.white,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            top: -screenWidth * 0.05,
            left: screenWidth * 0.77,
            width: screenHeight * 0.043,
            height: screenHeight * 0.043,
            elevation: 4,
          }}
        >
          <Foundation
            name="info"
            size={screenHeight * 0.04}
            color={colors.secondary}
            style={{ alignSelf: "center" }}
          />
        </View>
      )}
    </>
  );
};
