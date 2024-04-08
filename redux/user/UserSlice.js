import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    dataReceived: false,
    checkedForNewUser: false,
  },
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
      state.dataReceived = true;
    },
    setCheckedForNewUser(state, action) {
      state.checkedForNewUser = action.payload;
    },
    clearUserData(state, action) {
      state.userData = {};
      state.token = "";
    },
  },
});

export const UserActions = UserSlice.actions;
export default UserSlice;
