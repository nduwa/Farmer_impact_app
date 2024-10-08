import React from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { colors } from "../data/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { sidebarActions } from "../redux/SidebarSlice";
import * as SecureStore from "expo-secure-store";
import { UserActions } from "../redux/user/UserSlice";

export const SideNav = ({
  name,
  isLogOut = false,
  isActive = true,
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
      await SecureStore.deleteItemAsync("rtc-user-name");
      await SecureStore.deleteItemAsync("rtc-station-location-province");
      await SecureStore.deleteItemAsync("rtc-station-location-sector");
      await SecureStore.deleteItemAsync("rtc-station-location-cell");
      await SecureStore.deleteItemAsync("rtc-station-location-village");

      dispatch(UserActions.clearUserData());
      dispatch(UserActions.setCheckedForNewUser(false));

      console.log("Secure store key(s) deleted successfully.");
    } catch (error) {
      console.error("Error clearing secure store key:", error);
    }
  };

  const handleClick = () => {
    dispatch(sidebarActions.closeSidebar());

    if (isLogOut) clearSecureStoreKey();

    navigation.navigate(destination, { data: null });
  };
  return (
    <TouchableOpacity
      onPress={handleClick}
      disabled={!isActive}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        padding: 8,
        backgroundColor: isLogOut ? colors.secondary : colors.white,
        borderRadius: 10,
        borderRightWidth: 9,
        borderRightColor: isActive ? colors.secondary : "transparent",
        opacity: isActive ? 1 : 0.5,
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
      {name === "Pending Trees" && (
        <FontAwesome5
          name="seedling"
          size={24}
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
      {name === "Updated Farmers" && (
        <MaterialIcons
          name="edit-note"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Removed Farmers" && (
        <MaterialCommunityIcons
          name="delete-forever-outline"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Groups" && (
        <MaterialIcons
          name="people-outline"
          size={24}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Inspections" && (
        <Foundation
          name="page-search"
          size={29}
          color={isActive ? colors.secondary : colors.black_a}
        />
      )}
      {name === "Pending Weekly Reports" && (
        <Octicons
          name="report"
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
      {name === "Pending surveys" && (
        <FontAwesome5
          name="file-upload"
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
      {name === "Change Language" && (
        <Ionicons
          name="language-sharp"
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
