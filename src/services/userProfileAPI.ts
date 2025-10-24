import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';


// API service for user profile and nutrition data
export const userProfileAPI = {
  // Get user profile information
  getUserProfile: async () => {
    try {
      // Backend route: GET /api/users/me
      const response = await apiClient.get('/api/users/me');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  

  // Get user nutrition statistics for a specific date
  getNutritionStats: async (date?: string) => {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get('/api/healthprofiles/user/nutrition-stats', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching nutrition stats:', error);
      // Return mock data if API not available
      if (error.response?.status === 404) {
        return {
          success: true,
          data: {
            targetCalories: 2000,
            consumedCalories: 0,
            starch: { current: 0, target: 100 },
            protein: { current: 0, target: 80 },
            fat: { current: 0, target: 40 }
          }
        };
      }
      throw error;
    }
  },

  // Get user's meals for a specific date
  getUserMeals: async (date?: string) => {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get('/api/user/meals', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user meals:', error);
      // Return empty array if API not available
      if (error.response?.status === 404) {
        return {
          success: true,
          data: []
        };
      }
      throw error;
    }
  },

  // Get user's posts
  getUserPosts: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/api/user/posts', {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user posts:', error);
      // Return empty array if API not available
      if (error.response?.status === 404) {
        return {
          success: true,
          data: []
        };
      }
      throw error;
    }
  },

  // Get detailed nutrition data (sugar, sodium, saturated fat, calcium, vitamin D)
  getDetailedNutritionStats: async (date?: string) => {
    try {
      const params = date ? { date } : {};
      // Currently we reuse the nutrition-stats endpoint (macros + calories)
      const response = await apiClient.get('/api/healthprofiles/user/nutrition-stats', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching detailed nutrition stats:', error);
      // Return mock data if API not available
      if (error.response?.status === 404) {
        return {
          success: true,
          data: {
            sugar: { current: 0, target: 50, unit: "g" },
            sodium: { current: 0, target: 2300, unit: "mg" },
            saturatedFat: { current: 0, target: 20, unit: "g" },
            calcium: { current: 0, target: 1000, unit: "mg" },
            vitaminD: { current: 0, target: 600, unit: "IU" }
          }
        };
      }
      throw error;
    }
  },

  // Get user's nutrition goals
  getNutritionGoals: async () => {
    try {
      // Backend route: GET /api/healthprofiles/user/goal
      const response = await apiClient.get('/api/healthprofiles/user/goal');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching nutrition goals:', error);
      throw error;
    }
  },

  // Update user nutrition goals
  updateNutritionGoals: async (goals: any) => {
    try {
      const response = await apiClient.put('/api/user/nutrition-goals', goals);
      return response.data;
    } catch (error: any) {
      console.error('Error updating nutrition goals:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await apiClient.put('/api/user/profile', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.post('/api/user/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Forgot password - send verification code
  sendForgotPasswordCode: async (email: string) => {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', {
        email
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending forgot password code:', error);
      throw error;
    }
  },

  // Verify forgot password code
  verifyForgotPasswordCode: async (email: string, code: string) => {
    try {
      const response = await apiClient.post('/api/auth/verify-forgot-password-code', {
        email,
        code
      });
      return response.data;
    } catch (error: any) {
      console.error('Error verifying forgot password code:', error);
      throw error;
    }
  },

  // Reset password with new password
  resetPassword: async (email: string, code: string, newPassword: string) => {
    try {
      const response = await apiClient.post('/api/auth/reset-password', {
        email,
        code,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Get current user profile (includes goals, diet plan if available)
  getCurrentUserProfile: async () => {
    try {
      // Backend route: GET /api/users/me
      const response = await apiClient.get('/api/users/me');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  },

  // Update user profile using /api/users/me/update-profile endpoint
  updateUserProfile: async (profileData: any) => {
    try {
      const response = await apiClient.put('/api/users/me/update-profile', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Change password using /api/users/me/change-Password endpoint
  changeUserPassword: async (newPassword: string) => {
    try {
      const response = await apiClient.put('/api/users/me/change-Password', newPassword, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Test avatar upload function using axios with different config
  testAvatarUpload: async (avatarFile: any) => {
    try {
      console.log('🔍 Test Avatar file info:', {
        uri: avatarFile.uri,
        type: avatarFile.type,
        name: avatarFile.name
      });
      
      // Create FormData for React Native
      const formData = new FormData();
      
      // Handle iOS file URI (remove file:// prefix)
      const fileUri = avatarFile.uri.startsWith('file://') 
        ? avatarFile.uri.replace('file://', '') 
        : avatarFile.uri;
      
      console.log('🔍 File URI:', fileUri);
      console.log('🔍 File type:', avatarFile.type);
      console.log('🔍 File name:', avatarFile.name);
      
      // Append file with proper format for React Native
      formData.append('Avatar', {
        uri: fileUri,
        type: avatarFile.type || 'image/jpeg',
        name: avatarFile.name || 'avatar.jpg',
      } as any);
      
      console.log('🔍 FormData created, sending test request with axios...');
      
      // Use axios with different config
      const response = await apiClient.post('/api/users/me/avatar-test', formData, {
        headers: {
          // Don't set Content-Type, let axios handle it
        },
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      
      console.log('✅ Test upload response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error in test upload:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  // Simple avatar upload function using fetch
  changeUserAvatar: async (avatarFile: any) => {
    try {
      console.log('🔍 Avatar file info:', {
        uri: avatarFile.uri,
        type: avatarFile.type,
        name: avatarFile.name
      });
      
      // Get token
      const token = await AsyncStorage.getItem('accessToken');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Create FormData for React Native
      const formData = new FormData();
      
      // Handle iOS file URI (remove file:// prefix)
      const fileUri = avatarFile.uri.startsWith('file://') 
        ? avatarFile.uri.replace('file://', '') 
        : avatarFile.uri;
      
      console.log('🔍 File URI:', fileUri);
      console.log('🔍 File type:', avatarFile.type);
      console.log('🔍 File name:', avatarFile.name);
      
      // Append file with proper format for React Native
      formData.append('Avatar', {
        uri: fileUri,
        type: avatarFile.type || 'image/jpeg',
        name: avatarFile.name || 'avatar.jpg',
      } as any);
      
      console.log('🔍 FormData created, sending request with fetch...');
      
      // Use fetch instead of axios
      const response = await fetch('https://cecily-unantagonising-unadjustably.ngrok-free.dev/api/users/me/avatar-simple', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let fetch handle it
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Fetch error response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('✅ Avatar upload response:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Error changing avatar:', error);
      throw error;
    }
  },

  // Deactivate account (soft delete) using /api/users/me endpoint
  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/api/users/me');
      return response.data;
    } catch (error: any) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  }
};

// Settings API functions
export const settingsAPI = {
  // Get privacy policy
  getPrivacyPolicy: async () => {
    try {
      const response = await apiClient.get('/api/settings/privacy-policy');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching privacy policy:', error);
      throw error;
    }
  },

  // Get terms of service
  getTermsOfService: async () => {
    try {
      const response = await apiClient.get('/api/settings/terms-of-service');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching terms of service:', error);
      throw error;
    }
  },

  // Update profile using settings endpoint
  updateProfile: async (profileData: any) => {
    try {
      const response = await apiClient.put('/api/settings/update-profile', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Change password using settings endpoint
  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.put('/api/settings/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};
