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
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { sidebarActions } from "../redux/SidebarSlice";
import * as SecureStore from "expo-secure-store";

export const SideNav = ({
  name,
  isLogOut = false,
  isActive = false,
  destination = "Homepage", // by default
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const giveColor = () => {
    if (isLogOut) return "white";
    if (isActive) return colors.secondary;
  };

  const clearSecureStoreKey = async () => {
    try {
      await SecureStore.deleteItemAsync("rtc-token");
      await SecureStore.deleteItemAsync("rtc-name-full");
      await SecureStore.deleteItemAsync("rtc-user-staff-id");
      await SecureStore.deleteItemAsync("rtc-sync-stations");
      await SecureStore.deleteItemAsync("rtc-sync-groups");
      await SecureStore.deleteItemAsync("rtc-sync-farmers");
      await SecureStore.deleteItemAsync("rtc-sync-households");
      await SecureStore.deleteItemAsync("rtc-sync-trainingModules");
      await SecureStore.deleteItemAsync("rtc-sync-inspectionQuestions");
      await SecureStore.deleteItemAsync("rtc-user-id");
      await SecureStore.deleteItemAsync("rtc-user-staff-kf");
      await SecureStore.deleteItemAsync("rtc-station-id");
      await SecureStore.deleteItemAsync("rtc-station-location");
      await SecureStore.deleteItemAsync("rtc-station-name");
      await SecureStore.deleteItemAsync("rtc-supplier-id");
      await SecureStore.deleteItemAsync("rtc-seasons-id");
      await SecureStore.deleteItemAsync("rtc-seasons-label");
      await SecureStore.deleteItemAsync("rtc-seasons-year");

      console.log("Secure store key(s) deleted successfully.");
    } catch (error) {
      console.error("Error clearing secure store key:", error);
    }
  };

  const handleClick = () => {
    dispatch(sidebarActions.closeSidebar());

    if (isLogOut) clearSecureStoreKey();

    navigation.navigate(destination);
  };
  return (
    <TouchableOpacity
      onPress={handleClick}
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
