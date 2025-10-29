import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealTypeService } from './mealTypeService';
import apiClient from './apiClient';

// Base URL for API
const API_BASE_URL = 'https://fondlingly-unheaped-amos.ngrok-free.dev';

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
      console.log('🔐 Debug - API login called with:', { email, password: '***' });
      console.log('🌐 Debug - Full URL:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });
      
      console.log('🔐 Debug - Raw API response:', response.data);
      const { token, refreshToken, user } = response.data.data;
      
      console.log('🔐 Debug - Extracted tokens:', { 
        hasToken: !!token, 
        hasRefreshToken: !!refreshToken, 
        hasUser: !!user 
      });
      
      // Store tokens
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Debug - Tokens stored successfully');
      return response.data;
    } catch (error: any) {
      console.log('❌ Debug - API login error:', error);
      console.log('❌ Debug - Error status:', error.response?.status);
      console.log('❌ Debug - Error data:', error.response?.data);
      console.log('❌ Debug - Error message:', error.message);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },
};

// Function to check authentication status
export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const user = await AsyncStorage.getItem('user');
    
    console.log('🔍 Auth Status Check:');
    console.log('  - Access Token:', !!token);
    console.log('  - Refresh Token:', !!refreshToken);
    console.log('  - User Data:', !!user);
    
    return {
      isAuthenticated: !!token,
      hasRefreshToken: !!refreshToken,
      hasUserData: !!user
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
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
    console.log('🧹 Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export default apiClient;