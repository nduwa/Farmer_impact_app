import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
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
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 8,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        {name === "Register" && (
          <AntDesign name="adduser" size={35} color="black" />
        )}
        {name === "Inspection" && (
          <MaterialCommunityIcons
            name="notebook-check-outline"
            size={32}
            color="black"
          />
        )}
        {name === "Update Farmer" && (
          <FontAwesome6 name="user-pen" size={24} color="black" />
        )}
        {name === "Training" && (
          <FontAwesome5 name="chalkboard-teacher" size={28} color="black" />
        )}
        {name === "Buy Coffee" && (
          <Foundation name="burst-sale" size={38} color="black" />
        )}
        {name === "Review Purchases" && (
          <MaterialCommunityIcons
            name="note-search-outline"
            size={32}
            color="black"
          />
        )}
        {name === "CWS Finance" && (
          <FontAwesome6 name="sack-dollar" size={30} color="black" />
        )}
        {name === "Wet Mill Audit" && (
          <MaterialCommunityIcons
            name="archive-search-outline"
            size={28}
            color="black"
          />
        )}
        <Text style={{ fontWeight: "500", fontSize: 15, textAlign: "center" }}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
