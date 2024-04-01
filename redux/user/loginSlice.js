import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";
import * as SecureStore from "expo-secure-store";

export const login = createAsyncThunk("users/login", async (data) => {
  try {
    const response = await api.post(`/user/login?appLogin=1`, data);

    if (response.status === 200) {
      const { token } = response.data;
      await SecureStore.setItemAsync("rtc-token", token);
    }
    return response.data;
  } catch (err) {
    console.log(`Login failed: ${err}`);
    throw err;
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetLoginState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.response = null;
      state.serverResponded = true;
    });
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice;
