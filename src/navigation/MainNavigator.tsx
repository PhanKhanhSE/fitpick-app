import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Import các màn hình
import AuthLandingScreen from '../screens/AuthLandingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterUserInfoScreen from '../screens/RegisterUserInfoScreen';
import RegisterGoalsScreen from '../screens/RegisterGoalsScreen';
import RegisterLifestyleScreen from '../screens/RegisterLifestyleScreen';
import RegisterMealPlanScreen from '../screens/RegisterMealPlanScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import MealDetailScreen from '../screens/detail/MealDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="AuthLanding">
                <Stack.Screen
                    name="AuthLanding"
                    component={AuthLandingScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RegisterUserInfo"
                    component={RegisterUserInfoScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RegisterGoals"
                    component={RegisterGoalsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RegisterLifestyle"
                    component={RegisterLifestyleScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RegisterMealPlan"
                    component={RegisterMealPlanScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="MainTabs"
                    component={BottomTabNavigator}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="MealDetail"
                    component={MealDetailScreen}
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};