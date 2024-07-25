import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const groupStatusUpdate = createAsyncThunk(
  "groups/status",
  async (data) => {
    try {
      const response = await api.post(`/sync/groups/status`, data);

      let resp = null;
      if (response.status === 200) {
        console.log("Group changes submitted");
        resp = response.data;
      } else {
        console.log("Error submitting Group changes: -> ", response.data);
        throw err;
      }
      return resp;
    } catch (err) {
      console.log(`Error submitting Group changes: - ${err}`);
      throw err;
    }
  }
);

const GroupStatusChangeSlice = createSlice({
  name: "deletion",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetGroupStatusState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(groupStatusUpdate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(groupStatusUpdate.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(groupStatusUpdate.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const GroupStatusAction = GroupStatusChangeSlice.actions;
export default GroupStatusChangeSlice;
