import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    dataReceived: false,
  },
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
      state.dataReceived = true;
    },
    clearUserData(state, action) {
      state.userData = {};
      state.token = "";
    },
  },
});

export const UserActions = UserSlice.actions;
export default UserSlice;
