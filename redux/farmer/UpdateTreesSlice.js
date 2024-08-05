import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosInstance";

export const treesSubmit = createAsyncThunk("farmer/trees", async (data) => {
  try {
    const response = await api.post(`/sync/farmer/trees`, data);

    let resp = null;
    if (response.status === 200) {
      console.log("trees submitted");
      resp = response.data;
    } else {
      console.log("Error submitting trees: -> ", response.data);
      throw err;
    }
    return resp;
  } catch (err) {
    console.log(`Error submitting trees: - ${err}`);
    throw err;
  }
});

const UpdateTreesSlice = createSlice({
  name: "trees",
  initialState: {
    response: null,
    loading: false,
    error: null,
    serverResponded: false,
  },
  reducers: {
    resetTreesState(state, action) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.serverResponded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(treesSubmit.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(treesSubmit.fulfilled, (state, action) => {
      state.loading = false;
      state.response = { ...action.payload };
      state.error = null;
      state.serverResponded = action.payload ? true : false;
    });
    builder.addCase(treesSubmit.rejected, (state, action) => {
      state.loading = false;
      state.error = { ...action.error };
      state.serverResponded = false;
    });
  },
});

export const updateTreesAction = UpdateTreesSlice.actions;
export default UpdateTreesSlice;
