import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./redux";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SyncScreen } from "./screens/SyncScreen";
import { RegisteredFarmerScreen } from "./screens/buyCoffee/RegisteredFarmerScreen";
import { FarmerScreen } from "./screens/buyCoffee/FarmerScreen";
import { UnregisteredFarmerScreen } from "./screens/buyCoffee/UnregisteredFarmerScreen";
import { ScJournal } from "./screens/scJournal/ScDailyJournal";
import { ScJournalsSummary } from "./screens/scJournal/ScJournalsSummary";
import { EditTransactionScreen } from "./screens/scJournal/EditTransactionScreen";

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
            component={UnregisteredFarmerScreen}
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
