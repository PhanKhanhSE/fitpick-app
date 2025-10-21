import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface cho TodayMealPlanDto từ backend
export interface TodayMealPlanDto {
  planId: number;
  date: string;
  mealTime: string;
  meal: MealDto;
}

// Interface cho MealDto từ backend
export interface MealDto {
  mealid: number;
  name: string;
  description?: string;
  calories?: number;
  protein: number;
  carbs: number;
  fat: number;
  cookingtime?: number;
  diettype?: string;
  price?: number;
  imageUrl?: string;
  isPremium?: boolean;
  categoryName?: string;
  statusName?: string;
  instructions?: string[];
  ingredients?: MealIngredientDto[];
}

// Interface cho MealIngredientDto
export interface MealIngredientDto {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  hasIt: boolean;
}

// Interface cho Mealplan entity
export interface Mealplan {
  planid: number;
  userid?: number;
  date: string;
  mealid?: number;
  mealtimeId?: number;
  statusId?: number;
  meal?: MealDto;
  mealtime?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
}

// Interface cho API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export const mealPlanAPI = {
  // Lấy thực đơn hôm nay
  getTodayMealPlan: async (): Promise<{ success: boolean; data?: TodayMealPlanDto[]; message?: string }> => {
    try {
      const response = await apiClient.get('/api/mealplans/today');
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể lấy thực đơn hôm nay' 
      };
    } catch (error: any) {
      console.error('Error fetching today meal plan:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy thực đơn hôm nay' 
      };
    }
  },

  // Lấy thực đơn theo ngày cụ thể
  getMealPlanByDate: async (date: Date): Promise<{ success: boolean; data?: TodayMealPlanDto[]; message?: string }> => {
    try {
      const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const response = await apiClient.get(`/api/mealplans/date/${dateString}`);
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || `Không thể lấy thực đơn ngày ${dateString}` 
      };
    } catch (error: any) {
      console.error('Error fetching meal plan by date:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy thực đơn theo ngày' 
      };
    }
  },

  // Thay đổi món theo gợi ý
  replaceMealBySuggestion: async (planId: number): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.put(`/api/mealplans/replace-by-suggestion/${planId}`);
      
      if (response.data.success) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể thay đổi món theo gợi ý' 
      };
    } catch (error: any) {
      console.error('Error replacing meal by suggestion:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thay đổi món theo gợi ý' 
      };
    }
  },

  // Thay đổi món từ danh sách yêu thích
  replaceMealByFavorites: async (planId: number): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.put(`/api/mealplans/replace-by-favorites/${planId}`);
      
      if (response.data.success) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể thay đổi món từ danh sách yêu thích' 
      };
    } catch (error: any) {
      console.error('Error replacing meal by favorites:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thay đổi món từ danh sách yêu thích' 
      };
    }
  },

  // Lấy tất cả meal plans của user
  getUserMealPlans: async (): Promise<{ success: boolean; data?: Mealplan[]; message?: string }> => {
    try {
      const response = await apiClient.get('/api/mealplans/user');
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể lấy danh sách thực đơn' 
      };
    } catch (error: any) {
      console.error('Error fetching user meal plans:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách thực đơn' 
      };
    }
  },

  // Tạo meal plan mới
  generateMealPlan: async (date: Date): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.post(`/api/mealplans/generate?date=${date.toISOString()}`);
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể tạo thực đơn' 
      };
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi tạo thực đơn' 
      };
    }
  },

  // Thay đổi món ăn trong plan
  swapMeal: async (planId: number, newMealId: number): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.put(`/api/mealplans/${planId}/swap?newMealId=${newMealId}`);
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể thay đổi món ăn' 
      };
    } catch (error: any) {
      console.error('Error swapping meal:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thay đổi món ăn' 
      };
    }
  },

  // Xóa meal plan
  deleteMealPlan: async (planId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.delete(`/api/mealplans/${planId}`);
      
      if (response.data.success) {
        return { 
          success: true, 
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể xóa thực đơn' 
      };
    } catch (error: any) {
      console.error('Error deleting meal plan:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi xóa thực đơn' 
      };
    }
  },

  // Thêm món ăn vào thực đơn (lưu vào database)
  addMealToMenu: async (mealId: number, date: Date, mealTime?: string): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.post('/api/mealplans/add-meal', {
        mealId: mealId,
        date: date.toISOString(),
        mealTime: mealTime || 'breakfast'
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      }

      return {
        success: false,
        message: response.data.message || 'Không thể thêm món ăn vào thực đơn'
      };
    } catch (error: any) {
      console.error('Error adding meal to menu:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi thêm món ăn vào thực đơn'
      };
    }
  },

  // Lấy chi tiết món ăn
  getMealDetail: async (mealId: number): Promise<{ success: boolean; data?: MealDto; message?: string }> => {
    try {
      const response = await apiClient.get(`/api/users/meals/${mealId}`);
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Không thể lấy chi tiết món ăn' 
      };
    } catch (error: any) {
      console.error('Error fetching meal detail:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy chi tiết món ăn' 
      };
    }
  }
};
