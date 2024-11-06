import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const weeklyReportSubmit = createAsyncThunk(
  "farmer/report",
  async (data) => {
    try {
      const { reports, token } = data;

      const response = await api.post(
        `/sync/farmer/report`,
        { reports },
        {
          headers: { auth_token: `${token}` },
        }
      );

      let resp = null;
      if (response.status === 200) {
        console.log("report submitted");
        resp = response.data;
      } else {
        console.log("Error submitting report: -> ", response.data);
        throw err;
      }
      return resp;
    } catch (err) {
      console.log(`Error submitting report: - ${err}`);
      throw err;
    }
  }
);

const ReportSlice = createSlice({
  name: "report",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetWeeklyReportState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(weeklyReportSubmit.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(weeklyReportSubmit.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(weeklyReportSubmit.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const WeeklyReportAction = ReportSlice.actions;
export default ReportSlice;
