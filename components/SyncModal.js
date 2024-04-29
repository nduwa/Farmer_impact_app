import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";

export const SyncModal = ({
  label,
  onYes,
  OnNo,
  labelYes = "Ok",
  labelNo = "Cancel",
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 10,
        backgroundColor: colors.black_a,
        zIndex: 11,
      }}
    >
      <View
        style={{
          width: "70%",
          height: screenHeight * 0.19,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
          backgroundColor: colors.white,
          padding: 10,
        }}
      >
        <Text>{label}</Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: screenHeight * 0.02,
            gap: screenWidth * 0.06,
          }}
        >
          <TouchableOpacity
            onPress={onYes}
            style={{
              paddingVertical: 2,
              paddingHorizontal: 18,
              backgroundColor: colors.secondary,
              borderRadius: 3,
            }}
          >
            <Text style={{ color: "white", fontSize: 14 }}>{labelYes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={OnNo}
            style={{
              paddingVertical: 2,
              paddingHorizontal: 18,
              backgroundColor: colors.secondary,
              borderRadius: 3,
            }}
          >
            <Text style={{ color: "white", fontSize: 14 }}>{labelNo}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
