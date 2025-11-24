import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealTypeService } from './mealTypeService';
import apiClient from './apiClient';

// Base URL for API
export const API_BASE_URL = 'https://fitpick-be.onrender.com';

// Auth API functions
export const authAPI = {
  // Register user
  register: async (email: string, password: string, confirmPassword: string) => {
    try {
      const response = await apiClient.post('/api/auth/register', {
        email,
        password,
        confirmPassword,
      });
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const doLogin = async () => apiClient.post('/api/auth/login', { email, password });
      let response = await doLogin();
      
      // Retry once on transient network error
      if (!response?.data) {
        try {
          response = await doLogin();
        } catch (e) {
          throw e;
        }
      }
      
      const { token, refreshToken, user } = response.data.data;
      
      // Store tokens
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    } catch (error) {
      // Handle error silently
    }
  },
};

// Function to check authentication status
export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const user = await AsyncStorage.getItem('user');
    
    return {
      isAuthenticated: !!token,
      hasRefreshToken: !!refreshToken,
      hasUserData: !!user
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      hasRefreshToken: false,
      hasUserData: false
    };
  }
};

// Function to clear all auth data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userInfo']);
  } catch (error) {
    // Handle error silently
  }
};

export default apiClient;