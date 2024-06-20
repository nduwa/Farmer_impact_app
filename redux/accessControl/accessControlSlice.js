import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const getAccessControlData = createAsyncThunk(
  "access/get",
  async (token) => {
    try {
      const response = await api.get(`/accessControl/access/mobile`, {
        headers: { auth_token: ` ${token}` },
      });

      let resp = null;
      if (response.status === 200) {
        console.log("access control data received");
        resp = response.data;
      } else {
        console.log("Error getting access control data: -> ", response.data);
        throw err;
      }
      return resp;
    } catch (err) {
      console.log(`Error getting access control data: - ${err}`);
      throw err;
    }
  }
);

const accessControlSlice = createSlice({
  name: "accessControl",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetDeletionState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAccessControlData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAccessControlData.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(getAccessControlData.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const deletionAction = accessControlSlice.actions;
export default accessControlSlice;
