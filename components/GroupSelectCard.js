import React, { memo, useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import Checkbox from "expo-checkbox";

const GroupSelectCard = ({
  data,
  isChecked,
  setChecked,
  filterFn,
  use = null,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [selected, setSelected] = useState(isChecked);

  const shortenStr = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  const handleCheck = (value) => {
    if (value) {
      setChecked((prevState) => [
        ...prevState,
        {
          ...data,
          checked: value,
        },
      ]);
    } else {
      filterFn(data.__kp_Group);
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
          {data?.ID_GROUP.length > 0 ? data.ID_GROUP : "[NO GROUP ID]"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Name: {data?.Name.length > 0 ? shortenStr(data.Name, 18) : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Location: {data?.Area_Medium.length > 0 ? data.Area_Medium : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Started:{" "}
          {data?.Year_Started_Program.length > 0
            ? data.Year_Started_Program
            : "N/A"}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: screenWidth * 0.035,
            fontWeight: "700",
            color: colors.secondary,
          }}
        >
          {use === "deactivate" ? "De-activate?" : "Activate?"}
        </Text>
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

export default memo(GroupSelectCard);
