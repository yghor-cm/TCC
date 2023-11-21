import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import LoginScreen from "./src/screens/LoginScreen";
import UsersListScreen from "./src/screens/UsersListScreen";
import HistoryScreen from "./src/screens/historyScreen";
import GraphScreen from "./src/screens/graphScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HistoryNetworthScreen from "./src/screens/historyNetworthScreen";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate("UsersListScreen")}
      />
      <DrawerItem
        label="Despesas"
        onPress={() => props.navigation.navigate("historyScreen")}
      />
      <DrawerItem
        label="Receitas"
        onPress={() => props.navigation.navigate("historyNetworthScreen")}
      />
      <DrawerItem
        label="Relatório"
        onPress={() => props.navigation.navigate("graphScreen")}
      />
      <DrawerItem label="Sair" onPress={() => props.navigation.navigate("LoginScreen")} />
    </DrawerContentScrollView>
  );
}

const Stack = createStackNavigator();

function AuthenticatedDrawerNavigator({ route }) {
  const { userId } = route.params;
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="UsersListScreen"
        component={UsersListScreen}
        initialParams={{ userId: userId }}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="historyScreen"
        component={HistoryScreen}
        initialParams={{ userId: userId }}
        options={{ title: "Histórico de despesas" }}
      />
      <Drawer.Screen
        name="historyNetworthScreen"
        component={HistoryNetworthScreen}
        initialParams={{ userId: userId }}
        options={{ title: "Histórico de receitas" }}
      />
      <Drawer.Screen
        name="graphScreen"
        component={GraphScreen}
        initialParams={{ userId: userId }}
        options={{ title: "Relatório" }}
      />
    </Drawer.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#621ff7"
        },
        headerTintColor: "#fff",
        headerTitlestyle: {
          fontWeight: "bold"
        }
      }}
    >
      <Stack.Screen 
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="AuthenticatedScreens"
        component={AuthenticatedDrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: "Registrar",
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
      }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

export default App;