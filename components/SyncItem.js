import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";

export const SyncItem = ({ name, isDone = false }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: screenWidth * 0.04,
        paddingHorizontal: screenWidth * 0.05,
      }}
    >
      {name === "Stations" && (
        <FontAwesome6
          name="house-flag"
          size={17}
          color={colors.secondary_variant}
        />
      )}
      {name === "Groups" && (
        <MaterialIcons
          name="groups"
          size={20}
          color={colors.secondary_variant}
        />
      )}
      {name === "Farmers" && (
        <FontAwesome6
          name="people-line"
          size={16}
          color={colors.secondary_variant}
        />
      )}
      {name === "Households" && (
        <MaterialIcons
          name="other-houses"
          size={19}
          color={colors.secondary_variant}
        />
      )}
      {name === "Cells" && (
        <MaterialCommunityIcons
          name="hexagon-multiple"
          size={18}
          color={colors.secondary_variant}
        />
      )}
      {name === "Training modules" && (
        <FontAwesome5
          name="chalkboard-teacher"
          size={14}
          color={colors.secondary_variant}
        />
      )}
      {name === "Inspection questions" && (
        <MaterialCommunityIcons
          name="frequently-asked-questions"
          size={17}
          color={colors.secondary_variant}
        />
      )}
      {name === "Farmers crops" && (
        <MaterialCommunityIcons
          name="food-apple-outline"
          size={17}
          color={colors.secondary_variant}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "90%",
          borderBottomWidth: 1,
          paddingBottom: 8,
          borderBottomColor: colors.thin,
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: 15,
            color: colors.black_letter,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 9,
            backgroundColor: isDone ? colors.green_bg : colors.red_bg,
            color: "white",
            padding: 3,
            borderRadius: 8,
          }}
        >
          {isDone ? "COMPLETED" : "NOT DONE"}
        </Text>
      </View>
    </View>
  );
};
