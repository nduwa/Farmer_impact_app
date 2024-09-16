import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import api from "../axiosInstance";

export const sync = createAsyncThunk("data/sync", async (data) => {
  try {
    const { tableName } = data;
    let id = null;

    if (tableName === "stations") {
      id = data.specialId || (await SecureStore.getItemAsync("rtc-user-id"));
    } else if (
      tableName === "groups" ||
      tableName === "farmers" ||
      tableName === "households" ||
      tableName === "suppliers"
    ) {
      id = await SecureStore.getItemAsync("rtc-station-id");
    }

    if (!tableName) return;

    let routeString = `/sync/${tableName}${id ? "/" + id : ""}`;

    const response = await api.get(routeString);

    if (response.status === 200) {
      console.log(`Data received for ${tableName}`);
      if (tableName === "stations") {
        await SecureStore.setItemAsync(
          "rtc-station-id",
          response.data.data[0].__kp_Station
        );
        await SecureStore.setItemAsync(
          "rtc-station-readable-id",
          response.data.data[0].StationID
        );
        await SecureStore.setItemAsync(
          "rtc-station-location",
          response.data.data[0].Area_Big
        );
        await SecureStore.setItemAsync(
          "rtc-station-name",
          response.data.data[0].Name
        );
        await SecureStore.setItemAsync(
          "rtc-supplier-id",
          response.data.data[0]._kf_Supplier
        );
      } else if (tableName === "suppliers") {
        await SecureStore.setItemAsync(
          "rtc-supplier-id",
          response.data.data[0].__kp_Supplier
        );
      } else if (tableName === "seasons") {
        await SecureStore.setItemAsync(
          "rtc-seasons-id",
          response.data.data[0].__kp_Season
        );

        await SecureStore.setItemAsync(
          "rtc-seasons-label",
          response.data.data[0].Label_Short
        );

        let zYear = response.data.data[0].z_Year;
        await SecureStore.setItemAsync("rtc-seasons-year", zYear.toString());
      }
    }

    return response.data.data;
  } catch (err) {
    const error = err.response.data;
    console.log(`Data retrieval for ${tableName} failed: ${error.message}`);
    throw err;
  }
});

const syncSlice = createSlice({
  name: "sync",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetSyncState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sync.pending, (state) => {
      state.loading = true;
      state.serverResponded = false;
    });
    builder.addCase(sync.fulfilled, (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.error = null;
      state.serverResponded = true;
    });
    builder.addCase(sync.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.response = null;
      state.serverResponded = true;
    });
  },
});

export const syncActions = syncSlice.actions;
export default syncSlice;
