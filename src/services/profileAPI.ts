import apiClient from './api';

// Profile API functions
export const profileAPI = {
  // Save user profile
  saveUserProfile: async (profileData: {
    fullName: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    targetWeight: number;
  }) => {
    try {
      const response = await apiClient.post('/api/user/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Save user goals
  saveUserGoals: async (goalsData: {
    goal: string;
    otherGoal?: string;
  }) => {
    try {
      const response = await apiClient.post('/api/user/goals', goalsData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Save user lifestyle
  saveUserLifestyle: async (lifestyleData: {
    activityLevel: string;
  }) => {
    try {
      const response = await apiClient.post('/api/user/lifestyle', lifestyleData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Save user diet plan
  saveUserDietPlan: async (dietData: {
    dietPlan: string;
  }) => {
    try {
      const response = await apiClient.post('/api/user/diet-plan', dietData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Save user cooking level
  saveUserCookingLevel: async (cookingData: {
    cookingLevel: string;
  }) => {
    try {
      const response = await apiClient.post('/api/user/cooking-level', cookingData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Complete user onboarding
  completeOnboarding: async () => {
    try {
      const response = await apiClient.post('/api/user/complete-onboarding');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/user/profile');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};