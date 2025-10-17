import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API configuration
const API_BASE_URL = 'https://01eea5df5d3c.ngrok-free.app'; // Ngrok URL mới nhất của bạn

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Bỏ qua warning page của ngrok
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log('🔍 Request interceptor - Token:', token ? token.substring(0, 20) + '...' : 'NONE');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('❌ No token found in AsyncStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, refreshToken, {
            headers: { 'Content-Type': 'application/json' }
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        // You can add navigation logic here if needed
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
      console.log('🔍 Register API call:', {
        url: `${API_BASE_URL}/api/auth/register`,
        data: { email, password: '***', confirmPassword: '***' }
      });
      
      const response = await apiClient.post('/api/auth/register', {
        email,
        password,
        confirmPassword,
      });
      
      console.log('✅ Register response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Register error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      // Return more detailed error information
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      console.log('🔍 Login API call:', {
        url: `${API_BASE_URL}/api/auth/login`,
        data: { email, password: '***' }
      });
      
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });
      
      console.log('✅ Login response:', response.data);
      
      const { token, refreshToken, user } = response.data.data;
      
      console.log('🔍 Tokens received:', {
        token: token ? token.substring(0, 20) + '...' : 'NONE',
        refreshToken: refreshToken ? refreshToken.substring(0, 20) + '...' : 'NONE',
        user: user ? 'EXISTS' : 'NONE'
      });
      
      // Store tokens
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Verify tokens are stored
      const storedToken = await AsyncStorage.getItem('accessToken');
      console.log('🔍 Token stored verification:', storedToken ? storedToken.substring(0, 20) + '...' : 'NONE');
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      // Return more detailed error information
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Verify email
  verifyEmail: async (email: string, code: string) => {
    try {
      const response = await apiClient.post('/api/email_verification/verify', {
        email,
        code,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

// Update API base URL (for ngrok)
export const updateAPIBaseURL = (newUrl: string) => {
  apiClient.defaults.baseURL = newUrl;
};

export default apiClient;
