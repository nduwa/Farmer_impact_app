import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const scJournalSubmission = createAsyncThunk(
  "journal/submit",
  async (data) => {
    try {
      const response = await api.post(`/sync/journal`, data);

      let resp = null;
      if (response.status === 200) {
        console.log("Journal Submitted");
        resp = response.data;
      } else {
        console.log("Error submitting journal: ", response.data);
      }
      return resp;
    } catch (err) {
      console.log(`Error submitting journal: ${err}`);
    }
  }
);

const JournalSlice = createSlice({
  name: "journal",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetJournalState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(scJournalSubmission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(scJournalSubmission.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(scJournalSubmission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.serverResponded = false;
    });
  },
});

export const journalActions = JournalSlice.actions;
export default JournalSlice;
