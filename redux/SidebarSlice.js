import { createSlice } from "@reduxjs/toolkit";

const SidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebarStatus: false,
  },
  reducers: {
    toggleSidebar(state, action) {
      state.sidebarStatus = !state.sidebarStatus;
    },
    closeSidebar(state, action) {
      state.sidebarStatus = false;
    },
  },
});

export const sidebarActions = SidebarSlice.actions;
export default SidebarSlice;
