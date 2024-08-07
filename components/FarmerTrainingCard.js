import React, { memo, useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import Checkbox from "expo-checkbox";

const FarmerTrainingCard = ({
  data,
  isChecked,
  setChecked,
  filterFn,
  use = null,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [selected, setSelected] = useState(isChecked);

  const handleCheck = (value) => {
    if (value) {
      setChecked((prevState) => [
        ...prevState,
        {
          farmerid: data.farmerId,
          __kf_farmer: data.__kf_farmer,
          _kf_Group: data.__kf_group,
          checked: value,
        },
      ]);
    } else {
      filterFn(data.farmerId);
    }

    setSelected(value);
  };

  return (
    <View
      style={{
        flexDirection: "row",
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
          {data.farmerName}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          ID: {data.farmerId}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Date of birth: {data.Year_Birth}
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Checkbox
          style={{
            margin: 8,
          }}
          value={selected}
          onValueChange={(value) => handleCheck(value)}
          color={isChecked ? colors.secondary : colors.blue_font}
        />
      </View>
    </View>
  );
};

export default memo(FarmerTrainingCard);
