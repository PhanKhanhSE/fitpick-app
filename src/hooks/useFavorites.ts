import { useState, useEffect } from 'react';
import { favoritesAPI, FavoriteMeal } from '../services/favoritesAPI';

// Hook để quản lý favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites từ API
  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await favoritesAPI.getFavorites();
      
      if (response.success && response.data) {
        const favoriteIds = response.data.map((fav: FavoriteMeal) => fav.mealId.toString());
        setFavorites(favoriteIds);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (mealId: number) => {
    try {
      const mealIdString = mealId.toString();
      const isCurrentlyFavorite = favorites.includes(mealIdString);
      const response = await favoritesAPI.toggleFavorite(mealId, isCurrentlyFavorite);
      
      if (response.success) {
        if (isCurrentlyFavorite) {
          setFavorites(prev => prev.filter(id => id !== mealIdString));
        } else {
          setFavorites(prev => [...prev, mealIdString]);
        }
        return true;
      }
      return false;
    } catch (error) {

      return false;
    }
  };

  // Remove favorite (for deletion from favorites screen)
  const removeFavorite = async (mealId: number) => {
    try {
      const response = await favoritesAPI.removeFavorite(mealId);
      
      if (response.success) {
        const mealIdString = mealId.toString();
        setFavorites(prev => prev.filter(id => id !== mealIdString));
        return true;
      }
      return false;
    } catch (error) {

      return false;
    }
  };

  // Remove multiple favorites
  const removeMultipleFavorites = async (mealIds: number[]) => {
    try {
      const deletePromises = mealIds.map(mealId => favoritesAPI.removeFavorite(mealId));
      const results = await Promise.all(deletePromises);
      
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        const mealIdStrings = mealIds.map(id => id.toString());
        setFavorites(prev => prev.filter(id => !mealIdStrings.includes(id)));
        return true;
      }
      return false;
    } catch (error) {

      return false;
    }
  };

  // Check if meal is favorite
  const isFavorite = (mealId: number): boolean => {
    return favorites.includes(mealId.toString());
  };

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    isLoading,
    loadFavorites,
    toggleFavorite,
    removeFavorite,
    removeMultipleFavorites,
    isFavorite,
  };
};
