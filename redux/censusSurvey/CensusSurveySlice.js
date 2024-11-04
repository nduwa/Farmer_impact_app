import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const surveyUpload = createAsyncThunk("farmer/survey", async (data) => {
  try {
    const { surveyData, token } = data;

    const response = await api.post(`/sync/farmer/survey`, surveyData, {
      headers: { auth_token: `${token}` },
    });

    let resp = null;
    if (response.status == 200) {
      console.log("survey uploaded");
      resp = response.data;
    } else {
      console.log("Error uploading surveys: -> ", response.data);
      throw err;
    }
    return resp;
  } catch (err) {
    console.log(`Error uploading surveys: - ${err}`);
    throw err;
  }
});

const CensusSurveySlice = createSlice({
  name: "survey",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetSurveyState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(surveyUpload.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(surveyUpload.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(surveyUpload.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const surveyAction = CensusSurveySlice.actions;
export default CensusSurveySlice;
