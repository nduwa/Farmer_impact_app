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
import { FarmerRegistrationScreen } from "./screens/farmer/FarmerRegistrationScreen";
import { FarmerUpdateHome } from "./screens/farmer/FarmerUpdateHome";
import { FarmerUpdateScreen } from "./screens/farmer/FarmerUpdateScreen";
import { FarmUpdateScreen } from "./screens/farmer/FarmUpdateScreen";
import { ChooseFarmerScreen } from "./screens/farmer/ChooseFarmerScreen";
import { SelectFarmersScreen } from "./screens/farmer/SelectFarmersScreen";
import { PendingRegistrationsScreen } from "./screens/farmer/PendingRegistrationsScreen";
import { FarmerEditScreen } from "./screens/farmer/FarmerEditScreen";
import { FarmerNewHHmember } from "./screens/farmer/FarmerNewHHmember";
import { PendingDeletionScreen } from "./screens/farmer/PendingDeletionScreen";

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
            name="FarmerNewHHmember"
            options={{ unmountOnBlur: true }}
            component={FarmerNewHHmember}
          />
          <Stack.Screen
            name="FarmerDeletedScreen"
            options={{ unmountOnBlur: true }}
            component={PendingDeletionScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
