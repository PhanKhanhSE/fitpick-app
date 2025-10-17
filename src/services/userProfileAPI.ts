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
  }
};
