import React from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const SideNav = ({ name, isLogOut = false, isActive = false }) => {
  const giveColor = () => {
    if (isLogOut) return "white";
    if (isActive) return colors.secondary;
  };
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        padding: 8,
        backgroundColor: isLogOut ? colors.secondary : colors.white,
        borderRadius: 10,
        borderRightWidth: 9,
        borderRightColor: isActive ? colors.secondary : "transparent",
        ...Platform.select({
          ios: {
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          },
          android: {
            elevation: 7,
          },
        }),
      }}
    >
      {name === "Sync Data" && (
        <FontAwesome5
          name="sync"
          size={20}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Farms" && (
        <Feather
          name="map"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Registrations" && (
        <AntDesign
          name="addusergroup"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Inspections" && (
        <Foundation
          name="page-search"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Children" && (
        <Feather
          name="users"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Training" && (
        <Ionicons
          name="school-outline"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "SC Daily Journals" && (
        <Ionicons
          name="journal-outline"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "CWS Finance" && (
        <MaterialCommunityIcons
          name="finance"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "History" && (
        <Entypo
          name="back-in-time"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Change Settings" && (
        <Feather
          name="settings"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Log out" && (
        <FontAwesome5 name="power-off" size={24} color="white" />
      )}
      <Text
        style={{
          fontWeight: "600",
          fontSize: 17,
          color: giveColor(),
        }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};
