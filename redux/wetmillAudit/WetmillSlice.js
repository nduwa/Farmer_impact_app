import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const auditSubmission = createAsyncThunk(
  "audit/submit",
  async (data) => {
    try {
      const { formData, filepath, station, user, token } = data;

      const response = await api.post(
        `/sync/wetmill?filepath=${filepath}&station=${station}&user=${user}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            auth_token: `${token}`,
          },
        }
      );

      let resp = null;
      if (response.status == 200) {
        console.log("Wetmill audit session Submitted");
        resp = response.data;
      } else {
        console.log("Error submitting Wetmill audit session: ", response.data);
      }

      return resp;
    } catch (err) {
      console.log(`Error submitting Wetmill audit session: ${err}`);
      throw err;
    }
  }
);

const wetmillSlice = createSlice({
  name: "audit",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetAuditState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(auditSubmission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(auditSubmission.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(auditSubmission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.serverResponded = false;
    });
  },
});

export const auditActions = wetmillSlice.actions;
export default wetmillSlice;
