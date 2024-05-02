import React from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import { useNavigation } from "@react-navigation/native";

export const InspectionHistoryCard = ({ data }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: "100%",
        // height: screenHeight * 0.36,
        alignItems: "center",
        gap: screenHeight * 0.02,
        borderRadius: 15,
        backgroundColor: colors.white,
        padding: 10,
        elevation: 3,
      }}
    >
      <View
        style={{
          alignItems: "center",
          gap: screenHeight * 0.01,
        }}
      >
        <Text
          style={{
            fontSize: screenWidth * 0.05,
            fontWeight: "600",
          }}
        >
          Inspection
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.002,
            width: screenWidth * 0.8,
          }}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.035,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`${data.householdId}`}
        </Text>

        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.7,
          }}
        />
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`TYPE / ${data.insp_type.toUpperCase()}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.7,
          }}
        />
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`DATE / ${data.date}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.7,
          }}
        />
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`STATUS / UPLOADED`}
        </Text>
      </View>
    </View>
  );
};
