import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "../data/colors";

export const SyncItem = ({ name, isDone = false }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "95%",
        justifyContent: "flex-start",
        gap: 20,
        paddingHorizontal: 10,
      }}
    >
      <FontAwesome6
        name="house-flag"
        size={20}
        color={colors.secondary_variant}
      />
      <View
        style={{
          flexDirection: "row",
          width: "92%",
          justifyContent: "space-between",
          alignItems: "center",
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
        {isDone ? (
          <Text
            style={{
              fontSize: 9,
              backgroundColor: colors.green_bg,
              color: "white",
              padding: 3,
              borderRadius: 8,
            }}
          >
            COMPLETED
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 9,
              backgroundColor: colors.red_bg,
              color: "white",
              padding: 3,
              borderRadius: 8,
            }}
          >
            NOT DONE
          </Text>
        )}
      </View>
    </View>
  );
};
