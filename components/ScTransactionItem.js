import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import { ScTransactionRow } from "./ScTransactionRow";
import CustomButton from "./CustomButton";

export const ScTransactionItem = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const handleSubmit = () => {};

  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: screenWidth * 0.035,
        width: "100%",
        minHeight: screenHeight * 0.09,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
      }}
    >
      <Text
        style={{
          fontSize: screenWidth * 0.045,
          fontWeight: "600",
          textAlign: "center",
          marginBottom: screenHeight * 0.015,
        }}
      >
        FTR2419582610
      </Text>
      <View
        style={{
          width: "90%",
          height: 1,
          backgroundColor: colors.secondary_variant,
        }}
      />
      <Text
        style={{
          fontWeight: "600",
          textAlign: "center",
          fontSize: screenWidth * 0.045,
          marginVertical: screenHeight * 0.006,
        }}
      >
        1004645
      </Text>
      <View
        style={{
          width: "90%",
          height: 1,
          backgroundColor: colors.secondary_variant,
        }}
      />
      <Text
        style={{
          fontWeight: "600",
          textAlign: "center",
          fontSize: screenWidth * 0.045,
          marginVertical: screenHeight * 0.006,
        }}
      >
        F40746A / KARAKE ERIC
      </Text>
      <View
        style={{
          width: "90%",
          height: 1,
          backgroundColor: colors.secondary_variant,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: screenWidth * 0.05,
          marginTop: screenHeight * 0.01,
        }}
      >
        <ScTransactionRow header={"Kgs(good)"} data={58} />
        <ScTransactionRow header={"Price/Kg"} data={120} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: screenWidth * 0.05,
          marginTop: screenHeight * 0.01,
        }}
      >
        <ScTransactionRow header={"Floaters Kgs"} data={23} />
        <ScTransactionRow header={"Price/Kg"} data={15} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: screenWidth * 0.05,
          marginTop: screenHeight * 0.01,
        }}
      >
        <ScTransactionRow header={"Coffee Type"} data={23} />
        <ScTransactionRow header={"Amount Paid"} data={7305.0} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: screenWidth * 0.05,
          marginTop: screenHeight * 0.01,
        }}
      >
        <ScTransactionRow header={"Coffee Value"} data={6960} />
        <ScTransactionRow header={"Transaction Date"} data={"19/02/2024"} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: screenWidth * 0.05,
          marginTop: screenHeight * 0.01,
        }}
      >
        <CustomButton
          bg={colors.black}
          color={"white"}
          width="45%"
          text="Edit"
          bdcolor="transparent"
          mt={8}
          mb={8}
          radius={7}
          paddingRatio={0.01}
          disabled={indicatorVisible}
          onPress={handleSubmit}
        />
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
          disabled={indicatorVisible}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};
