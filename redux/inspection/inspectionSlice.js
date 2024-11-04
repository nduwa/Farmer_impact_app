import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const inspectionSubmission = createAsyncThunk(
  "inspection/submit",
  async (data) => {
    try {
      const { inspection, responses, token } = data;
      const response = await api.post(
        `/sync/inspection`,
        { inspection, responses },
        {
          headers: { auth_token: `${token}` },
        }
      );

      let resp = null;
      if (response.status === 200) {
        console.log("Inspection Submitted");
        resp = response.data;
      } else {
        console.log("Error submitting inspection: ", response.data);
      }
      return resp;
    } catch (err) {
      console.log(`Error submitting inspection: ${err}`);
      throw err;
    }
  }
);

const inspectionSlice = createSlice({
  name: "inspection",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetInspectionState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(inspectionSubmission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(inspectionSubmission.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(inspectionSubmission.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const inspectionAction = inspectionSlice.actions;
export default inspectionSlice;
