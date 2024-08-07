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
import accessControlSlice from "./accessControl/accessControlSlice";
import GroupStatusChangeSlice from "./farmer/GroupStatusChangeSlice";
import GroupAssignSlice from "./farmer/FarmerAssignsSlice";
import ReportSlice from "./farmer/ReportSlice";

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
    accessControl: accessControlSlice.reducer,
    groupStatus: GroupStatusChangeSlice.reducer,
    groupAssign: GroupAssignSlice.reducer,
    report: ReportSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
