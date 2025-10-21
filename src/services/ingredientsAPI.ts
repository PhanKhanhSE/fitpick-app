import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface cho nguyên liệu của meal
export interface IngredientData {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  hasIt: boolean; // Mặc định false khi mới add meal
}

// Interface cho meal trong product list
export interface ProductMealData {
  mealId: number;
  mealName: string;
  imageUrl?: string;
  ingredients: IngredientData[];
}

// Interface cho request mark ingredient
export interface MarkIngredientRequest {
  mealId: number;
  ingredientId: number;
  hasIt: boolean;
}

// Interface cho response từ API
export interface UserMealIngredientResponse {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  hasIt: boolean;
}

export const ingredientsAPI = {
  // Lấy danh sách nguyên liệu của một meal với trạng thái hasIt
  getUserMealIngredients: async (mealId: number): Promise<{ success: boolean; data?: IngredientData[]; message?: string }> => {
    try {
      const response = await apiClient.get(`/api/user_meal_ingredient_marks/${mealId}`);
      
      if (response.data.success && response.data.data) {
        const ingredients: IngredientData[] = response.data.data.map((item: UserMealIngredientResponse) => ({
          ingredientId: item.ingredientId,
          name: item.ingredientName,
          quantity: item.quantity,
          unit: item.unit,
          hasIt: item.hasIt, // Mặc định false từ backend
        }));
        
        return { success: true, data: ingredients };
      }
      
      return { success: false, message: 'Không thể lấy danh sách nguyên liệu' };
    } catch (error: any) {
      console.error('Error fetching user meal ingredients:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách nguyên liệu' 
      };
    }
  },

  // Đánh dấu nguyên liệu đã có hoặc chưa có
  markIngredient: async (mealId: number, ingredientId: number, hasIt: boolean): Promise<{ success: boolean; message?: string }> => {
    try {
      const requestData: MarkIngredientRequest = {
        mealId,
        ingredientId,
        hasIt,
      };

      const response = await apiClient.post('/api/user_meal_ingredient_marks/mark', requestData);
      
      if (response.data.success) {
        return { success: true, message: 'Cập nhật trạng thái nguyên liệu thành công' };
      }
      
      return { success: false, message: 'Không thể cập nhật trạng thái nguyên liệu' };
    } catch (error: any) {
      console.error('Error marking ingredient:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái nguyên liệu' 
      };
    }
  },

  // Thêm meal vào product list (tạo records trong user_meal_ingredient_marks với hasIt = false)
  addMealToProductList: async (mealId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      // Gọi API để lấy danh sách nguyên liệu của meal
      // Backend sẽ tự động tạo records với hasIt = false nếu chưa có
      const response = await apiClient.get(`/api/user_meal_ingredient_marks/${mealId}`);
      
      if (response.data.success && response.data.data) {
        // Lưu meal ID vào AsyncStorage
        const savedMealIds = await AsyncStorage.getItem('userProductMealIds');
        const mealIds: number[] = savedMealIds ? JSON.parse(savedMealIds) : [];
        
        if (!mealIds.includes(mealId)) {
          mealIds.push(mealId);
          await AsyncStorage.setItem('userProductMealIds', JSON.stringify(mealIds));
        }
        
        return { success: true, message: 'Đã thêm món ăn vào danh sách sản phẩm' };
      }
      
      return { success: false, message: 'Không thể thêm món ăn vào danh sách sản phẩm' };
    } catch (error: any) {
      console.error('Error adding meal to product list:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thêm món ăn vào danh sách sản phẩm' 
      };
    }
  },

  // Lấy danh sách tất cả meals đã được thêm vào product list
  getUserProductList: async (): Promise<{ success: boolean; data?: ProductMealData[]; message?: string }> => {
    try {
      // Lấy danh sách meal IDs từ AsyncStorage
      const savedMealIds = await AsyncStorage.getItem('userProductMealIds');
      if (!savedMealIds) {
        return { success: true, data: [] };
      }

      const mealIds: number[] = JSON.parse(savedMealIds);
      const products: ProductMealData[] = [];

      // Load từng meal và nguyên liệu của nó
      for (const mealId of mealIds) {
        try {
          const response = await apiClient.get(`/api/user_meal_ingredient_marks/${mealId}`);
          if (response.data.success && response.data.data) {
            // Lấy thông tin meal từ UserMealController để có tên thật
            const mealDetailResponse = await apiClient.get(`/api/users/meals/${mealId}`);
            let mealName = `Món ăn ${mealId}`;
            
            if (mealDetailResponse.data.success && mealDetailResponse.data.data) {
              mealName = mealDetailResponse.data.data.name || mealName;
            }

            const ingredients = response.data.data.map((item: UserMealIngredientResponse) => ({
              ingredientId: item.ingredientId,
              name: item.ingredientName,
              quantity: item.quantity,
              unit: item.unit,
              hasIt: item.hasIt,
            }));

            products.push({
              mealId,
              mealName,
              ingredients,
            });
          }
        } catch (error) {
          console.error(`Error loading meal ${mealId}:`, error);
          // Tiếp tục với meal khác
        }
      }

      return { success: true, data: products };
    } catch (error: any) {
      console.error('Error fetching user product list:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm' 
      };
    }
  },

  // Đánh dấu tất cả nguyên liệu của một meal
  markAllIngredients: async (mealId: number, hasIt: boolean): Promise<{ success: boolean; message?: string }> => {
    try {
      // Lấy danh sách nguyên liệu của meal trực tiếp từ API
      const response = await apiClient.get(`/api/user_meal_ingredient_marks/${mealId}`);
      
      if (!response.data.success || !response.data.data) {
        return { success: false, message: 'Không thể lấy danh sách nguyên liệu của món ăn' };
      }

      const ingredients = response.data.data.map((item: UserMealIngredientResponse) => ({
        ingredientId: item.ingredientId,
        name: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        hasIt: item.hasIt,
      }));

      // Đánh dấu tất cả nguyên liệu
      const markPromises = ingredients.map(ingredient => 
        ingredientsAPI.markIngredient(mealId, ingredient.ingredientId, hasIt)
      );

      const results = await Promise.all(markPromises);
      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        return { 
          success: true, 
          message: hasIt ? 'Đã đánh dấu tất cả nguyên liệu là có' : 'Đã đánh dấu tất cả nguyên liệu là chưa có' 
        };
      } else {
        return { success: false, message: 'Có lỗi khi đánh dấu một số nguyên liệu' };
      }
    } catch (error: any) {
      console.error('Error marking all ingredients:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi đánh dấu tất cả nguyên liệu' 
      };
    }
  },

  // Xóa meal khỏi product list
  removeMealFromProductList: async (mealId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      // Xóa meal ID khỏi AsyncStorage
      const savedMealIds = await AsyncStorage.getItem('userProductMealIds');
      if (savedMealIds) {
        const mealIds: number[] = JSON.parse(savedMealIds);
        const updatedMealIds = mealIds.filter(id => id !== mealId);
        await AsyncStorage.setItem('userProductMealIds', JSON.stringify(updatedMealIds));
      }
      
      // Xóa số lượng của meal này
      await AsyncStorage.removeItem(`mealQuantity_${mealId}`);
      
      return { success: true, message: 'Đã xóa món ăn khỏi danh sách sản phẩm' };
    } catch (error: any) {
      console.error('Error removing meal from product list:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi xóa món ăn khỏi danh sách sản phẩm' 
      };
    }
  },

  // Lưu số lượng cho meal
  saveMealQuantity: async (mealId: number, quantity: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(`mealQuantity_${mealId}`, quantity.toString());
    } catch (error) {
      console.error('Error saving meal quantity:', error);
    }
  },

  // Lấy số lượng của meal
  getMealQuantity: async (mealId: number): Promise<number> => {
    try {
      const quantity = await AsyncStorage.getItem(`mealQuantity_${mealId}`);
      return quantity ? parseInt(quantity) : 1;
    } catch (error) {
      console.error('Error getting meal quantity:', error);
      return 1;
    }
  },
};
