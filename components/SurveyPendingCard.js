import React from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleIconButton from "./SimpleIconButton";

export const SurveyPendingCard = ({ data, surveyDate, uploadFn, deleteFn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleStr = (str) => {
    if (str === "not applicable") {
      return "[UNREGISTERED FARMER]";
    } else return str;
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: colors.white_variant,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
        elevation: 3,
      }}
    >
      <View style={{ gap: screenHeight * 0.008 }}>
        <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
          SURVEY |{" "}
          {data.farmer_ID
            ? handleStr(data.farmer_ID)
            : handleStr(data.farmer_name)}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Names: {data.farmer_name.length > 0 ? data.farmer_name : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Group: {data.group_id.length > 0 ? data.group_id : "N/A"}
        </Text>

        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Phone: {data.phone.length > 0 ? data.phone : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Pending since: {surveyDate}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: screenWidth * 0.05,
          width: "100%",
          marginTop: screenHeight * 0.025,
        }}
      >
        <SimpleIconButton
          handlePress={() => deleteFn(data.id, data.filepath)}
          label={"Delete"}
          icon={<Ionicons name="trash" size={24} color="white" />}
        />
        <SimpleIconButton
          handlePress={() => uploadFn(data.filepath)}
          label={"Upload"}
          color={colors.blue_font}
          icon={<Ionicons name="cloud-upload" size={24} color="white" />}
        />
      </View>
    </View>
  );
};
