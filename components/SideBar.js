import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { colors } from "../data/colors";
import { globalStyles } from "../data/globalStyles";
import sidebar_IMG from "../assets/sidebar_banner.jpg";

import { Ionicons } from "@expo/vector-icons";
import { SideNav } from "./SideNav";
import { StationLocation } from "./StationLocation";
import { useIsFocused } from "@react-navigation/native";

export const SideBar = ({ setsideBarScroll, setIsSidebarOpen }) => {
  const [stationDetails, setStationDetails] = useState(null);
  const [initClose, setInitClose] = useState(false);
  const isFocused = useIsFocused();

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const sidebarWidth = screenWidth * 0.745;
  const animation = new Animated.Value(0);

  const handleClick = () => {
    setInitClose(true);
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [initClose ? 0 : -sidebarWidth, initClose ? -sidebarWidth : 0],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      easing: initClose ? Easing.back() : Easing.linear,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (initClose) setIsSidebarOpen(false);
    });
  }, [initClose]);

  useEffect(() => {
    const initStationDetails = async () => {
      const stationData = { location: null, name: null };

      stationData.location = await SecureStore.getItemAsync(
        "rtc-station-location"
      );
      stationData.name = await SecureStore.getItemAsync("rtc-station-name");

      if (stationData.location && stationData.name) {
        setStationDetails(stationData);
      }
    };
    if (isFocused) {
      initStationDetails();
    }
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View
        style={{
          flexGrow: 1,
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
              backgroundColor: "transparent",
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
              {stationDetails ? (
                <StationLocation data={stationDetails} />
              ) : (
                <View
                  style={{
                    alignSelf: "flex-end",
                    alignItems: "center",
                    flexDirection: "row",
                    padding: screenWidth * 0.03,
                  }}
                />
              )}
              <TouchableOpacity onPress={handleClick}>
                <Ionicons
                  name="close-circle-sharp"
                  size={screenWidth * 0.08}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <ScrollView>
            <View
              style={{
                gap: 8,
                // marginTop: screenHeight * 0.03,
                paddingVertical: 20,
                paddingHorizontal: 15,
              }}
            >
              <SideNav name={"Sync Data"} destination="Sync" />
              <SideNav name={"Pending Farms"} />
              <SideNav name={"Pending Registrations"} />
              <SideNav name={"Pending Inspections"} />
              <SideNav name={"Pending Children"} />
              <SideNav name={"Pending Training"} />
              <SideNav
                name={"SC Daily Journals"}
                destination="ScDailyJournal"
              />
              <SideNav name={"CWS Finance"} />
              <SideNav name={"History"} />
              <SideNav name={"Change Settings"} />

              <SideNav name={"Log out"} isLogOut={true} destination={"Login"} />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
