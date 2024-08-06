import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const farmSubmit = createAsyncThunk("farmer/farm", async (data) => {
  try {
    const response = await api.post(`/sync/farmer/farms`, data);

    let resp = null;
    if (response.status === 200) {
      console.log("farms submitted");
      resp = response.data;
    } else {
      console.log("Error submitting farms: -> ", response.data);
      throw err;
    }
    return resp;
  } catch (err) {
    console.log(`Error submitting farms: - ${err}`);
    throw err;
  }
});

const FarmCoordinateSlice = createSlice({
  name: "farms",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetFarmsState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(farmSubmit.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(farmSubmit.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(farmSubmit.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const FarmActions = FarmCoordinateSlice.actions;
export default FarmCoordinateSlice;
