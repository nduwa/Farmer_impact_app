import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import { ScTransactionRow } from "./ScTransactionRow";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";

export const ScTransactionItem = ({
  lotnumber,
  receiptId,
  farmerId,
  farmerNames = "",
  kgsGood,
  priceGood,
  kgsBad,
  priceBad,
  trDate,
  cashTotal,
  coffeeVal,
  coffeeType,
  deleteFn,
  routeData,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const handleEdit = () => {
    let newData = { receiptId };
    navigation.replace("EditTransaction", {
      data: { ...routeData, ...newData },
    });
  };
  const handleDelete = () => {
    deleteFn({ open: true, id: receiptId });
  };

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
        {lotnumber}
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
        {`RECEIPT / ${receiptId}`}
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
        {farmerId.toUpperCase()} / {farmerNames.toUpperCase()}
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
        <ScTransactionRow header={"Kgs(good)"} data={kgsGood} />
        <ScTransactionRow header={"Price/Kg"} data={priceGood} />
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
        <ScTransactionRow header={"Floaters Kgs"} data={kgsBad} />
        <ScTransactionRow header={"Price/Kg"} data={priceBad} />
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
        <ScTransactionRow header={"Coffee Type"} data={coffeeType} />
        <ScTransactionRow
          header={"Amount Paid"}
          data={`RWF ${cashTotal.toLocaleString()}`}
        />
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
        <ScTransactionRow
          header={"Coffee Value"}
          data={`RWF ${coffeeVal.toLocaleString()}`}
        />
        <ScTransactionRow header={"Transaction Date"} data={trDate} />
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
          onPress={handleEdit}
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
          onPress={handleDelete}
        />
      </View>
    </View>
  );
};
