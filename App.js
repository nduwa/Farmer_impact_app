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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
