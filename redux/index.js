import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./user/UserSlice";
import SidebarSlice from "./SidebarSlice";
import loginSlice from "./user/loginSlice";
import syncSlice from "./sync/syncSlice";
import JournalSlice from "./journal/JournalSlice";
import inspectionSlice from "./inspection/inspectionSlice";
import trainingSlice from "./training/trainingSlice";
import RegistrationSlice from "./farmer/RegistrationSlice";
import DeletionSlice from "./farmer/DeletionSlice";

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    sidebar: SidebarSlice.reducer,
    login: loginSlice.reducer,
    sync: syncSlice.reducer,
    journal: JournalSlice.reducer,
    inspection: inspectionSlice.reducer,
    training: trainingSlice.reducer,
    registration: RegistrationSlice.reducer,
    deletion: DeletionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
