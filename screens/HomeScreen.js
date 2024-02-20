import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ToastAndroid,
} from "react-native";
import { colors } from "../data/colors";
import hamburger_IMG from "../assets/hamburger_menu.png";
import avatar_IMG from "../assets/avatar.png";
import home_IMG from "../assets/home_banner.jpg";
import { OpCard } from "../components/OpCard";
import { SideBar } from "../components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { StationLocation } from "../components/StationLocation";
import { UserActions } from "../redux/UserSlice";
import tokenDecoder from "../helpers/tokenDecoder";
import { sidebarActions } from "../redux/SidebarSlice";
import { useFocusEffect } from "@react-navigation/native";

export const HomeScreen = ({ navigation }) => {
  const sidebar = useSelector((state) => state.sidebar);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [today, setToday] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [exitApp, setExitApp] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleClick = () => {
    setIsSidebarOpen(true);
  };
  const handleNavigation = (location) => {
    navigation.navigate(location);
  };

  function formatDate(date) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  useEffect(() => {
    setIsSidebarOpen(sidebar.sidebarStatus);
  }, [sidebar.sidebarStatus]);

  useEffect(() => {
    const initData = async () => {
      const userData = await tokenDecoder();
      if (userData) {
        dispatch(UserActions.setUserData(userData));
      } else {
        handleNavigation("Login");
      }

      const unsubscribe = navigation.addListener("blur", () => {
        if (!navigation.isFocused()) {
          dispatch(UserActions.clearUserData());
          dispatch(sidebarActions.closeSidebar());
          setIsSidebarOpen(false);
          console.log(SideBar.sidebarStatus);
        }
      });

      return unsubscribe;
    };

    initData();
  }, [navigation]);

  useEffect(() => {
    if (userState.userData) {
      const user = userState.userData.Name_Full;
      if (user) setDisplayName(user.split(" ")[1]);
    }
    const currentDate = new Date();
    setToday(formatDate(currentDate));
  }, [userState.dataReceived]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (exitApp) {
          BackHandler.exitApp(); // Exit the app if exitApp is true
          return true;
        } else {
          setExitApp(true); // Set exitApp to true when back button is pressed first time
          ToastAndroid.show("Tap back again to exit", ToastAndroid.SHORT); // Show toast message
          setTimeout(() => setExitApp(false), 2000); // Reset exitApp state after 2 seconds
          return true; // Prevent default behavior (going back)
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [exitApp])
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.white,
      }}
      on
    >
      <StatusBar style={isSidebarOpen ? "light" : "dark"} />
      <View
        style={{
          flex: 1,
          marginTop: screenHeight * 0.04,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: screenHeight * 0.11,
            backgroundColor: colors.white,
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 2,
              borderRadius: 8,
              backgroundColor: colors.white,
              ...Platform.select({
                ios: {
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 6,
                },
              }),
            }}
            onPress={handleClick}
          >
            <Image
              source={hamburger_IMG}
              resizeMode="cover"
              style={{
                height: 50,
                width: 50,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "900",
                fontSize: screenWidth * 0.07,
                color: colors.secondary_variant,
              }}
            >
              Hello {displayName}
            </Text>
            <Text style={{ fontSize: screenWidth * 0.037 }}>{today}</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={avatar_IMG}
              resizeMode="cover"
              style={{
                height: screenHeight * 0.05,
                width: screenHeight * 0.05,
                borderWidth: 1,
                borderColor: colors.black,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: screenHeight * 0.3,
            borderBottomLeftRadius: 55,
            overflow: "hidden",
            ...Platform.select({
              ios: {
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
              },
              android: {
                elevation: 8,
              },
            }),
          }}
        >
          <ImageBackground
            source={home_IMG}
            resizeMode="cover"
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <StationLocation />
          </ImageBackground>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            columnGap: screenWidth * 0.018,
            rowGap: screenHeight * 0.02,
            backgroundColor: colors.bg_variant,
            marginTop: screenHeight * 0.025,
            borderTopRightRadius: 55,
            ...Platform.select({
              ios: {
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
              },
              android: {
                elevation: 8,
              },
            }),
            padding: screenWidth * 0.06,
          }}
        >
          <OpCard name={"Register"} />
          <OpCard name={"Inspection"} />
          <OpCard name={"Update Farmer"} />
          <OpCard name={"Training"} />
          <OpCard name={"Buy Coffee"} />
          <OpCard name={"Review Purchases"} />
          <OpCard name={"CWS Finance"} />
          <OpCard name={"Wet Mill Audit"} />
        </View>
      </View>
      {isSidebarOpen && <SideBar />}
    </View>
  );
};
