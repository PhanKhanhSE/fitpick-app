import { useState, useEffect } from 'react';
import { ingredientsAPI, IngredientData, ProductMealData } from '../services/ingredientsAPI';

export const useIngredients = () => {
  const [userProducts, setUserProducts] = useState<ProductMealData[]>([]);
  const [loading, setIsLoading] = useState(false);

  // Load danh sách sản phẩm của user
  const loadUserProducts = async () => {
    try {
      setIsLoading(true);
      const response = await ingredientsAPI.getUserProductList();
      
      if (response.success && response.data) {
        setUserProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading user products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load nguyên liệu của một meal cụ thể
  const loadMealIngredients = async (mealId: number): Promise<IngredientData[]> => {
    try {
      const response = await ingredientsAPI.getUserMealIngredients(mealId);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error loading meal ingredients:', error);
      return [];
    }
  };

  // Toggle trạng thái nguyên liệu (có/chưa có)
  const toggleIngredient = async (mealId: number, ingredientId: number, hasIt: boolean): Promise<boolean> => {
    try {
      const response = await ingredientsAPI.markIngredient(mealId, ingredientId, hasIt);
      
      if (response.success) {
        // Cập nhật local state nếu cần
        setUserProducts(prev => 
          prev.map(product => 
            product.mealId === mealId 
              ? {
                  ...product,
                  ingredients: product.ingredients.map(ingredient =>
                    ingredient.ingredientId === ingredientId
                      ? { ...ingredient, hasIt }
                      : ingredient
                  )
                }
              : product
          )
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling ingredient:', error);
      return false;
    }
  };

  // Thêm meal vào danh sách sản phẩm
  const addMealToProducts = async (mealId: number, mealName: string, imageUrl?: string): Promise<boolean> => {
    try {
      const response = await ingredientsAPI.addMealToProductList(mealId);
      
      if (response.success) {
        // Load nguyên liệu của meal mới
        const ingredients = await loadMealIngredients(mealId);
        
        // Thêm vào local state
        const newProduct: ProductMealData = {
          mealId,
          mealName,
          imageUrl,
          ingredients,
        };
        
        setUserProducts(prev => [...prev, newProduct]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding meal to products:', error);
      return false;
    }
  };

  // Xóa meal khỏi danh sách sản phẩm
  const removeMealFromProducts = async (mealId: number): Promise<boolean> => {
    try {
      const response = await ingredientsAPI.removeMealFromProductList(mealId);
      
      if (response.success) {
        // Xóa khỏi local state
        setUserProducts(prev => prev.filter(product => product.mealId !== mealId));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error removing meal from products:', error);
      return false;
    }
  };

  // Kiểm tra xem meal đã có trong product list chưa
  const isMealInProductList = (mealId: number): boolean => {
    return userProducts.some(product => product.mealId === mealId);
  };

  // Lấy tổng số nguyên liệu chưa có
  const getMissingIngredientsCount = (mealId: number): number => {
    const product = userProducts.find(p => p.mealId === mealId);
    if (!product) return 0;
    
    return product.ingredients.filter(ingredient => !ingredient.hasIt).length;
  };

  // Lấy tổng số nguyên liệu đã có
  const getAvailableIngredientsCount = (mealId: number): number => {
    const product = userProducts.find(p => p.mealId === mealId);
    if (!product) return 0;
    
    return product.ingredients.filter(ingredient => ingredient.hasIt).length;
  };

  // Đánh dấu tất cả nguyên liệu của một meal
  const markAllIngredients = async (mealId: number, hasIt: boolean): Promise<boolean> => {
    try {
      const response = await ingredientsAPI.markAllIngredients(mealId, hasIt);
      
      if (response.success) {
        // Cập nhật local state
        setUserProducts(prev => 
          prev.map(product => 
            product.mealId === mealId 
              ? {
                  ...product,
                  ingredients: product.ingredients.map(ingredient => ({
                    ...ingredient,
                    hasIt
                  }))
                }
              : product
          )
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking all ingredients:', error);
      return false;
    }
  };

  useEffect(() => {
    loadUserProducts();
  }, []);

  // Lưu số lượng meal
  const saveMealQuantity = async (mealId: number, quantity: number): Promise<void> => {
    await ingredientsAPI.saveMealQuantity(mealId, quantity);
    // Trigger reload để đồng bộ với ProductScreen
    loadUserProducts();
  };

  // Lấy số lượng meal
  const getMealQuantity = async (mealId: number): Promise<number> => {
    return await ingredientsAPI.getMealQuantity(mealId);
  };

  return {
    userProducts,
    loading,
    loadUserProducts,
    loadMealIngredients,
    toggleIngredient,
    addMealToProducts,
    removeMealFromProducts,
    isMealInProductList,
    getMissingIngredientsCount,
    getAvailableIngredientsCount,
    markAllIngredients,
    saveMealQuantity,
    getMealQuantity,
  };
};
