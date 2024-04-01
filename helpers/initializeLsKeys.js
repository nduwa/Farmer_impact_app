import { retrieveDBdataAsync } from "./retrieveDBdataAsync";
import * as SecureStore from "expo-secure-store";

export const initializeLsKeys = ({ stationId, setStationDetails }) => {
  try {
    retrieveDBdataAsync({ stationId, tableName: "rtc_supplier" })
      .then(async (data) => {
        await SecureStore.setItemAsync("rtc-supplier-id", data.__kp_Supplier);
      })
      .catch((error) => {
        console.log("Error setting supplier ls keys: ", error);
      });

    retrieveDBdataAsync({ stationId, tableName: "rtc_station" })
      .then(async (data) => {
        setStationDetails({ name: data.Name, location: data.Area_Big });

        await SecureStore.setItemAsync("rtc-station-id", data.__kp_Station);
        await SecureStore.setItemAsync("rtc-station-location", data.Area_Big);
        await SecureStore.setItemAsync("rtc-station-name", data.Name);
      })
      .catch((error) => {
        console.log("Error setting station ls keys: ", error);
      });

    retrieveDBdataAsync({ stationId, tableName: "rtc_seasons" })
      .then(async (data) => {
        let zYear = data.z_Year;
        await SecureStore.setItemAsync("rtc-seasons-id", data.__kp_Season);

        await SecureStore.setItemAsync("rtc-seasons-label", data.Label_Short);

        await SecureStore.setItemAsync("rtc-seasons-year", zYear.toString());
      })
      .catch((error) => {
        console.log("Error setting season ls keys: ", error);
      });
  } catch (error) {
    console.log(error);
  }
};
