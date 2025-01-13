import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const getClosedTransactions = createAsyncThunk(
  "wetmill/closed_transaction",
  async (data) => {
    try {
      const { seasonId, stationId, token } = data;

      const response = await api.get(
        `/sync/transactions/closed/${stationId}/${seasonId}`,
        {
          headers: { auth_token: `${token}` },
        }
      );

      let resp = null;
      if (response.status === 200) {
        console.log("closed transactions data received");
        resp = response.data;
      } else {
        console.log(
          "Error getting closed transactions data: -> ",
          response.data
        );
        throw err;
      }
      return resp;
    } catch (err) {
      console.log(`Error getting closed transactions data: - ${err}`);
      throw err;
    }
  }
);

const ClosedTransactionSlice = createSlice({
  name: "closedTransaction",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetClosedTrState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClosedTransactions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getClosedTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(getClosedTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const closedTrActions = ClosedTransactionSlice.actions;
export default ClosedTransactionSlice;
