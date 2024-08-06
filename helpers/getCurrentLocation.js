import * as Location from "expo-location";
import { ToastAndroid } from "react-native";

const displayToast = (msg) => {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
};

export const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    displayToast("Permission to access location was denied");
    return;
  }

  let location = await Location.getCurrentPositionAsync({});

  return location;
};
