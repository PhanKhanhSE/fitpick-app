import apiClient from './apiClient';

export interface FilterData {
  id: string;
  name: string;
  vietnameseName?: string;
  englishName?: string;
  maxMinutes?: number;
}

export interface FilterResponse {
  success: boolean;
  data: FilterData[];
  message: string;
}

export const filterAPI = {
  // Get all categories
  getCategories: async (): Promise<FilterResponse> => {
    try {
      const response = await apiClient.get('/api/filter/categories');
      return response.data;
    } catch (error) {

      return {
        success: false,
        data: [],
        message: 'Không thể tải danh mục'
      };
    }
  },

  // Get all ingredients
  getIngredients: async (): Promise<FilterResponse> => {
    try {
      const response = await apiClient.get('/api/filter/ingredients');
      return response.data;
    } catch (error) {

      return {
        success: false,
        data: [],
        message: 'Không thể tải nguyên liệu'
      };
    }
  },

  // Get all diet types
  getDietTypes: async (): Promise<FilterResponse> => {
    try {
      const response = await apiClient.get('/api/filter/diet-types');
      return response.data;
    } catch (error) {

      return {
        success: false,
        data: [],
        message: 'Không thể tải chế độ ăn'
      };
    }
  },

  // Get cooking time ranges
  getCookingTimes: async (): Promise<FilterResponse> => {
    try {
      const response = await apiClient.get('/api/filter/cooking-times');
      return response.data;
    } catch (error) {

      return {
        success: false,
        data: [],
        message: 'Không thể tải thời gian chế biến'
      };
    }
  },

  // Get meal types
  getMealTypes: async (): Promise<FilterResponse> => {
    try {
      const response = await apiClient.get('/api/filter/meal-types');
      return response.data;
    } catch (error) {

      return {
        success: false,
        data: [],
        message: 'Không thể tải loại bữa ăn'
      };
    }
  },

  // Search meals with personal nutrition applied
  searchWithPersonalNutrition: async (filters: any): Promise<FilterResponse> => {
    try {
      const response = await apiClient.post('/api/filter/search-with-nutrition', filters);
      return response.data;
    } catch (error) {

      return {
        success: false,
        data: [],
        message: 'Không thể tìm kiếm với dinh dưỡng cá nhân'
      };
    }
  },

  // Search meals with filters
  searchWithFilters: async (filters: any): Promise<FilterResponse> => {
    try {
      const response = await apiClient.post('/api/filter/search', filters);
      return response.data;
    } catch (error) {

      return {
        success: false,
        data: [],
        message: 'Không thể tìm kiếm với bộ lọc'
      };
    }
  }
};
