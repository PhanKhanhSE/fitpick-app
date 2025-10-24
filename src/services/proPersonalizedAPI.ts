import apiClient from './api';

export interface DeepRecommendation {
  personalizedMessage: string;
  recommendedMeals: RecommendedMeal[];
  nutritionTips: string[];
  goalBasedAdvice: string[];
  progress?: ProgressSummary;
}

export interface RecommendedMeal {
  mealId: number;
  name: string;
  reason: string;
  matchScore: number;
  imageUrl?: string;
  calories?: number;
  mealTimeRecommendation: string;
}

export interface ProgressSummary {
  goalName: string;
  currentWeight: number;
  targetWeight: number;
  weightChange: number;
  daysActive: number;
  averageCaloriesPerDay: number;
  progressPercentage: string;
}

export interface NutritionInsights {
  daysAnalyzed: number;
  averageDailyCalories: number;
  averageDailyProtein: number;
  averageDailyCarbs: number;
  averageDailyFat: number;
  insights: string[];
  trends: NutrientTrend[];
  recommendations: string[];
}

export interface NutrientTrend {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface TimeBasedSuggestions {
  currentMealTime: string;
  suggestions: MealSuggestion[];
  reasonForSuggestions: string;
}

export interface MealSuggestion {
  mealId: number;
  name: string;
  calories: number;
  whySuggested: string;
  imageUrl?: string;
  isQuickPrep: boolean;
  cookingTime: number;
}

export interface MealReminder {
  notificationid: number;
  title?: string;
  message?: string;
  scheduledat?: Date;
  isDone?: boolean;
  isread?: boolean;
}

export const proPersonalizedAPI = {
  // Lấy gợi ý cá nhân hóa chuyên sâu
  getDeepRecommendations: async (): Promise<{
    success: boolean;
    data?: DeepRecommendation;
    message?: string;
  }> => {
    try {
      const response = await apiClient.get('/api/pro-personalized/deep-recommendations');
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error getting deep recommendations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy gợi ý cá nhân hóa',
      };
    }
  },

  // Thiết lập nhắc nhở tự động
  setupMealReminders: async (): Promise<{
    success: boolean;
    data?: MealReminder[];
    message?: string;
  }> => {
    try {
      const response = await apiClient.post('/api/pro-personalized/meal-reminders/auto-setup');
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error setting up meal reminders:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể thiết lập nhắc nhở',
      };
    }
  },

  // Lấy phân tích dinh dưỡng
  getNutritionInsights: async (days: number = 7): Promise<{
    success: boolean;
    data?: NutritionInsights;
    message?: string;
  }> => {
    try {
      const response = await apiClient.get(`/api/pro-personalized/nutrition-insights?days=${days}`);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error getting nutrition insights:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể phân tích dinh dưỡng',
      };
    }
  },

  // Lấy gợi ý theo thời gian
  getTimeBasedSuggestions: async (): Promise<{
    success: boolean;
    data?: TimeBasedSuggestions;
    message?: string;
  }> => {
    try {
      const response = await apiClient.get('/api/pro-personalized/time-based-suggestions');
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error getting time-based suggestions:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy gợi ý món ăn',
      };
    }
  },
};
