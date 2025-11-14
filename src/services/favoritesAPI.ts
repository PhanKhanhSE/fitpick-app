import apiClient from './apiClient';

// Interface for favorite meal data
export interface FavoriteMeal {
  mealId: number;
  mealName: string;
  isFavorite: boolean;
  rating?: number;
  comment?: string;
  updatedAt?: string;
}

// Interface for meal data with additional info
export interface FavoriteMealWithDetails {
  mealId: number;
  name: string;
  description?: string;
  calories?: number;
  cookingTime?: number;
  dietType?: string;
  price?: number;
  imageUrl?: string;
  isPremium?: boolean;
  categoryName?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  isFavorite: boolean;
  rating?: number;
  comment?: string;
  updatedAt?: string;
}

// API service for favorites functionality
export const favoritesAPI = {
  // Get user's favorite meals
  getFavorites: async (): Promise<{ success: boolean; data?: FavoriteMeal[]; message?: string }> => {
    try {
      const response = await apiClient.get('/api/favorites');
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Add meal to favorites
  addFavorite: async (mealId: number): Promise<{ success: boolean; data?: string; message?: string }> => {
    try {
      const response = await apiClient.post(`/api/favorites/${mealId}`);
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Remove meal from favorites
  removeFavorite: async (mealId: number): Promise<{ success: boolean; data?: string; message?: string }> => {
    try {
      const response = await apiClient.delete(`/api/favorites/${mealId}`);
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Toggle favorite status (add if not favorite, remove if favorite)
  toggleFavorite: async (mealId: number, isCurrentlyFavorite: boolean): Promise<{ success: boolean; data?: string; message?: string }> => {
    try {
      if (isCurrentlyFavorite) {
        return await favoritesAPI.removeFavorite(mealId);
      } else {
        return await favoritesAPI.addFavorite(mealId);
      }
    } catch (error: any) {

      throw error;
    }
  },

  // Check if meal is favorite (useful for meal cards)
  isFavorite: async (mealId: number): Promise<boolean> => {
    try {
      const favorites = await favoritesAPI.getFavorites();
      if (favorites.success && favorites.data) {
        return favorites.data.some(fav => fav.mealId === mealId);
      }
      return false;
    } catch (error: any) {

      return false;
    }
  },

  // Get favorites with full meal details
  getFavoritesWithDetails: async (): Promise<{ success: boolean; data?: FavoriteMealWithDetails[]; message?: string }> => {
    try {
      // First get the list of favorite meal IDs
      const favoritesResponse = await favoritesAPI.getFavorites();
      
      if (!favoritesResponse.success || !favoritesResponse.data || favoritesResponse.data.length === 0) {
        return { success: true, data: [] };
      }

      // Get detailed information for each favorite meal
      const mealDetailsPromises = favoritesResponse.data.map(async (fav: FavoriteMeal) => {
        try {
          const mealDetailResponse = await apiClient.get(`/api/mealdetail/${fav.mealId}`);
          if (mealDetailResponse.data.success && mealDetailResponse.data.data) {
            const mealDetail = mealDetailResponse.data.data;
            return {
              mealId: fav.mealId,
              name: mealDetail.name || fav.mealName,
              description: mealDetail.description,
              calories: mealDetail.calories,
              cookingTime: mealDetail.cookingtime,
              dietType: mealDetail.diettype,
              price: mealDetail.price,
              imageUrl: mealDetail.imageUrl,
              isPremium: mealDetail.isPremium,
              categoryName: mealDetail.categoryName,
              protein: mealDetail.protein,
              carbs: mealDetail.carbs,
              fat: mealDetail.fat,
              isFavorite: true,
              rating: fav.rating,
              comment: fav.comment,
              updatedAt: fav.updatedAt,
            } as FavoriteMealWithDetails;
          }
        } catch (error) {

          // Return basic info if detail fetch fails
          return {
            mealId: fav.mealId,
            name: fav.mealName,
            calories: 0,
            cookingTime: 0,
            imageUrl: 'https://via.placeholder.com/200x150',
            isFavorite: true,
            rating: fav.rating,
            comment: fav.comment,
            updatedAt: fav.updatedAt,
          } as FavoriteMealWithDetails;
        }
      });

      const mealDetails = await Promise.all(mealDetailsPromises);
      const validMealDetails = mealDetails.filter(detail => detail !== undefined);
      
      return { success: true, data: validMealDetails };
    } catch (error: any) {

      throw error;
    }
  },
};
