import apiClient from './apiClient';

// Interface for search filters
export interface SearchFilters {
  name?: string;
  categoryId?: number;
  dietType?: string;
  minCalories?: number;
  maxCalories?: number;
  minCookingTime?: number;
  maxCookingTime?: number;
  minPrice?: number;
  maxPrice?: number;
}

// Interface for meal data
export interface MealData {
  mealid: number;
  name: string;
  description?: string;
  calories?: number;
  cookingtime?: number;
  diettype?: string;
  price?: number;
  imageUrl?: string;
  isPremium?: boolean;
  categoryName?: string;
  statusName?: string;
  instructions?: string[];
  protein?: number;
  carbs?: number;
  fat?: number;
}

// Interface cho meal detail
export interface MealDetailData {
  mealid: number;
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  cookingtime?: number;
  diettype?: string;
  price?: number;
  imageUrl?: string;
  isPremium?: boolean;
  categoryName?: string;
  statusName?: string;
  ingredients?: MealIngredientDetail[];
  instructions?: MealInstruction[];
  tags?: string[];
}

export interface MealIngredientDetail {
  ingredientId?: number;
  ingredientName: string;
  ingredientType?: string;
  quantity?: number;
  unit?: string;
}

export interface MealInstruction {
  mealId?: number;
  stepNumber: number;
  instruction: string;
}

// API service for search functionality
export const searchAPI = {
  // Search meals with filters - Using /api/users/meals (GET) with name filter
  searchMeals: async (filters: SearchFilters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.name) {
        params.append('name', filters.name);
      }
      if (filters.categoryId) {
        params.append('categoryId', filters.categoryId.toString());
      }
      if (filters.dietType) {
        params.append('dietType', filters.dietType);
      }
      if (filters.minCalories) {
        params.append('minCalories', filters.minCalories.toString());
      }
      if (filters.maxCalories) {
        params.append('maxCalories', filters.maxCalories.toString());
      }
      if (filters.minCookingTime) {
        params.append('minCookingTime', filters.minCookingTime.toString());
      }
      if (filters.maxCookingTime) {
        params.append('maxCookingTime', filters.maxCookingTime.toString());
      }
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString());
      }

      const url = `/api/users/meals?${params.toString()}`;
      console.log('🔍 Search meals URL:', url);

      const response = await apiClient.get(url);
      console.log('🔍 Search meals response:', response.data);
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        // Response is directly an array
        return {
          success: true,
          data: response.data,
          message: `Tìm thấy ${response.data.length} món ăn`
        };
      } else if (response.data && response.data.data) {
        // Response has data property
        return {
          success: response.data.success !== false,
          data: Array.isArray(response.data.data) ? response.data.data : [],
          message: response.data.message || 'Tìm kiếm thành công'
        };
      } else if (response.data && response.data.success !== undefined) {
        // Response has success property
        return {
          success: response.data.success,
          data: Array.isArray(response.data.data) ? response.data.data : [],
          message: response.data.message || 'Tìm kiếm thành công'
        };
      }
      
      // Default return
      return {
        success: true,
        data: [],
        message: 'Không tìm thấy kết quả'
      };
    } catch (error: any) {
      console.error('❌ Search meals error:', error.response?.data || error.message);
      // Return empty response structure instead of throwing
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Không thể tìm kiếm món ăn'
      };
    }
  },

  // Get meal by ID
  getMealById: async (mealId: number) => {
    try {
      const response = await apiClient.get(`/api/users/meals/${mealId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get popular meals (most frequently used in meal plans and meal histories)
  getPopularMeals: async (limit: number = 20) => {
    try {
      const response = await apiClient.get(`/api/Filter/popular-meals?limit=${limit}`);
      console.log('📊 Popular meals API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Popular meals API error:', error.response?.data || error.message);
      // Return empty response structure instead of throwing
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Không thể tải món phổ biến'
      };
    }
  },

  // Get suggested meals based on user profile
  getSuggestedMeals: async (limit: number = 10) => {
    try {
      const response = await apiClient.get(`/api/Filter/suggested-meals?limit=${limit}`);
      console.log('💡 Suggested meals API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Suggested meals API error:', error.response?.data || error.message);
      // Try fallback to popular meals if suggested-meals API fails
      try {
        console.log('🔄 Trying fallback to popular meals...');
        const fallbackResponse = await apiClient.get(`/api/Filter/popular-meals?limit=${limit}`);
        return fallbackResponse.data;
      } catch (fallbackError: any) {
        console.error('❌ Fallback also failed:', fallbackError.response?.data || fallbackError.message);
        // Return empty response structure instead of throwing
        return {
          success: false,
          data: [],
          message: error.response?.data?.message || 'Không thể tải món gợi ý'
        };
      }
    }
  },

  // Get premium meals (for premium users)
  getPremiumMeals: async () => {
    try {
      const response = await apiClient.get('/api/users/meals/premium');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Search with text query
  searchByText: async (searchText: string) => {
    try {
      const response = await apiClient.get(`/api/users/meals?name=${encodeURIComponent(searchText)}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get meal detail with ingredients and instructions
  getMealDetail: async (mealId: number) => {
    try {
      const response = await apiClient.get(`/api/mealdetail/${mealId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};

export default searchAPI;
