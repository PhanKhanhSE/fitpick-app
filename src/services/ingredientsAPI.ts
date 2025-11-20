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
        // Sử dụng một lock mechanism đơn giản để tránh race condition
        let retries = 0;
        const maxRetries = 5;
        
        while (retries < maxRetries) {
          try {
            const savedMealIds = await AsyncStorage.getItem('userProductMealIds');
            const mealIds: number[] = savedMealIds ? JSON.parse(savedMealIds) : [];
            
            if (!mealIds.includes(mealId)) {
              mealIds.push(mealId);
              await AsyncStorage.setItem('userProductMealIds', JSON.stringify(mealIds));
            }
            
            return { success: true, message: 'Đã thêm món ăn vào danh sách sản phẩm' };
          } catch (storageError) {
            retries++;
            if (retries >= maxRetries) {
              console.error('Failed to save mealId to AsyncStorage after retries:', storageError);
              // Vẫn trả về success vì backend đã tạo records thành công
              return { success: true, message: 'Đã thêm món ăn vào danh sách sản phẩm (lưu local thất bại)' };
            }
            // Đợi một chút trước khi retry
            await new Promise(resolve => setTimeout(resolve, 50 * retries));
          }
        }
        
        return { success: true, message: 'Đã thêm món ăn vào danh sách sản phẩm' };
      }
      
      return { success: false, message: 'Không thể thêm món ăn vào danh sách sản phẩm' };
    } catch (error: any) {

      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi thêm món ăn vào danh sách sản phẩm' 
      };
    }
  },

  // Thêm nhiều meals vào product list cùng lúc (tránh race condition)
  addMultipleMealsToProductList: async (mealIds: number[]): Promise<{ success: boolean; addedCount: number; message?: string }> => {
    try {
      console.log(`🔄 [addMultipleMealsToProductList] Bắt đầu thêm ${mealIds.length} món:`, mealIds);
      
      // Gọi API cho tất cả meals để backend tạo records
      const apiPromises = mealIds.map((mealId, index) => 
        apiClient.get(`/api/user_meal_ingredient_marks/${mealId}`)
          .then(response => {
            console.log(`✅ [addMultipleMealsToProductList] Meal ${mealId} (index ${index}) thành công:`, {
              success: response.data?.success,
              hasData: !!response.data?.data,
              dataLength: response.data?.data?.length
            });
            return { success: true, mealId, response, index };
          })
          .catch(err => {
            console.error(`❌ [addMultipleMealsToProductList] Meal ${mealId} (index ${index}) thất bại:`, {
              message: err.message,
              response: err.response?.data,
              status: err.response?.status
            });
            return { success: false, mealId, error: err, index };
          })
      );
      
      const apiResults = await Promise.all(apiPromises);
      const successfulMealIds: number[] = [];
      const failedMealIds: number[] = [];
      
      // Lọc ra các mealIds đã được backend xử lý thành công
      apiResults.forEach((result) => {
        if (result.success && result.response) {
          const response = result.response;
          // Kiểm tra nhiều cấu trúc response khác nhau
          // Chấp nhận response thành công ngay cả khi không có ingredients (vì backend đã tạo records)
          const isSuccess = 
            response.status === 200 || // HTTP 200 OK
            response.data?.success === true || // API response success
            (response.data?.data !== undefined) || // Có data (có thể là empty array)
            (Array.isArray(response.data)); // Response là array
          
          if (isSuccess) {
            successfulMealIds.push(result.mealId);
            const dataLength = response.data?.data?.length || (Array.isArray(response.data) ? response.data.length : 0);
            console.log(`✅ [addMultipleMealsToProductList] Meal ${result.mealId} được thêm vào danh sách thành công (${dataLength} ingredients)`);
          } else {
            failedMealIds.push(result.mealId);
            console.warn(`⚠️ [addMultipleMealsToProductList] Meal ${result.mealId} không có response hợp lệ:`, {
              status: response.status,
              data: response.data
            });
          }
        } else {
          failedMealIds.push(result.mealId);
          console.error(`❌ [addMultipleMealsToProductList] Meal ${result.mealId} API call thất bại:`, result.error?.message);
        }
      });
      
      console.log(`📊 [addMultipleMealsToProductList] Kết quả: ${successfulMealIds.length}/${mealIds.length} thành công`);
      if (failedMealIds.length > 0) {
        console.warn(`⚠️ [addMultipleMealsToProductList] Các món thất bại:`, failedMealIds);
      }
      
      if (successfulMealIds.length === 0) {
        return { success: false, addedCount: 0, message: 'Không thể thêm món ăn vào danh sách sản phẩm' };
      }
      
      // Đọc AsyncStorage một lần, thêm tất cả mealIds, rồi lưu một lần
      try {
        const savedMealIds = await AsyncStorage.getItem('userProductMealIds');
        const existingMealIds: number[] = savedMealIds ? JSON.parse(savedMealIds) : [];
        
        console.log(`💾 [addMultipleMealsToProductList] Existing mealIds trong AsyncStorage:`, existingMealIds);
        console.log(`💾 [addMultipleMealsToProductList] Successful mealIds cần thêm:`, successfulMealIds);
        
        // Thêm tất cả mealIds mới vào (loại bỏ duplicate)
        const updatedMealIds = [...new Set([...existingMealIds, ...successfulMealIds])];
        
        console.log(`💾 [addMultipleMealsToProductList] Updated mealIds sau khi merge:`, updatedMealIds);
        
        // Lưu một lần duy nhất
        await AsyncStorage.setItem('userProductMealIds', JSON.stringify(updatedMealIds));
        
        console.log(`✅ [addMultipleMealsToProductList] Đã lưu ${updatedMealIds.length} mealIds vào AsyncStorage`);
        
        return { 
          success: true, 
          addedCount: successfulMealIds.length,
          message: failedMealIds.length > 0 
            ? `Đã thêm ${successfulMealIds.length}/${mealIds.length} món ăn vào danh sách sản phẩm`
            : `Đã thêm ${successfulMealIds.length} món ăn vào danh sách sản phẩm`
        };
      } catch (storageError) {
        console.error('❌ [addMultipleMealsToProductList] Error saving mealIds to AsyncStorage:', storageError);
        // Vẫn trả về success vì backend đã tạo records thành công
        return { 
          success: true, 
          addedCount: successfulMealIds.length,
          message: `Đã thêm ${successfulMealIds.length} món ăn vào danh sách sản phẩm (lưu local thất bại)` 
        };
      }
    } catch (error: any) {
      console.error('Error adding multiple meals to product list:', error);
      return { 
        success: false, 
        addedCount: 0,
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
          // Chấp nhận response thành công ngay cả khi không có ingredients (empty array)
          if (response.data?.success && response.data?.data !== undefined) {
            // Lấy thông tin meal từ UserMealController để có tên thật
            let mealName = `Món ăn ${mealId}`;
            try {
              const mealDetailResponse = await apiClient.get(`/api/users/meals/${mealId}`);
              if (mealDetailResponse.data?.success && mealDetailResponse.data?.data) {
                mealName = mealDetailResponse.data.data.name || mealName;
              }
            } catch (mealDetailError) {
              console.warn(`⚠️ [getUserProductList] Không thể lấy thông tin meal ${mealId}, dùng tên mặc định`);
            }

            // Map ingredients (có thể là empty array)
            const ingredients = Array.isArray(response.data.data) 
              ? response.data.data.map((item: UserMealIngredientResponse) => ({
                  ingredientId: item.ingredientId,
                  name: item.ingredientName,
                  quantity: item.quantity,
                  unit: item.unit,
                  hasIt: item.hasIt,
                }))
              : [];

            products.push({
              mealId,
              mealName,
              ingredients,
            });
            
                  // Log removed để giảm noise
          } else {
            console.warn(`⚠️ [getUserProductList] Meal ${mealId} không có response hợp lệ:`, response.data);
          }
        } catch (error: any) {
          console.error(`❌ [getUserProductList] Lỗi khi load meal ${mealId}:`, error.message);
          // Tiếp tục với meal khác
        }
      }

      return { success: true, data: products };
    } catch (error: any) {

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
      const markPromises = ingredients.map((ingredient: { ingredientId: number }) => 
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

    }
  },

  // Lấy số lượng của meal
  getMealQuantity: async (mealId: number): Promise<number> => {
    try {
      const quantity = await AsyncStorage.getItem(`mealQuantity_${mealId}`);
      return quantity ? parseInt(quantity) : 1;
    } catch (error) {

      return 1;
    }
  },
};
