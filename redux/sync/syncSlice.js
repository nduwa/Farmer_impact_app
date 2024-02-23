import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const sync = createAsyncThunk("data/sync", async (data) => {
  try {
    const { tableName } = data;
    if (!tableName) return;
    const response = await api.get(`/sync/${tableName}`);
    if (response.status === 200) {
      console.log(`Data received for ${tableName}`);
    }

    return response.data.allStations;
  } catch (err) {
    const error = err.response.data;
    console.log(`Data retrieval for ${tableName} failed: ${error.message}`);
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
      state.serverResponded = true;
    });
    builder.addCase(sync.fulfilled, (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.error = null;
      state.serverResponded = true;
    });
    builder.addCase(sync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.serverResponded = true;
    });
  },
});

export const syncActions = syncSlice.actions;
export default syncSlice;
