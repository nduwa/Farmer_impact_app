import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../data/colors";
import { globalStyles } from "../data/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import sidebar_IMG from "../assets/sidebar_banner.jpg";

import { Ionicons } from "@expo/vector-icons";
import { SideNav } from "./SideNav";
import { sidebarActions } from "../redux/SidebarSlice";
import { StationLocation } from "./StationLocation";

export const SideBar = ({ navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const dispatch = useDispatch();

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const sidebarWidth = screenWidth * 0.75;
  const animation = new Animated.Value(0);

  const handleClick = () => {
    setIsSidebarOpen(false);
  };
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isSidebarOpen ? -sidebarWidth : 0,
      isSidebarOpen ? 0 : -sidebarWidth,
    ],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isSidebarOpen ? 1 : 0,
      easing: Easing.back(),
      duration: isSidebarOpen ? 400 : 5,
      useNativeDriver: true,
    }).start(() => {
      dispatch(sidebarActions.toggleSidebar());
    });
  }, [isSidebarOpen]);

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: colors.black_a,
        zIndex: 10,
      }}
    >
      <Animated.View
        style={[globalStyles.sidebar, { transform: [{ translateX }] }]}
      >
        <ImageBackground
          source={sidebar_IMG}
          resizeMode="cover"
          style={{
            justifyContent: "flex-end",
            height: screenHeight * 0.13,
            overflow: "hidden",
            backgroundColor: "red",
            borderBottomLeftRadius: 40,
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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 8,
              marginBottom: screenHeight * 0.01,
            }}
          >
            <StationLocation />
            <TouchableOpacity onPress={handleClick}>
              <Ionicons name="close-circle-sharp" size={screenWidth * 0.08} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View
          style={{
            flex: 1,
            gap: 8,
            marginTop: screenHeight * 0.03,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <SideNav name={"Sync Data"} />
          <SideNav name={"Pending Farms"} />
          <SideNav name={"Pending Registrations"} />
          <SideNav name={"Pending Inspections"} />
          <SideNav name={"Pending Children"} />
          <SideNav name={"Pending Training"} />
          <SideNav name={"SC Daily Journals"} />
          <SideNav name={"CWS Finance"} />
          <SideNav name={"History"} isActive={true} />
          <SideNav name={"Change Settings"} />

          <SideNav name={"Log out"} isLogOut={true} />
        </View>
      </Animated.View>
    </View>
  );
};
