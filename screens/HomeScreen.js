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
import { UserActions } from "../redux/user/UserSlice";
import * as SecureStore from "expo-secure-store";
import { sidebarActions } from "../redux/SidebarSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BuyCoffeeModal } from "../components/BuyCoffeeModal";
import { detectNewUser } from "../helpers/detectNewUser";
import { initializeLsKeys } from "../helpers/initializeLsKeys";
import { SyncModal } from "../components/SyncModal";
import { UserModal } from "../components/UserModal";
import { FarmerMgtModal } from "../components/FarmerMgtModal";

export const HomeScreen = ({ route }) => {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [today, setToday] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [stationDetails, setStationDetails] = useState({
    location: null,
    name: null,
    id: null,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarScrolled, setsideBarScroll] = useState(false);
  const [isBuyCoffeeModalOpen, setIsBuyCoffeeModalOpen] = useState(false);
  const [isFarmerMgtModalOpen, setIsFarmerModalOpen] = useState(false);

  const [columnGapFac, setColumnGapFac] = useState(1);
  const [rowGapFac, setRowGapFac] = useState(1);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);

  const [exitApp, setExitApp] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const { data = null } = route.params;

  const toggleUserModal = () => {
    setUserDetailsModalOpen((prevState) => !prevState);
  };

  const handleClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSync = () => {
    navigation.replace("Sync", { data: { newUser: true } });
  };

  const handleSyncModal = () => {
    setNewUserModalOpen(false);
  };

  const calculateFactor = () => {
    if (screenHeight < 620) {
      setColumnGapFac(0.06);
      setRowGapFac(0.01);
    } else {
      setColumnGapFac(0.018);
      setRowGapFac(0.016);
    }
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

  useFocusEffect(
    React.useCallback(() => {
      const initData = async () => {
        const userName = data?.nameFull
          ? data?.nameFull
          : await SecureStore.getItemAsync("rtc-name-full");
        const stationData = { location: null, name: null, id: null };

        stationData.location = await SecureStore.getItemAsync(
          "rtc-station-location"
        );
        stationData.name = await SecureStore.getItemAsync("rtc-station-name");
        stationData.id =
          userState.userData.staff._kf_Station ||
          (await SecureStore.getItemAsync("rtc-station-id"));

        if (stationData.location && stationData.name) {
          setStationDetails((prevState) => ({
            ...prevState,
            location: stationData.location,
            name: stationData.name,
          }));
        }
        if (stationData.id) {
          setStationDetails((prevState) => ({
            ...prevState,
            id: stationData.id,
          }));
        }

        if (userName) {
          setDisplayName(userName.split(" ")[1]);
        }

        const currentDate = new Date();
        setToday(formatDate(currentDate));
        const unsubscribe = navigation.addListener("blur", () => {
          if (!navigation.isFocused()) {
            dispatch(sidebarActions.closeSidebar());
            setIsSidebarOpen(false);
          }
        });

        return unsubscribe;
      };
      const newUserDetection = async () => {
        let stationId = userState.userData.staff._kf_Station;
        detectNewUser({ newStationId: data?.stationId || stationId })
          .then((isNewUser) => {
            if (isNewUser && !userState.checkedForNewUser) {
              setNewUserModalOpen(true);
            } else {
              console.log("old user");
              initializeLsKeys({
                stationId: data?.stationId || stationId,
                setStationDetails,
              }); // init local storage data
            }
          })
          .catch((error) => {
            console.error("Error detecting new user:", error);
          });

        dispatch(UserActions.setCheckedForNewUser(true));
      };

      calculateFactor();
      initData();
      newUserDetection();

      return () => {
        setNewUserModalOpen(false);
        dispatch(UserActions.setCheckedForNewUser(true));
      };
    }, [navigation, userState.dataReceived])
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
      <StatusBar
        style={isSidebarOpen || isBuyCoffeeModalOpen ? "light" : "dark"}
      />
      {isSidebarOpen && (
        <SideBar
          setsideBarScroll={setsideBarScroll}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
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
          <TouchableOpacity onPress={toggleUserModal}>
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
            {stationDetails.name && <StationLocation data={stationDetails} />}
          </ImageBackground>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            columnGap: screenWidth * columnGapFac,
            rowGap: screenHeight * rowGapFac,
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
            padding: screenWidth * 0.05,
          }}
        >
          <OpCard name={"Farmer"} action={setIsFarmerModalOpen} />
          <OpCard name={"Inspection"} destination={"chooseInspection"} />
          <OpCard name={"Training"} destination="TrainingCourses" />
          <OpCard name={"Buy Coffee"} action={setIsBuyCoffeeModalOpen} />
          <OpCard name={"CWS Finance"} />
          <OpCard name={"Wet Mill Audit"} />
        </View>
      </View>

      {isBuyCoffeeModalOpen && (
        <BuyCoffeeModal setIsBuyCoffeeModalOpen={setIsBuyCoffeeModalOpen} />
      )}

      {isFarmerMgtModalOpen && (
        <FarmerMgtModal setIsFarmerModalOpen={setIsFarmerModalOpen} />
      )}

      {/* new user modal */}
      {newUserModalOpen && (
        <SyncModal
          label={`First login? you need to perform data synchronization now`}
          onYes={handleSync}
          OnNo={handleSyncModal}
          labelYes="Ok"
          labelNo="No, maybe later"
        />
      )}

      {/* user details modal */}
      {userDetailsModalOpen && (
        <UserModal
          data={{
            names: userState.userData.staff.Name,
            role: userState.userData.staff.Role,
            station: stationDetails,
          }}
          CloseFn={setUserDetailsModalOpen}
        />
      )}
    </View>
  );
};
