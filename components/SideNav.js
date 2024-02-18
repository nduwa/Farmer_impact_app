import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../data/colors";

export const SideNav = ({ name }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
    >
      {name === "Sync Data" && (
        <FontAwesome5 name="sync" size={20} color={colors.black_a} />
      )}
      {name === "Pending Farms" && (
        <Feather name="map" size={24} color={colors.black_a} />
      )}
      {name === "Pending Registrations" && (
        <AntDesign name="addusergroup" size={24} color={colors.black_a} />
      )}
      {name === "Pending Inspections" && (
        <Foundation name="page-search" size={24} color={colors.black_a} />
      )}
      {name === "Pending Children" && (
        <Feather name="users" size={24} color={colors.black_a} />
      )}
      {name === "Pending Training" && (
        <Ionicons name="school-outline" size={24} color={colors.black_a} />
      )}
      {name === "SC Daily Journals" && (
        <Ionicons name="journal-outline" size={24} color={colors.black_a} />
      )}
      {name === "CWS Finance" && (
        <MaterialCommunityIcons
          name="finance"
          size={24}
          color={colors.black_a}
        />
      )}
      {name === "History" && (
        <Entypo name="back-in-time" size={24} color={colors.black_a} />
      )}
      {name === "Change Settings" && (
        <Feather name="settings" size={24} color={colors.black_a} />
      )}
      <Text style={{ fontWeight: "600", fontSize: 17 }}>{name}</Text>
    </TouchableOpacity>
  );
};
