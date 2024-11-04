import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const trainingSubmission = createAsyncThunk(
  "training/submit",
  async (data) => {
    try {
      const { formData, filepath, token } = data;
      const response = await api.post(
        `/sync/training?filepath=${filepath}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            auth_token: `${token}`,
          },
        }
      );

      let resp = null;
      if (response.status === 200) {
        console.log("Training session Submitted");
        resp = response.data;
      } else {
        console.log("Error submitting Training session: ", response.data);
      }

      return resp;
    } catch (err) {
      console.log(`Error submitting Training session: ${err}`);
      throw err;
    }
  }
);

const trainingSlice = createSlice({
  name: "training",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetTrainingState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(trainingSubmission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(trainingSubmission.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(trainingSubmission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.serverResponded = false;
    });
  },
});

export const trainingActions = trainingSlice.actions;
export default trainingSlice;
