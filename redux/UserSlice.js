import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    token: "",
  },
  reducers: {
    setUserData(state, action) {
      state.userData = {};
    },
    clearUserData(state, action) {
      state.userData = {};
      state.token = "";
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const UserActions = UserSlice.actions;
export default UserSlice;
