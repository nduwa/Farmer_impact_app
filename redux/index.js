import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import SidebarSlice from "./SidebarSlice";
import loginSlice from "./user/loginSlice";

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    sidebar: SidebarSlice.reducer,
    login: loginSlice.reducer,
  },
});
export default store;
