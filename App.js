import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./redux";
import { LoginScreen } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SyncScreen } from "./screens/SyncScreen";
import { RegisteredFarmerScreen } from "./screens/buyCoffee/RegisteredFarmerScreen";
import { FarmerScreen } from "./screens/buyCoffee/FarmerScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
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
            name="FarmerScreen"
            options={{ unmountOnBlur: true }}
            component={FarmerScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
