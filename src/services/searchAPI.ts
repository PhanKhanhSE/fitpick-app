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
  // Search meals with filters
  searchMeals: async (filters: SearchFilters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.name) params.append('name', filters.name);
      if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
      if (filters.dietType) params.append('dietType', filters.dietType);
      if (filters.minCalories) params.append('minCalories', filters.minCalories.toString());
      if (filters.maxCalories) params.append('maxCalories', filters.maxCalories.toString());
      if (filters.minCookingTime) params.append('minCookingTime', filters.minCookingTime.toString());
      if (filters.maxCookingTime) params.append('maxCookingTime', filters.maxCookingTime.toString());
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      const url = `/api/users/meals?${params.toString()}`;
      console.log('🔍 Debug - Search API URL:', url);
      console.log('🔍 Debug - Search filters:', filters);

      const response = await apiClient.get(url);
      console.log('🔍 Debug - Search API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error searching meals:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  // Get meal by ID
  getMealById: async (mealId: number) => {
    try {
      const response = await apiClient.get(`/api/users/meals/${mealId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching meal details:', error);
      throw error;
    }
  },

  // Get popular meals (no filters)
  getPopularMeals: async () => {
    try {
      const response = await apiClient.get('/api/users/meals');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching popular meals:', error);
      throw error;
    }
  },

  // Get suggested meals based on user profile
  getSuggestedMeals: async () => {
    try {
      // For now, return popular meals. Later can be enhanced with AI recommendations
      const response = await apiClient.get('/api/users/meals');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching suggested meals:', error);
      throw error;
    }
  },

  // Get premium meals (for premium users)
  getPremiumMeals: async () => {
    try {
      const response = await apiClient.get('/api/users/meals/premium');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching premium meals:', error);
      throw error;
    }
  },

  // Search with text query
  searchByText: async (searchText: string) => {
    try {
      const response = await apiClient.get(`/api/users/meals?name=${encodeURIComponent(searchText)}`);
      return response.data;
    } catch (error: any) {
      console.error('Error searching by text:', error);
      throw error;
    }
  },

  // Get meal detail with ingredients and instructions
  getMealDetail: async (mealId: number) => {
    try {
      const response = await apiClient.get(`/api/mealdetail/${mealId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching meal detail:', error);
      throw error;
    }
  }
};

export default searchAPI;
