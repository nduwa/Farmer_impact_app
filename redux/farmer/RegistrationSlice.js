import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const farmerSubmission = createAsyncThunk(
  "farmers/submit",
  async (data) => {
    try {
      const { registrations, token } = data;
      const response = await api.post(
        `/sync/farmers/registration`,
        registrations,
        {
          headers: { auth_token: `${token}` },
        }
      );

      let resp = null;
      if (response.status === 200) {
        console.log("Farmers Submitted");
        resp = response.data;
      } else {
        console.log("Error submitting farmers: ", response.data);
      }
      return resp;
    } catch (err) {
      console.log(`Error submitting farmers: ${err}`);
      throw err;
    }
  }
);

const RegistrationSlice = createSlice({
  name: "registration",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetRegistrationState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(farmerSubmission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(farmerSubmission.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(farmerSubmission.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const registrationAction = RegistrationSlice.actions;
export default RegistrationSlice;
