import { useState, useEffect, useRef, useCallback } from 'react';
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
  
  // Cache để tránh reload không cần thiết
  const mealPlanCache = useRef<Map<string, { data: TodayMealPlanDto[]; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5000; // Cache 5 giây

  // Load thực đơn theo ngày cụ thể - wrap trong useCallback để tránh infinite loop
  const loadTodayMealPlan = useCallback(async (selectedDate?: Date, forceReload: boolean = false) => {
    try {
      // Sử dụng ngày được chọn hoặc ngày hiện tại đã lưu
      const targetDate = selectedDate || currentSelectedDate;
      setCurrentSelectedDate(targetDate); // Cập nhật ngày hiện tại
      
      // Format date bằng local time để tránh timezone issue (giống WeeklyMenuScreen)
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      const day = targetDate.getDate();
      const targetDateForAPI = new Date(year, month, day);
      targetDateForAPI.setHours(0, 0, 0, 0);
      const targetDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Kiểm tra cache trước
      if (!forceReload) {
        const cached = mealPlanCache.current.get(targetDateString);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setTodayMealPlans(cached.data);
          return; // Sử dụng cache, không cần gọi API
        }
      }
      
      setLoading(true);
      setError(null);
      
      // Sử dụng API mới để lấy thực đơn theo ngày cụ thể (với date đã được format đúng)
      const response = await mealPlanAPI.getMealPlanByDate(targetDateForAPI);
      
      if (response.success && response.data) {
        // console.log('🔄 Debug - API response data:', response.data);
        
        // Load meals từ local storage
        const userAddedMeals = await AsyncStorage.getItem('userAddedMeals');
        const localMeals = userAddedMeals ? JSON.parse(userAddedMeals) : [];
        
        // console.log('🔍 Debug - Local meals:', localMeals);
        // console.log('🔍 Debug - Target date:', targetDateString);
        
        // Merge với API data
        const mergedPlans = [...response.data];
        
        // Lọc local meals cho ngày được chọn
        const localMealsForDate = localMeals.filter(meal => meal.date === targetDateString);
        
        // Fetch tất cả meal details song song (parallel) thay vì tuần tự để tăng tốc
        if (localMealsForDate.length > 0) {
          const mealDetailPromises = localMealsForDate.map(async (localMeal) => {
            try {
              const mealDetailResponse = await mealPlanAPI.getMealDetail(localMeal.mealId);
              if (mealDetailResponse.success && mealDetailResponse.data) {
                const mealDetail = mealDetailResponse.data;
                return {
                  mealDetail,
                  mealTime: localMeal.mealTime,
                  date: localMeal.date
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching meal detail for mealId ${localMeal.mealId}:`, error);
              return null;
            }
          });
          
          // Chờ tất cả meal details load xong cùng lúc
          const mealDetails = await Promise.all(mealDetailPromises);
          
          // Thêm các meals vào mergedPlans
          mealDetails.forEach((result) => {
            if (result && result.mealDetail) {
              const todayMealPlan: TodayMealPlanDto = {
                planId: -1, // Local meals don't have a planId from backend, use -1 to identify them
                date: result.date,
                mealTime: result.mealTime,
                meal: {
                  mealid: result.mealDetail.mealid,
                  name: result.mealDetail.name,
                  description: result.mealDetail.description,
                  calories: result.mealDetail.calories,
                  protein: result.mealDetail.protein,
                  carbs: result.mealDetail.carbs,
                  fat: result.mealDetail.fat,
                  cookingtime: result.mealDetail.cookingtime,
                  diettype: result.mealDetail.diettype,
                  price: result.mealDetail.price,
                  imageUrl: result.mealDetail.imageUrl,
                  isPremium: result.mealDetail.isPremium,
                  categoryName: result.mealDetail.categoryName,
                  statusName: result.mealDetail.statusName,
                  instructions: result.mealDetail.instructions,
                  ingredients: result.mealDetail.ingredients
                }
              };
              mergedPlans.push(todayMealPlan);
            }
          });
        }
        
        // Remove duplicates based on mealid and mealTime

        mergedPlans.forEach((plan, index) => {

        });
        
        const uniquePlans = mergedPlans.filter((plan, index, self) => {
          const isDuplicate = self.findIndex(p => 
            p.meal.mealid === plan.meal.mealid && 
            p.mealTime === plan.mealTime
          ) !== index;
          
          return !isDuplicate;
        });

        // Lưu vào cache
        mealPlanCache.current.set(targetDateString, {
          data: uniquePlans,
          timestamp: Date.now()
        });
        
        setTodayMealPlans(uniquePlans);
      } else {
        setError(response.message || `Không thể tải thực đơn ngày ${targetDateString}`);
      }
    } catch (err) {
      // Format date bằng local time để tránh timezone issue
      const year = currentSelectedDate.getFullYear();
      const month = currentSelectedDate.getMonth();
      const day = currentSelectedDate.getDate();
      const errorDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setError(`Lỗi khi tải thực đơn ngày ${errorDateString}`);

    } finally {
      setLoading(false);
    }
  }, [currentSelectedDate]); // Wrap trong useCallback với dependency là currentSelectedDate

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
        // Invalidate cache cho ngày hiện tại để force reload (format bằng local time)
        const year = currentSelectedDate.getFullYear();
        const month = currentSelectedDate.getMonth();
        const day = currentSelectedDate.getDate();
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        mealPlanCache.current.delete(dateString);
        
        // Reload data sau khi thay đổi thành công với ngày hiện tại (force reload)
        await loadTodayMealPlan(currentSelectedDate, true); // Force reload để cập nhật ngay
        return true;
      } else {
        setError(response.message || 'Không thể thay đổi món theo gợi ý');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Lỗi khi thay đổi món theo gợi ý';
      setError(errorMessage);
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
        // Lưu timestamp khi thêm món thành công để MenuScreen biết cần reload
        try {
          await AsyncStorage.setItem('lastMealAddedTimestamp', Date.now().toString());
        } catch (storageError) {
          console.error('Error saving meal added timestamp:', storageError);
        }
        
        // Không reload ngay ở đây, để MenuScreen tự reload khi focus
        // Điều này tránh reload không cần thiết và duplicate reload
        return true;
      } else {
        setError(response.message || 'Không thể thêm món ăn vào thực đơn');
        return false;
      }
    } catch (err: any) {
      console.error('Error adding meal to menu:', err?.message || err);
      setError('Lỗi khi thêm món ăn vào thực đơn');

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
    // Format date bằng local time để tránh timezone issue
    const year = checkDate.getFullYear();
    const month = checkDate.getMonth();
    const day = checkDate.getDate();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
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
