import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./user/UserSlice";
import SidebarSlice from "./SidebarSlice";
import loginSlice from "./user/loginSlice";
import syncSlice from "./sync/syncSlice";
import JournalSlice from "./journal/JournalSlice";
import inspectionSlice from "./inspection/inspectionSlice";
import trainingSlice from "./training/trainingSlice";

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    sidebar: SidebarSlice.reducer,
    login: loginSlice.reducer,
    sync: syncSlice.reducer,
    journal: JournalSlice.reducer,
    inspection: inspectionSlice.reducer,
    training: trainingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
