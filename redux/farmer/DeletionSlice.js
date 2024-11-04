import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const farmerDeletion = createAsyncThunk(
  "farmers/delete",
  async (data) => {
    try {
      const { submitData, token } = data;
      const response = await api.post(`/sync/farmer/update`, submitData, {
        headers: { auth_token: `${token}` },
      });

      let resp = null;
      if (response.status === 200) {
        console.log("Farmers Deleted");
        resp = response.data;
      } else {
        console.log("Error deleting farmers: -> ", response.data);
        throw err;
      }
      return resp;
    } catch (err) {
      console.log(`Error deleting farmers: - ${err}`);
      throw err;
    }
  }
);

const DeletionSlice = createSlice({
  name: "deletion",
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
    builder.addCase(farmerDeletion.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(farmerDeletion.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(farmerDeletion.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const deletionAction = DeletionSlice.actions;
export default DeletionSlice;
