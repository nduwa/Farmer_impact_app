import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import CustomButton from "./CustomButton";
import { AntDesign } from "@expo/vector-icons";

export const InspectionModal = ({
  data,
  DeleteFn,
  UploadFn,
  CloseFn,
  active = true,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleDelete = () => {
    DeleteFn(data.inspection_id);
  };

  const handleDate = (date) => {
    const currentDate = new Date(date);
    const twoDigitYear = currentDate.getFullYear().toString().slice(-2);
    const twoDigitMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const twoDigitDay = ("0" + currentDate.getDate()).slice(-2);

    return `${twoDigitDay}/${twoDigitMonth}/20${twoDigitYear}`;
  };

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
          width: "83%",
          height: "36%",
          alignItems: "center",
          gap: screenHeight * 0.02,
          borderRadius: 15,
          backgroundColor: colors.white,
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={CloseFn}
          style={{
            position: "absolute",
            top: -screenHeight * 0.015,
            left: screenWidth * 0.74,
            backgroundColor: colors.white,
            borderRadius: 100,
            padding: screenHeight * 0.004,
            elevation: 4,
          }}
        >
          <AntDesign
            name="closecircleo"
            size={screenHeight * 0.035}
            color="black"
          />
        </TouchableOpacity>
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
              width: screenWidth * 0.7,
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
            {`${data.inspectionData._kf_Household}`}
          </Text>

          <View
            style={{
              backgroundColor: colors.secondary_variant,
              height: screenHeight * 0.001,
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
            {`TYPE / ${data.inspectionData.Score_n.toUpperCase()}`}
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary_variant,
              height: screenHeight * 0.001,
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
            {`DATE / ${handleDate(data.inspectionData.inspection_at)}`}
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary_variant,
              height: screenHeight * 0.001,
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
            {`STATUS / NOT UPLOADED`}
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
            marginTop: screenHeight * 0.01,
          }}
        >
          <CustomButton
            bg={colors.secondary}
            color={"white"}
            width="45%"
            text="Delete"
            bdcolor="transparent"
            mt={8}
            mb={8}
            radius={7}
            paddingRatio={0.01}
            disabled={!active}
            fontSizeRatio={0.04}
            onPress={handleDelete}
          />
          <CustomButton
            bg={colors.black}
            color={"white"}
            width="45%"
            text="Upload"
            bdcolor="transparent"
            mt={8}
            mb={8}
            radius={7}
            paddingRatio={0.01}
            disabled={!active}
            fontSizeRatio={0.04}
            onPress={UploadFn}
          />
        </View>
      </View>
    </View>
  );
};
