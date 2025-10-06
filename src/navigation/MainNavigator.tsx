import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Import các màn hình
import AuthLandingScreen from '../screens/AuthLandingScreen';
import LoginScreen from '../screens/register&login/LoginScreen';
import RegisterScreen from '../screens/register&login/RegisterScreen';
import UserInfoScreen from '../screens/register&login/UserInfoScreen';
import GoalsScreen from '../screens/register&login/GoalsScreen';
import LifestyleScreen from '../screens/register&login/LifestyleScreen';
import EatStyleScreen from '../screens/register&login/EatStyleScreen';
import BottomTabNavigator from './BottomTabNavigator';
import MealDetailScreen from '../screens/detail/MealDetailScreen';
import CookingLevelScreen from '../screens/register&login/CookingLevelScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ReviewsScreen from '../screens/detail/review/ReviewsScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import PersonalNutritionScreen from '../screens/profile/setting/PersonalNutritionScreen';
import SettingScreen from '../screens/profile/setting/SettingScreen';
import PostDetailScreen from '../screens/home/community/PostDetailScreen';
import CreatePostScreen from '../screens/home/community/CreatePostScreen';
import EditPostScreen from '../screens/home/community/EditPostScreen';

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
                    name="UserInfo"
                    component={UserInfoScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Goals"
                    component={GoalsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Lifestyle"
                    component={LifestyleScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EatStyle"
                    component={EatStyleScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CookingLevel"
                    component={CookingLevelScreen}
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
                <Stack.Screen
                    name="ReviewsScreen"
                    component={ReviewsScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="NotificationsScreen"
                    component={NotificationsScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="PersonalNutritionScreen"
                    component={PersonalNutritionScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="SettingScreen"
                    component={SettingScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="PostDetailScreen"
                    component={PostDetailScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="EditPostScreen"
                    component={EditPostScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="CreatePostScreen"
                    component={CreatePostScreen}
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};