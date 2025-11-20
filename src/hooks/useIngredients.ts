import { useState, useEffect, useCallback, useRef } from 'react';
import { ingredientsAPI, IngredientData, ProductMealData } from '../services/ingredientsAPI';

export const useIngredients = () => {
  const [userProducts, setUserProducts] = useState<ProductMealData[]>([]);
  const [loading, setIsLoading] = useState(false);
  
  // Cache để tránh reload không cần thiết
  const productCache = useRef<{ data: ProductMealData[]; timestamp: number } | null>(null);
  const CACHE_DURATION = 5000; // Cache 5 giây
  const lastLoadTimeRef = useRef<number>(0);

  // Load danh sách sản phẩm của user - memoized để tránh re-create
  const loadUserProducts = useCallback(async (forceReload: boolean = false) => {
    // Tránh gọi nhiều lần cùng lúc
    if (loading) {
      return;
    }
    
    // Kiểm tra cache trước
    if (!forceReload && productCache.current) {
      const now = Date.now();
      if (now - productCache.current.timestamp < CACHE_DURATION) {
        setUserProducts(productCache.current.data);
        return; // Sử dụng cache
      }
    }
    
    // Tránh reload quá nhanh (ít nhất 2 giây giữa các lần reload)
    const now = Date.now();
    if (!forceReload && now - lastLoadTimeRef.current < 2000) {
      return;
    }
    lastLoadTimeRef.current = now;
    
    try {
      setIsLoading(true);
      const response = await ingredientsAPI.getUserProductList();
      
      if (response.success && response.data) {
        // Lưu vào cache
        productCache.current = {
          data: response.data,
          timestamp: Date.now()
        };
        setUserProducts(response.data);
      } else {
        // Nếu không có data, set empty array
        setUserProducts([]);
      }
    } catch (error) {
      console.error('Error loading user products:', error);
      setUserProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [loading]); // Thêm loading vào deps để check

  // Load nguyên liệu của một meal cụ thể
  const loadMealIngredients = async (mealId: number): Promise<IngredientData[]> => {
    try {
      const response = await ingredientsAPI.getUserMealIngredients(mealId);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {

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

      return false;
    }
  };

  // Thêm meal vào danh sách sản phẩm
  const addMealToProducts = async (mealId: number, mealName: string, imageUrl?: string, skipReload: boolean = false): Promise<boolean> => {
    try {
      const response = await ingredientsAPI.addMealToProductList(mealId);
      
      if (response.success) {
        // Chỉ reload nếu không skip (khi thêm nhiều món cùng lúc, sẽ reload sau)
        if (!skipReload) {
          await loadUserProducts();
        }
        return true;
      }
      
      console.error('Failed to add meal to product list:', response.message);
      return false;
    } catch (error: any) {
      console.error('Error adding meal to products:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm món ăn vào danh sách sản phẩm';
      console.error('Error details:', errorMessage);
      return false;
    }
  };

  // Thêm nhiều meals vào danh sách sản phẩm cùng lúc (tránh race condition)
  const addMultipleMealsToProducts = async (mealIds: number[], skipReload: boolean = false): Promise<{ success: boolean; addedCount: number }> => {
    try {
      const response = await ingredientsAPI.addMultipleMealsToProductList(mealIds);
      
      if (response.success) {
        // Chỉ reload nếu không skip
        if (!skipReload) {
          await loadUserProducts();
        }
        return { success: true, addedCount: response.addedCount };
      }
      
      console.error('Failed to add meals to product list:', response.message);
      return { success: false, addedCount: 0 };
    } catch (error: any) {
      console.error('Error adding meals to products:', error);
      return { success: false, addedCount: 0 };
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
    addMultipleMealsToProducts,
    removeMealFromProducts,
    isMealInProductList,
    getMissingIngredientsCount,
    getAvailableIngredientsCount,
    markAllIngredients,
    saveMealQuantity,
    getMealQuantity,
  };
};
