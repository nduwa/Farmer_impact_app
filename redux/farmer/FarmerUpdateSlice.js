import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const farmerUpdate = createAsyncThunk("farmers/update", async (data) => {
  try {
    const response = await api.post(`/sync/farmer/update`, data);

    let resp = null;
    if (response.status === 200) {
      console.log("Farmers updates");
      resp = response.data;
    } else {
      console.log("Error updating farmers: -> ", response.data);
      throw err;
    }
    return resp;
  } catch (err) {
    console.log(`Error updating farmers: - ${err}`);
    throw err;
  }
});

const FarmerUpdateSlice = createSlice({
  name: "update",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetUpdateState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(farmerUpdate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(farmerUpdate.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(farmerUpdate.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const farmerUpdateAction = FarmerUpdateSlice.actions;
export default FarmerUpdateSlice;
