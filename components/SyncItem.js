import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";

export const SyncItem = ({
  name,
  isDone = false,
  setRestartTable = null,
  tableIndex = null,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  handleRestart = (table) => {
    if (setRestartTable) {
      setRestartTable({
        open: true,
        table,
      });
    }
  };
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
      {name === "Suppliers" && (
        <MaterialCommunityIcons
          name="truck"
          size={17}
          color={colors.secondary_variant}
        />
      )}
      {name === "Seasons" && (
        <FontAwesome
          name="calendar"
          size={17}
          color={colors.secondary_variant}
        />
      )}
      {name === "Inspection answers" && (
        <MaterialCommunityIcons
          name="book-open-page-variant"
          size={17}
          color={colors.secondary_variant}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "93%",
          borderBottomWidth: 1,
          paddingBottom: screenHeight * 0.018,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: screenWidth * 0.04,
          }}
        >
          <TouchableOpacity
            onPress={() => handleRestart(tableIndex)}
            style={{
              backgroundColor: colors.white_variant,
              borderRadius: screenWidth * 0.05,
              padding: screenWidth * 0.0065,
              elevation: 3,
            }}
          >
            <Ionicons name="reload" size={screenWidth * 0.05} color="black" />
          </TouchableOpacity>
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
    </View>
  );
};
