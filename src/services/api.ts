import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealTypeService } from './mealTypeService';

// Base URL for API
const API_BASE_URL = 'https://940b2af8a005.ngrok-free.app';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Bỏ qua warning page của ngrok
  },
});

// Request interceptor to add auth token and process meal type mapping
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Process request data to convert meal types from Vietnamese to English
    if (config.data) {
      config.data = MealTypeService.processFrontendRequest(config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and meal type mapping
apiClient.interceptors.response.use(
  (response) => {
    // Process response data to convert meal types from English to Vietnamese
    if (response.data) {
      response.data = MealTypeService.processBackendResponse(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data.data;
          await AsyncStorage.setItem('accessToken', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });
      
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
      console.error('Error during logout:', error);
    }
  },
};

export default apiClient;