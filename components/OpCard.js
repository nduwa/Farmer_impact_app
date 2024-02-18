import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { colors } from "../data/colors";

export const OpCard = ({ name }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
        width: screenWidth * 0.28,
        height: screenWidth * 0.28,
        paddingHorizontal: 1,
        paddingVertical: screenHeight * 0.01,
        borderRadius: 20,
        ...Platform.select({
          ios: {
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          },
          android: {
            elevation: 9,
          },
        }),
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: screenWidth * 0.02,
        }}
      >
        {name === "Register" && (
          <AntDesign name="adduser" size={screenWidth * 0.09} color="black" />
        )}
        {name === "Inspection" && (
          <MaterialCommunityIcons
            name="notebook-check-outline"
            size={screenWidth * 0.09}
            color="black"
          />
        )}
        {name === "Update Farmer" && (
          <FontAwesome6
            name="user-pen"
            size={screenWidth * 0.08}
            color="black"
          />
        )}
        {name === "Training" && (
          <FontAwesome5
            name="chalkboard-teacher"
            size={screenWidth * 0.08}
            color="black"
          />
        )}
        {name === "Buy Coffee" && (
          <Foundation
            name="burst-sale"
            size={screenWidth * 0.1}
            color="black"
          />
        )}
        {name === "Review Purchases" && (
          <MaterialCommunityIcons
            name="note-search-outline"
            size={screenWidth * 0.09}
            color="black"
          />
        )}
        {name === "CWS Finance" && (
          <FontAwesome6
            name="sack-dollar"
            size={screenWidth * 0.09}
            color="black"
          />
        )}
        {name === "Wet Mill Audit" && (
          <MaterialCommunityIcons
            name="archive-search-outline"
            size={screenWidth * 0.09}
            color="black"
          />
        )}
        <Text
          style={{
            fontWeight: "500",
            fontSize: screenWidth * 0.041,
            textAlign: "center",
          }}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
