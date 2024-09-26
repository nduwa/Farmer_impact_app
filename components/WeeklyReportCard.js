import React from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleIconButton from "./SimpleIconButton";

export const WeeklyReportCard = ({ data, DeleteFn, EditFn, active = true }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const formarDate = (str = "") => {
    return str.split(" ")[0];
  };
  return (
    <View
      style={{
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: screenHeight * 0.01,
        backgroundColor: colors.white,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
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
          Report | {formarDate(data.createdAt)}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.002,
            width: screenWidth * 0.7,
          }}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`Trained / ${data.trained_number}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.0015,
            width: screenWidth * 0.6,
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
          {`Men attendance / ${data.men_attended}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.0015,
            width: screenWidth * 0.6,
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
          {`Women attendance / ${data.women_attended}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.6,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: screenWidth * 0.03,
          width: "100%",
          paddingHorizontal: screenWidth * 0.05,
          marginVertical: screenHeight * 0.015,
        }}
      >
        <SimpleIconButton
          labelColor="white"
          color={colors.secondary}
          label={"Delete"}
          icon={<Feather name="trash-2" size={24} color="white" />}
          handlePress={DeleteFn}
          width="45%"
          active={active}
        />
        <SimpleIconButton
          labelColor="white"
          color={colors.blue_font}
          label={"Edit"}
          icon={<AntDesign name="edit" size={24} color="white" />}
          handlePress={EditFn}
          width="45%"
          active={active}
        />
      </View>
    </View>
  );
};
