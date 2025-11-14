import apiClient from './apiClient';

// Interface cho Meal History
export interface MealHistoryDto {
  historyid: number;
  mealid: number;
  mealtimeId: number;
  date: string;
  quantity: number;
  unit: string;
  calories: number;
  createdat: string;
  meal?: {
    mealid: number;
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  mealtime?: {
    id: number;
    name: string;
  };
}

// Interface cho Detailed Daily Stats
export interface DetailedDailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalMeals: number;
  mealsByTime: Array<{
    mealTime: string;
    calories: number;
    count: number;
  }>;
  mealHistories: Array<{
    historyid: number;
    mealid: number;
    mealName: string;
    mealTime: string;
    quantity: number;
    calories: number;
    createdat: string;
  }>;
}

// Interface cho Meal Eaten Check
export interface MealEatenCheck {
  isEaten: boolean;
  mealHistory: MealHistoryDto | null;
}

// Interface cho tạo Meal History
export interface CreateMealHistoryDto {
  mealid: number;
  mealtimeId: number;
  date: string;
  quantity: number;
  unit: string;
  calories: number;
}

// Interface cho response tạo Meal History
export interface MealHistoryResponseDto {
  historyid: number;
  mealid: number;
  mealtimeId: number;
  date: string;
  quantity: number;
  unit: string;
  calories: number;
}

// Interface cho API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export const mealHistoryAPI = {
  // Lấy tất cả meal history của user
  getUserMealHistory: async (): Promise<MealHistoryDto[]> => {
    try {
      const response = await apiClient.get('/api/meal-histories');
      return response.data.data;
    } catch (error) {

      throw error;
    }
  },

  // Tạo meal history mới (đánh dấu đã ăn)
  createMealHistory: async (mealData: CreateMealHistoryDto): Promise<MealHistoryResponseDto> => {
    try {
      const response = await apiClient.post('/api/meal-histories', mealData);
      return response.data.data;
    } catch (error) {

      throw error;
    }
  },

  // Xóa meal history (bỏ đánh dấu đã ăn)
  deleteMealHistory: async (historyId: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/meal-histories/${historyId}`);
    } catch (error) {

      throw error;
    }
  },

  // Lấy thống kê dinh dưỡng theo ngày
  getDailyStats: async (date: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/meal-histories/stats?date=${date}`);
      return response.data.data;
    } catch (error) {

      throw error;
    }
  },

  // Lấy meal history theo ngày cụ thể
  getMealHistoryByDate: async (date: string): Promise<MealHistoryDto[]> => {
    try {
      const response = await apiClient.get(`/api/meal-histories/by-date?date=${date}`);
      return response.data.data;
    } catch (error) {

      throw error;
    }
  },

  // Lấy thống kê dinh dưỡng chi tiết theo ngày
  getDetailedDailyStats: async (date: string): Promise<DetailedDailyStats> => {
    try {
      const response = await apiClient.get(`/api/meal-histories/detailed-stats?date=${date}`);
      return response.data.data;
    } catch (error) {

      throw error;
    }
  },

  // Kiểm tra xem meal đã được ăn trong ngày chưa (API call)
  checkMealEaten: async (mealId: number, date?: string): Promise<MealEatenCheck> => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const response = await apiClient.get(`/api/meal-histories/check-eaten?mealId=${mealId}&date=${targetDate}`);
      return response.data.data;
    } catch (error) {

      return { isEaten: false, mealHistory: null };
    }
  },

  // Kiểm tra xem meal đã được ăn trong ngày chưa (local check)
  isMealEatenToday: async (mealId: number, date?: string): Promise<boolean> => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const history = await mealHistoryAPI.getUserMealHistory();
      
      return history.some(h => 
        h.mealid === mealId && 
        h.date === targetDate
      );
    } catch (error) {

      return false;
    }
  },

  // Đánh dấu meal đã ăn
  markMealAsEaten: async (
    mealId: number, 
    calories: number, 
    quantity: number = 1,
    mealTimeId: number = 1, // Default: breakfast
    date?: string
  ): Promise<MealHistoryResponseDto> => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      const mealHistoryData: CreateMealHistoryDto = {
        mealid: mealId,
        mealtimeId: mealTimeId,
        date: targetDate,
        quantity: quantity,
        unit: 'portion',
        calories: calories * quantity, // Tính calo theo số lượng
      };

      return await mealHistoryAPI.createMealHistory(mealHistoryData);
    } catch (error) {

      throw error;
    }
  },
};
