import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./user/UserSlice";
import SidebarSlice from "./SidebarSlice";
import loginSlice from "./user/loginSlice";
import syncSlice from "./sync/syncSlice";

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    sidebar: SidebarSlice.reducer,
    login: loginSlice.reducer,
    sync: syncSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
