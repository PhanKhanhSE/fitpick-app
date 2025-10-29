import { useState, useEffect } from 'react';
import { mealPlanAPI, TodayMealPlanDto, Mealplan, MealDto } from '../services/mealPlanAPI';
import { useIngredients } from './useIngredients';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useMealPlans = () => {
  const [todayMealPlans, setTodayMealPlans] = useState<TodayMealPlanDto[]>([]);
  const [userMealPlans, setUserMealPlans] = useState<Mealplan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date>(new Date()); // Lưu trữ ngày hiện tại
  const { addMealToProducts } = useIngredients();

  // Load thực đơn theo ngày cụ thể
  const loadTodayMealPlan = async (selectedDate?: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sử dụng ngày được chọn hoặc ngày hiện tại đã lưu
      const targetDate = selectedDate || currentSelectedDate;
      setCurrentSelectedDate(targetDate); // Cập nhật ngày hiện tại
      const targetDateString = targetDate.toISOString().split('T')[0];
      
      // Sử dụng API mới để lấy thực đơn theo ngày cụ thể
      const response = await mealPlanAPI.getMealPlanByDate(targetDate);
      
      if (response.success && response.data) {
        // console.log('🔄 Debug - API response data:', response.data);
        
        // Load meals từ local storage
        const userAddedMeals = await AsyncStorage.getItem('userAddedMeals');
        const localMeals = userAddedMeals ? JSON.parse(userAddedMeals) : [];
        
        // console.log('🔍 Debug - Local meals:', localMeals);
        // console.log('🔍 Debug - Target date:', targetDateString);
        
        // Merge với API data
        const mergedPlans = [...response.data];
        
        // Thêm meals từ local storage cho ngày được chọn
        for (const localMeal of localMeals) {
          // console.log('🔍 Debug - Checking local meal:', localMeal, 'vs target:', targetDateString);
          
          // Chỉ load meals của ngày được chọn
          if (localMeal.date === targetDateString) {
            // console.log('✅ Debug - Found matching meal for target date, fetching details...');
            // Fetch meal detail từ API
            try {
              const mealDetailResponse = await mealPlanAPI.getMealDetail(localMeal.mealId);
              if (mealDetailResponse.success && mealDetailResponse.data) {
                const mealDetail = mealDetailResponse.data;
                const todayMealPlan: TodayMealPlanDto = {
                  planId: -1, // Local meals don't have a planId from backend, use -1 to identify them
                  date: localMeal.date,
                  mealTime: localMeal.mealTime,
                  meal: {
                    mealid: mealDetail.mealid,
                    name: mealDetail.name,
                    description: mealDetail.description,
                    calories: mealDetail.calories,
                    protein: mealDetail.protein,
                    carbs: mealDetail.carbs,
                    fat: mealDetail.fat,
                    cookingtime: mealDetail.cookingtime,
                    diettype: mealDetail.diettype,
                    price: mealDetail.price,
                    imageUrl: mealDetail.imageUrl,
                    isPremium: mealDetail.isPremium,
                    categoryName: mealDetail.categoryName,
                    statusName: mealDetail.statusName,
                    instructions: mealDetail.instructions,
                    ingredients: mealDetail.ingredients
                  }
                };
                mergedPlans.push(todayMealPlan);
                // console.log('✅ Debug - Added local meal to merged plans:', todayMealPlan);
              }
            } catch (error) {
              console.error('Error fetching meal detail for local meal:', error);
            }
          }
        }
        
        // Remove duplicates based on mealid and mealTime
        console.log('🔍 Debug - Before deduplication, checking for duplicates...');
        mergedPlans.forEach((plan, index) => {
          console.log(`🔍 Debug - Plan ${index}: mealid=${plan.meal.mealid}, mealTime=${plan.mealTime}, planId=${plan.planId}`);
        });
        
        const uniquePlans = mergedPlans.filter((plan, index, self) => {
          const isDuplicate = self.findIndex(p => 
            p.meal.mealid === plan.meal.mealid && 
            p.mealTime === plan.mealTime
          ) !== index;
          
          if (isDuplicate) {
            console.log(`🚫 Debug - Removing duplicate: mealid=${plan.meal.mealid}, mealTime=${plan.mealTime}, planId=${plan.planId}`);
          }
          
          return !isDuplicate;
        });
        
        console.log('🎯 Debug - Final merged plans (before deduplication):', mergedPlans.length);
        console.log('🎯 Debug - Final merged plans (after deduplication):', uniquePlans.length);
        console.log('🔄 Debug - Setting todayMealPlans state with', uniquePlans.length, 'meals');
        setTodayMealPlans(uniquePlans);
      } else {
        setError(response.message || `Không thể tải thực đơn ngày ${targetDateString}`);
      }
    } catch (err) {
      setError(`Lỗi khi tải thực đơn ngày ${currentSelectedDate.toISOString().split('T')[0]}`);
      console.error('Error loading meal plan by date:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load tất cả meal plans của user
  const loadUserMealPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mealPlanAPI.getUserMealPlans();
      
      if (response.success && response.data) {
        setUserMealPlans(response.data);
      } else {
        setError(response.message || 'Không thể tải danh sách thực đơn');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách thực đơn');
      console.error('Error loading user meal plans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tạo meal plan mới
  const generateMealPlan = async (date: Date): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mealPlanAPI.generateMealPlan(date);
      
      if (response.success) {
        // Reload data sau khi tạo thành công
        await loadTodayMealPlan();
        return true;
      } else {
        setError(response.message || 'Không thể tạo thực đơn');
        return false;
      }
    } catch (err) {
      setError('Lỗi khi tạo thực đơn');
      console.error('Error generating meal plan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi món ăn trong plan
  const swapMeal = async (planId: number, newMealId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mealPlanAPI.swapMeal(planId, newMealId);
      
      if (response.success) {
        // Reload data sau khi thay đổi thành công với ngày hiện tại
        await loadTodayMealPlan(currentSelectedDate);
        return true;
      } else {
        setError(response.message || 'Không thể thay đổi món ăn');
        return false;
      }
    } catch (err) {
      setError('Lỗi khi thay đổi món ăn');
      console.error('Error swapping meal:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi món theo gợi ý
  const replaceMealBySuggestion = async (planId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mealPlanAPI.replaceMealBySuggestion(planId);
      
      if (response.success) {
        // Reload data sau khi thay đổi thành công với ngày hiện tại
        // console.log('🔄 Debug - Reloading data after replace by suggestion for date:', currentSelectedDate.toISOString().split('T')[0]);
        await loadTodayMealPlan(currentSelectedDate);
        return true;
      } else {
        setError(response.message || 'Không thể thay đổi món theo gợi ý');
        return false;
      }
    } catch (err) {
      setError('Lỗi khi thay đổi món theo gợi ý');
      console.error('Error replacing meal by suggestion:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi món từ danh sách yêu thích
  const replaceMealByFavorites = async (planId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mealPlanAPI.replaceMealByFavorites(planId);
      
      if (response.success) {
        // Reload data sau khi thay đổi thành công với ngày hiện tại
        // console.log('🔄 Debug - Reloading data after replace by favorites for date:', currentSelectedDate.toISOString().split('T')[0]);
        await loadTodayMealPlan(currentSelectedDate);
        return true;
      } else {
        setError(response.message || 'Không thể thay đổi món từ danh sách yêu thích');
        return false;
      }
    } catch (err) {
      setError('Lỗi khi thay đổi món từ danh sách yêu thích');
      console.error('Error replacing meal by favorites:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa món ăn khỏi thực đơn
  const deleteMealPlan = async (planId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await mealPlanAPI.deleteMealPlan(planId);

      if (response.success) {
        await loadTodayMealPlan(currentSelectedDate);
        return true;
      } else {
        setError(response.message || 'Không thể xóa món ăn khỏi thực đơn');
        return false;
      }
    } catch (err) {
      setError('Lỗi khi xóa món ăn khỏi thực đơn');
      console.error('Error deleting meal plan:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Thêm món ăn vào thực đơn
  const addMealToMenu = async (mealId: number, date: Date, mealTime?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mealPlanAPI.addMealToMenu(mealId, date, mealTime);
      
      if (response.success) {
        // Reload data sau khi thêm thành công với ngày hiện tại
        await loadTodayMealPlan(currentSelectedDate);
        return true;
      } else {
        setError(response.message || 'Không thể thêm món ăn vào thực đơn');
        return false;
      }
    } catch (err) {
      setError('Lỗi khi thêm món ăn vào thực đơn');
      console.error('Error adding meal to menu:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Thêm món ăn vào danh sách sản phẩm
  const addMealToProductList = async (mealId: number, mealName: string): Promise<boolean> => {
    try {
      const success = await addMealToProducts(mealId, mealName);
      return success;
    } catch (err) {
      console.error('Error adding meal to product list:', err);
      return false;
    }
  };

  // Lấy chi tiết món ăn
  const getMealDetail = async (mealId: number): Promise<MealDto | null> => {
    try {
      const response = await mealPlanAPI.getMealDetail(mealId);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching meal detail:', err);
      return null;
    }
  };

  // Nhóm meal plans theo thời gian bữa ăn
  const getMealPlansByTime = () => {
    const breakfast: TodayMealPlanDto[] = [];
    const lunch: TodayMealPlanDto[] = [];
    const dinner: TodayMealPlanDto[] = [];

    todayMealPlans.forEach(plan => {
      const mealTime = plan.mealTime.toLowerCase();
      if (mealTime.includes('breakfast') || mealTime.includes('sáng')) {
        breakfast.push(plan);
      } else if (mealTime.includes('lunch') || mealTime.includes('trưa')) {
        lunch.push(plan);
      } else if (mealTime.includes('dinner') || mealTime.includes('tối')) {
        dinner.push(plan);
      }
    });

    return { breakfast, lunch, dinner };
  };

  // Kiểm tra xem món ăn đã có trong meal plan chưa
  const isMealInPlan = (mealId: number, targetDate?: Date): boolean => {
    const checkDate = targetDate || new Date();
    const dateString = checkDate.toISOString().split('T')[0];
    
    return todayMealPlans.some(plan => 
      plan.meal.mealid === mealId && plan.date === dateString
    );
  };

  // Tính tổng calories cho một nhóm meal plans
  const getTotalCalories = (mealPlans: TodayMealPlanDto[]): number => {
    return mealPlans.reduce((total, plan) => {
      return total + (plan.meal.calories || 0);
    }, 0);
  };

  // Load data khi component mount
  useEffect(() => {
    loadTodayMealPlan();
  }, []);

  // Xóa món ăn từ local storage
  const removeMealFromLocalStorage = async (mealId: number, date: string): Promise<boolean> => {
    try {
      const userAddedMeals = await AsyncStorage.getItem('userAddedMeals');
      const localMeals = userAddedMeals ? JSON.parse(userAddedMeals) : [];
      
      // Lọc ra món ăn cần xóa
      const updatedMeals = localMeals.filter((meal: any) => 
        !(meal.mealId === mealId && meal.date === date)
      );
      
      // Lưu lại vào AsyncStorage
      await AsyncStorage.setItem('userAddedMeals', JSON.stringify(updatedMeals));
      
      // console.log('✅ Debug - Removed meal from local storage:', { mealId, date });
      return true;
    } catch (error) {
      console.error('Error removing meal from local storage:', error);
      return false;
    }
  };

  return {
    // State
    todayMealPlans,
    userMealPlans,
    loading,
    error,

    // Actions
    loadTodayMealPlan,
    loadUserMealPlans,
    generateMealPlan,
    swapMeal,
    deleteMealPlan,
    replaceMealBySuggestion,
    replaceMealByFavorites,
    addMealToMenu,
    addMealToProductList,
    getMealDetail,
    removeMealFromLocalStorage,
    
    // Utilities
    getMealPlansByTime,
    getTotalCalories,
    isMealInPlan,
    
    // Error handling
    clearError: () => setError(null)
  };
};
