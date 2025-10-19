import apiClient from './api';

// API service for user profile and nutrition data
export const userProfileAPI = {
  // Get user profile information
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/user/profile');
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
      const response = await apiClient.get('/api/user/nutrition-stats', { params });
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
      const response = await apiClient.get('/api/user/detailed-nutrition-stats', { params });
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
      const response = await apiClient.get('/api/user/nutrition-goals');
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

  // Get user profile from /api/user/profile endpoint (includes goals, diet plan, etc.)
  getCurrentUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/user/profile');
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

  // Change avatar using /api/users/me/avatar endpoint
  changeUserAvatar: async (avatarFile: any) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await apiClient.put('/api/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error changing avatar:', error);
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
