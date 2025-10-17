import apiClient from './api';

// User Profile API functions
export const profileAPI = {
  // Save user profile information
  saveUserProfile: async (profileData: {
    fullName: string;
    gender: string;
    age: number;
    height: number;
    weight: number;
    targetWeight: number;
  }) => {
    try {
      console.log('🔍 Saving user profile:', profileData);
      
      const response = await apiClient.post('/api/user/profile', profileData);
      
      console.log('✅ Profile saved:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Save profile error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Save user goals
  saveUserGoals: async (goalsData: {
    goal: string;
    otherGoal?: string;
  }) => {
    try {
      console.log('🔍 Saving user goals:', goalsData);
      
      const response = await apiClient.post('/api/user/goals', goalsData);
      
      console.log('✅ Goals saved:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Save goals error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Save user lifestyle
  saveUserLifestyle: async (lifestyleData: {
    activityLevel: string;
  }) => {
    try {
      console.log('🔍 Saving user lifestyle:', lifestyleData);
      
      const response = await apiClient.post('/api/user/lifestyle', lifestyleData);
      
      console.log('✅ Lifestyle saved:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Save lifestyle error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Save user diet plan
  saveUserDietPlan: async (dietData: {
    dietPlan: string;
  }) => {
    try {
      console.log('🔍 Saving user diet plan:', dietData);
      
      const response = await apiClient.post('/api/user/diet-plan', dietData);
      
      console.log('✅ Diet plan saved:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Save diet plan error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Save user cooking level
  saveUserCookingLevel: async (cookingData: {
    cookingLevel: string;
  }) => {
    try {
      console.log('🔍 Saving user cooking level:', cookingData);
      
      const response = await apiClient.post('/api/user/cooking-level', cookingData);
      
      console.log('✅ Cooking level saved:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Save cooking level error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Complete user onboarding
  completeOnboarding: async () => {
    try {
      console.log('🔍 Completing user onboarding...');
      
      const response = await apiClient.post('/api/user/complete-onboarding');
      
      console.log('✅ Onboarding completed:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Complete onboarding error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      console.log('🔍 Getting user profile...');
      
      const response = await apiClient.get('/api/user/profile');
      
      console.log('✅ Profile retrieved:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get profile error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message, type: 'network' };
      } else {
        throw { message: 'Unknown error occurred', type: 'unknown' };
      }
    }
  },
};
