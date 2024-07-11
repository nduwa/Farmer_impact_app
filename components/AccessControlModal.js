import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { colors } from "../data/colors";
import CustomButton from "./CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  accessCtrlActions,
  getAccessControlData,
} from "../redux/accessControl/accessControlSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { dataTodb } from "../helpers/dataTodb";
import { updateDBdataAsync } from "../helpers/updateDBdataAsync";
import { updateDBdata } from "../helpers/updateDBdata";
import { UserActions } from "../redux/user/UserSlice";

export const AccessControlModal = ({ completeFn, isRefresh = false }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const accessControlState = useSelector((state) => state.accessControl);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const prevAccessMods = useSelector((state) => state.user.accessModules);
  const userState = useSelector((state) => state.user);

  const [allModules, setAllModules] = useState();
  const [assignedModules, setAssignedModules] = useState();
  const [currentJob, setCurrentJob] = useState();
  const [error, setError] = useState(false);

  const handleClose = async () => {
    await SecureStore.deleteItemAsync("rtc-token");
    dispatch(UserActions.clearUserData());
    dispatch(UserActions.setCheckedForNewUser(false));
    console.log("Secure store key(s) deleted successfully.");

    navigation.navigate("Login", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  useEffect(() => {
    if (currentJob === "modules inserted") {
      setCurrentJob("Granting access to user...");

      if (assignedModules.length > 0) {
        dataTodb({
          tableName: "assignedModules",
          setCurrentJob,
          syncData: assignedModules,
        });
      } else {
        query = `UPDATE rtc_mobile_app_access_control SET active = 0 WHERE userid = '${userState.userData.staff.id}'`;

        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "Access refreshed",
          msgNo: "Access not refreshed",
        });

        displayToast("You do not have access, contact support");
        completeFn({ open: false, granted: true, refreshing: false });
      }
    } else if (currentJob === "modules assigned") {
      if (isRefresh) {
        let prevMods = [];
        let newMods = [];
        let filteredMods = [];
        for (let mod of prevAccessMods) {
          prevMods.push(mod.id);
        }
        for (let mod of assignedModules) {
          newMods.push(mod.moduleid);
        }

        filteredMods = prevMods.filter((value) => !newMods.includes(value));
        let strIDs = "";
        let query = "";
        let i = 0;

        for (const id of filteredMods) {
          strIDs += `'${id}'`;
          if (i < filteredMods.length - 1) strIDs += ",";
          i++;
        }

        query = `UPDATE rtc_mobile_app_access_control SET active = 0 WHERE moduleid IN (${strIDs})`;

        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "Access refreshed",
          msgNo: "Access not refreshed",
        });
      } else {
        displayToast("User granted access");
        setCurrentJob("Complete");
        completeFn({ open: false, granted: true, refreshing: false });
      }
    } else if (currentJob === "Access refreshed") {
      displayToast("Access refreshed");
      setCurrentJob("Complete");
      completeFn({ open: false, granted: true, refreshing: false });
    } else if (currentJob === "Access not refreshed") {
      displayToast("No changes applied");
      completeFn({ open: false, granted: true, refreshing: false });
    }
  }, [currentJob]);

  useEffect(() => {
    if (accessControlState.serverResponded) {
      if (accessControlState.response.status === "success") {
        let modules = accessControlState.response.mobileModules;
        let assigned = accessControlState.response.allAssignedModules;

        setAllModules(modules);
        setAssignedModules(assigned);

        dataTodb({
          tableName: "mobileModules",
          setCurrentJob,
          syncData: modules,
        });
      } else {
        setError(true);
        displayToast("Access not granted, check your connection and try again");
      }
    }
  }, [accessControlState.serverResponded]);
  useEffect(() => {
    if (accessControlState.error) {
      setError(true);
      displayToast("Access not granted, check your connection and try again");
    }
  }, [accessControlState.error]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const token = await SecureStore.getItemAsync("rtc-token");

        if (token) {
          dispatch(getAccessControlData(token));
          setCurrentJob("Fetching feature access...");
        }
      };

      fetchData();

      return () => {
        setAllModules();
        setAssignedModules();
        dispatch(accessCtrlActions.resetAccessCtrlState());
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 10,
        backgroundColor: colors.black_a,
        zIndex: 11,
      }}
    >
      <View
        style={{
          width: "83%",
          alignItems: "center",
          gap: screenHeight * 0.02,
          borderRadius: 15,
          backgroundColor: colors.white,
          padding: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
            gap: screenHeight * 0.01,
          }}
        >
          <Text
            style={{
              fontSize: screenWidth * 0.05,
              fontWeight: "600",
            }}
          >
            Access Control
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary_variant,
              height: screenHeight * 0.002,
              width: screenWidth * 0.7,
            }}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            width: "100%",
            gap: screenWidth * 0.01,
          }}
        >
          {accessControlState.loading && (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                style={{
                  height: 60,
                  width: 160,
                  alignSelf: "center",
                }}
                source={require("../assets/lottie/loader.json")}
                autoPlay
                speed={0.8}
                loop={true}
                resizeMode="cover"
              />
            </View>
          )}

          <Text
            style={{
              fontSize: screenHeight * 0.018,
              fontWeight: "400",
            }}
          >
            {currentJob}
          </Text>

          <View style={{ flexDirection: "column" }}>
            {error && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: screenWidth * 0.004,
                  marginVertical: screenHeight * 0.01,
                }}
              >
                <MaterialIcons
                  name="error"
                  size={screenHeight * 0.03}
                  color={colors.red_bg}
                />
                <Text
                  style={{
                    color: colors.red_bg,
                    fontSize: screenHeight * 0.016,
                    fontWeight: "600",
                    textAlign: "center",
                    width: "85%",
                  }}
                >
                  Something went wrong. The action was not completed, try again.
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <CustomButton
                bg={colors.secondary}
                color={"white"}
                width="45%"
                text="Close"
                bdcolor="transparent"
                mt={8}
                mb={8}
                radius={7}
                paddingRatio={0.01}
                disabled={false}
                fontSizeRatio={0.04}
                onPress={handleClose}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
