import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealTypeService } from './mealTypeService';
import { Alert } from 'react-native';

// Base URL for API
const API_BASE_URL = 'https://fitpick-be.onrender.com';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Bỏ qua warning page của ngrok
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const user = await AsyncStorage.getItem('user');
    
    // Do not attach Authorization to auth endpoints
    const isAuthEndpoint = (config.url || '').startsWith('/api/auth');
    if (token && !isAuthEndpoint) {
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

// Response interceptor to handle token refresh
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

    // Handle 401 (Unauthorized) and 403 (Forbidden) errors
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, refreshToken, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const authResult = response.data?.data || response.data;
          
          // Check if token is valid before saving - handle different response structures
          const newToken = authResult?.AccessToken || authResult?.accessToken || authResult?.token;
          
          if (newToken && typeof newToken === 'string' && newToken.trim() !== '') {
            await AsyncStorage.setItem('accessToken', newToken);
            
            // Also save refresh token if provided
            if (authResult?.RefreshToken || authResult?.refreshToken) {
              await AsyncStorage.setItem('refreshToken', authResult.RefreshToken || authResult.refreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } else {
            // Invalid token format, clear auth and reject
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userInfo']);
            throw new Error('Invalid token format received from server');
          }
        } else {
          // No refresh token, clear auth
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userInfo']);
          throw new Error('No refresh token available');
        }
      } catch (refreshError: any) {
        // Refresh failed, clear all auth data
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userInfo']).catch(() => {});
        
        // Only show alert if it's not already being handled
        // Don't show alert for "Invalid token" errors as they're expected when token is expired
        const errorMessage = refreshError?.message || '';
        if (!errorMessage.includes('Invalid token')) {
          // Show alert to user about authentication failure
          Alert.alert(
            'Phiên đăng nhập hết hạn',
            'Vui lòng đăng nhập lại để tiếp tục sử dụng ứng dụng.',
            [{ text: 'OK' }]
          );
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
