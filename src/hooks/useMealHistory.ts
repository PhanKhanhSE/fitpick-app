import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { mealHistoryAPI, MealHistoryDto, DetailedDailyStats, MealEatenCheck } from '../services/mealHistoryAPI';

export const useMealHistory = () => {
  const [mealHistory, setMealHistory] = useState<MealHistoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [eatenMeals, setEatenMeals] = useState<Set<number>>(new Set());

  // Load meal history khi component mount
  useEffect(() => {
    loadMealHistory();
  }, []);

  // Load meal history từ API
  const loadMealHistory = async () => {
    try {
      setLoading(true);
      const history = await mealHistoryAPI.getUserMealHistory();
      setMealHistory(history);
      
      // Tạo Set các meal đã ăn hôm nay
      const today = new Date().toISOString().split('T')[0];
      const todayEatenMeals = new Set(
        history
          .filter(h => h.date === today)
          .map(h => h.mealid)
      );
      setEatenMeals(todayEatenMeals);
    } catch (error) {
      console.error('Error loading meal history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load meal history theo ngày cụ thể
  const loadMealHistoryByDate = async (date: string): Promise<MealHistoryDto[]> => {
    try {
      setLoading(true);
      const history = await mealHistoryAPI.getMealHistoryByDate(date);
      return history;
    } catch (error) {
      console.error('Error loading meal history by date:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra xem meal đã ăn hôm nay chưa
  const isMealEatenToday = (mealId: number): boolean => {
    return eatenMeals.has(mealId);
  };

  // Kiểm tra xem meal đã ăn trong ngày cụ thể chưa
  const isMealEatenOnDate = (mealId: number, date: string): boolean => {
    return mealHistory.some(h => h.mealid === mealId && h.date === date);
  };

  // Đánh dấu meal đã ăn
  const markMealAsEaten = async (
    mealId: number,
    calories: number,
    quantity: number = 1,
    mealTimeId: number = 1,
    date?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Kiểm tra xem đã ăn chưa
      if (isMealEatenOnDate(mealId, targetDate)) {
        Alert.alert('Thông báo', 'Bạn đã đánh dấu món này đã ăn trong ngày này rồi!');
        return false;
      }

      // Tạo meal history
      const newHistory = await mealHistoryAPI.markMealAsEaten(
        mealId,
        calories,
        quantity,
        mealTimeId,
        targetDate
      );

      // Cập nhật state
      if (targetDate === new Date().toISOString().split('T')[0]) {
        setEatenMeals(prev => new Set([...prev, mealId]));
      }
      
      // Reload meal history để sync với server
      await loadMealHistory();

      Alert.alert('Thành công', 'Đã đánh dấu món ăn đã ăn!');
      return true;
    } catch (error) {
      console.error('Error marking meal as eaten:', error);
      Alert.alert('Lỗi', 'Không thể đánh dấu món ăn đã ăn. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Bỏ đánh dấu đã ăn (xóa meal history)
  const unmarkMealAsEaten = async (mealId: number, date?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Tìm meal history của meal này trong ngày
      const dayHistory = mealHistory.find(h => 
        h.mealid === mealId && h.date === targetDate
      );

      if (!dayHistory) {
        Alert.alert('Thông báo', 'Món này chưa được đánh dấu đã ăn trong ngày này!');
        return false;
      }

      // Xóa meal history
      await mealHistoryAPI.deleteMealHistory(dayHistory.historyid);

      // Cập nhật state
      if (targetDate === new Date().toISOString().split('T')[0]) {
        setEatenMeals(prev => {
          const newSet = new Set(prev);
          newSet.delete(mealId);
          return newSet;
        });
      }

      // Reload meal history
      await loadMealHistory();

      Alert.alert('Thành công', 'Đã bỏ đánh dấu món ăn đã ăn!');
      return true;
    } catch (error) {
      console.error('Error unmarking meal as eaten:', error);
      Alert.alert('Lỗi', 'Không thể bỏ đánh dấu món ăn đã ăn. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa meal history trực tiếp bằng historyId
  const deleteMealHistory = async (historyId: number): Promise<boolean> => {
    try {
      setLoading(true);
      
      await mealHistoryAPI.deleteMealHistory(historyId);
      
      // Reload meal history
      await loadMealHistory();
      
      Alert.alert('Thành công', 'Đã xóa món ăn khỏi lịch sử!');
      return true;
    } catch (error) {
      console.error('Error deleting meal history:', error);
      Alert.alert('Lỗi', 'Không thể xóa món ăn khỏi lịch sử. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê dinh dưỡng hôm nay
  const getTodayNutritionStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await mealHistoryAPI.getDailyStats(today);
    } catch (error) {
      console.error('Error getting today nutrition stats:', error);
      return null;
    }
  };

  // Lấy thống kê dinh dưỡng chi tiết theo ngày
  const getDetailedDailyStats = async (date: string): Promise<DetailedDailyStats | null> => {
    try {
      return await mealHistoryAPI.getDetailedDailyStats(date);
    } catch (error) {
      console.error('Error getting detailed daily stats:', error);
      return null;
    }
  };

  // Kiểm tra meal đã ăn (API call)
  const checkMealEaten = async (mealId: number, date?: string): Promise<MealEatenCheck> => {
    try {
      return await mealHistoryAPI.checkMealEaten(mealId, date);
    } catch (error) {
      console.error('Error checking meal eaten:', error);
      return { isEaten: false, mealHistory: null };
    }
  };

  // Lấy tổng calo đã ăn hôm nay
  const getTodayConsumedCalories = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return mealHistory
      .filter(h => h.date === today)
      .reduce((total, h) => total + h.calories, 0);
  };

  // Lấy tổng calo đã ăn theo ngày
  const getConsumedCaloriesByDate = (date: string): number => {
    return mealHistory
      .filter(h => h.date === date)
      .reduce((total, h) => total + h.calories, 0);
  };

  return {
    mealHistory,
    loading,
    eatenMeals,
    isMealEatenToday,
    isMealEatenOnDate,
    markMealAsEaten,
    unmarkMealAsEaten,
    deleteMealHistory,
    getTodayNutritionStats,
    getDetailedDailyStats,
    checkMealEaten,
    getTodayConsumedCalories,
    getConsumedCaloriesByDate,
    loadMealHistory,
    loadMealHistoryByDate,
  };
};
