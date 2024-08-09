import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./redux";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SyncScreen } from "./screens/SyncScreen";
import { RegisteredFarmerScreen } from "./screens/buyCoffee/RegisteredFarmerScreen";
import { FarmerScreen } from "./screens/buyCoffee/FarmerScreen";
import { UnRegisteredFarmerScreen } from "./screens/buyCoffee/UnregisteredFarmerScreen";
import { ScJournal } from "./screens/scJournal/ScDailyJournal";
import { ScJournalsSummary } from "./screens/scJournal/ScJournalsSummary";
import { EditTransactionScreen } from "./screens/scJournal/EditTransactionScreen";
import { ChooseInspectionScreen } from "./screens/inspection/ChooseInspectionScreen";
import { InspectionFarmerScreen } from "./screens/inspection/InspectionFarmerScreen";
import { InspectionQuestionsScreen } from "./screens/inspection/InspectionQuestionsScreen";
import { InspectionCoursesScreen } from "./screens/inspection/InspectionCoursesScreen";
import { InspectionsScreen } from "./screens/inspection/InspectionsScreen";
import { HistoryScreen } from "./screens/history/HistoryScreen";
import { HistoryDetails } from "./screens/history/HistoryDetails";
import { TrainingCourses } from "./screens/training/TrainingCourses";
import { TrainingFarmers } from "./screens/training/TrainingFarmers";
import { TrainingScreen } from "./screens/training/TrainingScreen";
import { FarmerRegistrationScreen } from "./screens/farmer/register/FarmerRegistrationScreen";
import { FarmerUpdateHome } from "./screens/farmer/updateTrees/FarmerUpdateHome";
import { FarmerUpdateScreen } from "./screens/farmer/updateTrees/FarmerUpdateScreen";
import { FarmUpdateScreen } from "./screens/farmer/updateTrees/FarmUpdateScreen";
import { ChooseFarmerScreen } from "./screens/farmer/updateTrees/ChooseFarmerScreen";
import { SelectFarmersScreen } from "./screens/farmer/removeFarmers/SelectFarmersScreen";
import { PendingRegistrationsScreen } from "./screens/farmer/register/PendingRegistrationsScreen";
import { FarmerEditScreen } from "./screens/farmer/register/FarmerEditScreen";
import { PendingDeletionScreen } from "./screens/farmer/removeFarmers/PendingDeletionScreen";
import { AssignFarmersScreen } from "./screens/farmer/assignGroups/AssignFarmersScreen";
import { WeeklyReportScreen } from "./screens/farmer/weeklyReport/WeeklyReportScreen";
import { UpdateTreesScreen } from "./screens/farmer/updateTrees/UpdateTreesScreen";
import { ChooseGroupScreen } from "./screens/farmer/assignGroups/ChooseGroupScreen";
import { AssignGroupsHome } from "./screens/farmer/assignGroups/AssignGroupsHome";
import { ActiveGroupsScreen } from "./screens/farmer/assignGroups/ActiveGroupsScreen";
import { InactiveGroupsScreen } from "./screens/farmer/assignGroups/InactiveGroupsScreen";
import { PendingGroupsScreen } from "./screens/farmer/assignGroups/PendingGroupsScreen";
import { UploadGroupChangesScreen } from "./screens/farmer/assignGroups/UploadGroupChangesScreen";
import { UploadGroupAssignments } from "./screens/farmer/assignGroups/UploadGroupAssignments";
import { AssignedFarmerDetailsScreen } from "./screens/farmer/assignGroups/AssignedFarmersDetailsScreen";
import PendingReportsScreen from "./screens/farmer/weeklyReport/PendingReportsScreen";
import { EditReportScreen } from "./screens/farmer/weeklyReport/EditReportScreen";
import { PendingTreesScreen } from "./screens/farmer/updateTrees/PendingTreesScreen";
import { EditTreesScreen } from "./screens/farmer/updateTrees/EditTreesScreen";
import { PendingFarmScreen } from "./screens/farmer/updateTrees/PendingFarmScreens";
import { PendingFarmerUpdatesScreen } from "./screens/farmer/updateTrees/PendingFarmerUpdatesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Login"
            options={{ unmountOnBlur: true }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="Homepage"
            options={{ unmountOnBlur: true }}
            component={HomeScreen}
          />
          <Stack.Screen
            name="Sync"
            options={{ unmountOnBlur: true }}
            component={SyncScreen}
          />

          {/* coffee purchase */}
          <Stack.Screen
            name="Registered_ATP_Farmer"
            options={{ unmountOnBlur: true }}
            component={RegisteredFarmerScreen}
          />
          <Stack.Screen
            name="Unregistered_ATP_Farmer"
            options={{ unmountOnBlur: true }}
            component={UnRegisteredFarmerScreen}
          />
          <Stack.Screen
            name="FarmerScreen"
            options={{ unmountOnBlur: true }}
            component={FarmerScreen}
          />
          <Stack.Screen
            name="ScDailyJournal"
            options={{ unmountOnBlur: true }}
            component={ScJournal}
          />
          <Stack.Screen
            name="ScDailySummary"
            options={{ unmountOnBlur: true }}
            component={ScJournalsSummary}
          />
          <Stack.Screen
            name="EditTransaction"
            options={{ unmountOnBlur: true }}
            component={EditTransactionScreen}
          />

          {/* inspection */}
          <Stack.Screen
            name="chooseInspection"
            options={{ unmountOnBlur: true }}
            component={ChooseInspectionScreen}
          />
          <Stack.Screen
            name="inspectionFarmer"
            options={{ unmountOnBlur: true }}
            component={InspectionFarmerScreen}
          />
          <Stack.Screen
            name="inspectionQuestions"
            options={{ unmountOnBlur: true }}
            component={InspectionQuestionsScreen}
          />
          <Stack.Screen
            name="inspectionCourses"
            options={{ unmountOnBlur: true }}
            component={InspectionCoursesScreen}
          />
          <Stack.Screen
            name="InspectionsScreen"
            options={{ unmountOnBlur: true }}
            component={InspectionsScreen}
          />

          {/* history */}
          <Stack.Screen
            name="HistoryScreen"
            options={{ unmountOnBlur: true }}
            component={HistoryScreen}
          />
          <Stack.Screen
            name="HistoryDetails"
            options={{ unmountOnBlur: true }}
            component={HistoryDetails}
          />

          {/* training */}
          <Stack.Screen
            name="TrainingCourses"
            options={{ unmountOnBlur: true }}
            component={TrainingCourses}
          />
          <Stack.Screen
            name="TrainingFarmers"
            options={{ unmountOnBlur: true }}
            component={TrainingFarmers}
          />
          <Stack.Screen
            name="TrainingScreen"
            options={{ unmountOnBlur: true }}
            component={TrainingScreen}
          />

          {/* farmer management */}
          <Stack.Screen
            name="FarmerRegistration"
            options={{ unmountOnBlur: true }}
            component={FarmerRegistrationScreen}
          />
          <Stack.Screen
            name="FarmerUpdateHome"
            options={{ unmountOnBlur: true }}
            component={FarmerUpdateHome}
          />
          <Stack.Screen
            name="FarmerUpdateScreen"
            options={{ unmountOnBlur: true }}
            component={FarmerUpdateScreen}
          />
          <Stack.Screen
            name="FarmUpdateScreen"
            options={{ unmountOnBlur: true }}
            component={FarmUpdateScreen}
          />
          <Stack.Screen
            name="PendingFarmScreen"
            options={{ unmountOnBlur: true }}
            component={PendingFarmScreen}
          />
          <Stack.Screen
            name="ChooseFarmerUpdateScreen"
            options={{ unmountOnBlur: true }}
            component={ChooseFarmerScreen}
          />
          <Stack.Screen
            name="SelectFarmerDeleteScreen"
            options={{ unmountOnBlur: true }}
            component={SelectFarmersScreen}
          />
          <Stack.Screen
            name="PendingRegistrationScreen"
            options={{ unmountOnBlur: true }}
            component={PendingRegistrationsScreen}
          />
          <Stack.Screen
            name="PendingFarmerEditScreen"
            options={{ unmountOnBlur: true }}
            component={FarmerEditScreen}
          />
          <Stack.Screen
            name="FarmerDeletedScreen"
            options={{ unmountOnBlur: true }}
            component={PendingDeletionScreen}
          />
          <Stack.Screen
            name="PendingFarmerUpdatesScreen"
            options={{ unmountOnBlur: true }}
            component={PendingFarmerUpdatesScreen}
          />

          <Stack.Screen
            name="WeeklyReportScreen"
            options={{ unmountOnBlur: true }}
            component={WeeklyReportScreen}
          />
          <Stack.Screen
            name="PendingReportsScreen"
            options={{ unmountOnBlur: true }}
            component={PendingReportsScreen}
          />
          <Stack.Screen
            name="EditReportScreen"
            options={{ unmountOnBlur: true }}
            component={EditReportScreen}
          />

          <Stack.Screen
            name="UpdateTreesScreen"
            options={{ unmountOnBlur: true }}
            component={UpdateTreesScreen}
          />
          <Stack.Screen
            name="PendingTreesScreen"
            options={{ unmountOnBlur: true }}
            component={PendingTreesScreen}
          />
          <Stack.Screen
            name="EditTreesScreen"
            options={{ unmountOnBlur: true }}
            component={EditTreesScreen}
          />

          {/* assign groups */}
          <Stack.Screen
            name="AssignGroupsHome"
            options={{ unmountOnBlur: true }}
            component={AssignGroupsHome}
          />
          <Stack.Screen
            name="FarmerAssignGroupScreen"
            options={{ unmountOnBlur: true }}
            component={AssignFarmersScreen}
          />
          <Stack.Screen
            name="ChooseGroupScreen"
            options={{ unmountOnBlur: true }}
            component={ChooseGroupScreen}
          />
          <Stack.Screen
            name="ActiveGroupsScreen"
            options={{ unmountOnBlur: true }}
            component={ActiveGroupsScreen}
          />
          <Stack.Screen
            name="InactiveGroupsScreen"
            options={{ unmountOnBlur: true }}
            component={InactiveGroupsScreen}
          />
          <Stack.Screen
            name="PendingGroupsScreen"
            options={{ unmountOnBlur: true }}
            component={PendingGroupsScreen}
          />
          <Stack.Screen
            name="UploadGroupChangesScreen"
            options={{ unmountOnBlur: true }}
            component={UploadGroupChangesScreen}
          />
          <Stack.Screen
            name="UploadGroupAssignments"
            options={{ unmountOnBlur: true }}
            component={UploadGroupAssignments}
          />
          <Stack.Screen
            name="AssignedFarmerDetailsScreen"
            options={{ unmountOnBlur: true }}
            component={AssignedFarmerDetailsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
