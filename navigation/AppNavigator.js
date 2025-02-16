import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import BudgetListScreen from '../screens/BudgetListScreen';
import BudgetFormScreen from '../screens/BudgetFormScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BudgetList" component={BudgetListScreen} />
        <Stack.Screen name="BudgetForm" component={BudgetFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
