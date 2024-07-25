import React from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "./CustomButton";

const GroupAssignActivityCard = ({
  insertion_date,
  records = [],
  deleteFn = null,
  uploadFn = null,
  isActive = true,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
        gap: screenWidth * 0.02,
        backgroundColor: colors.white,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
        elevation: 4,
      }}
    >
      <Text
        style={{
          fontSize: screenWidth * 0.06,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Activity | {insertion_date}
      </Text>
      <View
        style={{
          backgroundColor: colors.secondary_variant,
          height: screenHeight * 0.002,
          width: screenWidth * 0.9,
        }}
      />
      {records.map((item) => (
        <View style={{ gap: screenHeight * 0.01 }} key={item.id}>
          <View
            style={{
              justifyContent: "center",
              marginTop: screenWidth * 0.01,
              width: "fit",
              marginLeft: screenWidth * 0.11,
            }}
          >
            <Text
              style={{
                fontSize: screenWidth * 0.045,
                fontWeight: "500",
              }}
            >
              {item.farmerid} | {item.farmer_name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: screenWidth * 0.03,
              }}
            >
              <Text
                style={{
                  fontSize: screenWidth * 0.04,
                  fontWeight: "500",
                  //   marginLeft: screenWidth * 0.2,
                  color: colors.red,
                }}
              >
                {item.group_id_old}
              </Text>
              <FontAwesome5
                name="angle-double-right"
                size={20}
                color={colors.blue_font}
              />
              <Text
                style={{
                  fontSize: screenWidth * 0.04,
                  fontWeight: "500",
                  color: colors.green,
                }}
              >
                {item.group_id_new}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.secondary,
              height: screenHeight * 0.001,
              width: screenWidth * 0.8,
              alignSelf: "center",
            }}
          />
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: screenWidth * 0.03,
          width: "100%",
        }}
      >
        <CustomButton
          bg={colors.secondary}
          color={"white"}
          width="45%"
          text="Undo"
          bdcolor="transparent"
          mt={8}
          mb={8}
          radius={7}
          paddingRatio={0.01}
          disabled={!isActive}
          fontSizeRatio={0.05}
          onPress={deleteFn}
        />
        <CustomButton
          bg={colors.blue_font}
          color={"white"}
          width="45%"
          text="Upload"
          bdcolor="transparent"
          mt={8}
          mb={8}
          radius={7}
          paddingRatio={0.01}
          disabled={!isActive}
          fontSizeRatio={0.05}
          onPress={uploadFn}
        />
      </View>
    </View>
  );
};

export default GroupAssignActivityCard;
