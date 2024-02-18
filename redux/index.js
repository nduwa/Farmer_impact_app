import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import SidebarSlice from "./SidebarSlice";

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    sidebar: SidebarSlice.reducer,
  },
});
export default store;
