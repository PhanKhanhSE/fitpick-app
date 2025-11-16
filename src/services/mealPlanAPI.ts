import apiClient from './apiClient';
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
      const response = await apiClient.get('/api/MealPlans/today');
      
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
      const response = await apiClient.get(`/api/MealPlans/date/${dateString}`);
      
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

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy thực đơn theo ngày' 
      };
    }
  },

  // Thay đổi món theo gợi ý
  replaceMealBySuggestion: async (planId: number): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.put(`/api/MealPlans/replace-by-suggestion/${planId}`);
      
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

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thay đổi món theo gợi ý' 
      };
    }
  },

  // Thay đổi món từ danh sách yêu thích
  replaceMealByFavorites: async (planId: number): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.put(`/api/MealPlans/replace-by-favorites/${planId}`);
      
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

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thay đổi món từ danh sách yêu thích' 
      };
    }
  },

  // Lấy tất cả meal plans của user
  getUserMealPlans: async (): Promise<{ success: boolean; data?: Mealplan[]; message?: string }> => {
    try {
      const response = await apiClient.get('/api/MealPlans/user');
      
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

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách thực đơn' 
      };
    }
  },

  // Tạo meal plan mới
  generateMealPlan: async (date: Date): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      // Format date as YYYY-MM-DD (date only, no time)
      const dateString = date.toISOString().split('T')[0];
      const response = await apiClient.post(`/api/MealPlans/generate?date=${dateString}`);
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      // Get error message from response
      const errorMessage = response.data?.message || 
                          response.data?.errors?.join(', ') || 
                          'Không thể tạo thực đơn';
      
      console.error('Generate meal plan failed:', {
        date: dateString,
        response: response.data
      });
      
      return { 
        success: false, 
        message: errorMessage
      };
    } catch (error: any) {
      const dateString = date.toISOString().split('T')[0];
      console.error('Generate meal plan error:', {
        date: dateString,
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        fullError: error
      });

      // Extract error message from response
      let errorMessage = 'Lỗi khi tạo thực đơn';
      
      if (error.response?.status === 500) {
        // Server error - get message from backend
        errorMessage = error.response?.data?.errors?.join(', ') || 
                      error.response?.data?.message || 
                      'Lỗi server: Vui lòng thử lại sau hoặc liên hệ hỗ trợ';
      } else if (error.response?.status === 400) {
        // Bad request - user error
        errorMessage = error.response?.data?.errors?.join(', ') || 
                      error.response?.data?.message || 
                      'Không thể tạo thực đơn. Vui lòng kiểm tra thông tin của bạn.';
      } else if (error.response?.data) {
        // Other errors with response data
        errorMessage = error.response?.data?.errors?.join(', ') || 
                      error.response?.data?.message || 
                      error.message;
      } else {
        // Network or other errors
        errorMessage = error.message || 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  },

  // Thay đổi món ăn trong plan
  swapMeal: async (planId: number, newMealId: number): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.put(`/api/MealPlans/${planId}/swap?newMealId=${newMealId}`);
      
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

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thay đổi món ăn' 
      };
    }
  },

  // Xóa meal plan
  deleteMealPlan: async (planId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.delete(`/api/MealPlans/${planId}`);
      
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

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi xóa thực đơn' 
      };
    }
  },

  // Thêm món ăn vào thực đơn (lưu vào database)
  addMealToMenu: async (mealId: number, date: Date, mealTime?: string): Promise<{ success: boolean; data?: Mealplan; message?: string }> => {
    try {
      const response = await apiClient.post('/api/MealPlans/add-meal', {
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

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy chi tiết món ăn' 
      };
    }
  },

  // Tạo meal plan cho cả tuần (từ hôm nay đến Chủ nhật)
  generateWeeklyMealPlan: async (startDate: Date, endDate: Date): Promise<{ success: boolean; data?: Mealplan[]; message?: string }> => {
    try {
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
      const response = await apiClient.post(`/api/MealPlans/generate-weekly?startDate=${startDateString}&endDate=${endDateString}`);
      
      if (response.data.success && response.data.data) {
        return { 
          success: true, 
          data: response.data.data,
          message: response.data.message 
        };
      }
      
      const errorMessage = response.data?.message || 
                          response.data?.errors?.join(', ') || 
                          'Không thể tạo thực đơn tuần';
      
      return { 
        success: false, 
        message: errorMessage
      };
    } catch (error: any) {
      console.error('Generate weekly meal plan error:', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        fullError: error
      });

      let errorMessage = 'Lỗi khi tạo thực đơn tuần';
      
      if (error.response?.status === 500) {
        errorMessage = error.response?.data?.errors?.join(', ') || 
                      error.response?.data?.message || 
                      'Lỗi server: Vui lòng thử lại sau hoặc liên hệ hỗ trợ';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.errors?.join(', ') || 
                      error.response?.data?.message || 
                      'Không thể tạo thực đơn tuần. Vui lòng kiểm tra thông tin của bạn.';
      } else if (error.response?.data) {
        errorMessage = error.response?.data?.errors?.join(', ') || 
                      error.response?.data?.message || 
                      error.message;
      } else {
        errorMessage = error.message || 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  }
};
