import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const groupAssignUpdate = createAsyncThunk(
  "farmer/assign",
  async (data) => {
    try {
      const { groupChanges, token } = data;
      const response = await api.post(
        `/sync/farmer/assign`,
        { groupChanges },
        {
          headers: { auth_token: `${token}` },
        }
      );

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

const GroupAssignSlice = createSlice({
  name: "deletion",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetGroupAssignState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(groupAssignUpdate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(groupAssignUpdate.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(groupAssignUpdate.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const GroupAssignAction = GroupAssignSlice.actions;
export default GroupAssignSlice;
