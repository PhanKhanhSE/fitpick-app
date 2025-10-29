import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { useMealPlans } from '../../hooks/useMealPlans';
import { useProUser } from '../../hooks/useProUser';
import { useFavorites } from '../../hooks/useFavorites';
import { useMealHistory } from '../../hooks/useMealHistory';
import { TodayMealPlanDto, mealPlanAPI } from '../../services/mealPlanAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WeeklyMealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
  isLocked?: boolean;
  isEaten?: boolean;
  caloriesNumber?: number;
  mealTimeId?: number;
  planId?: number; // ID của meal plan để có thể xóa/sửa
}

interface DayMealData {
  date: Date;
  dateString: string;
  dayName: string;
  breakfast: WeeklyMealData[];
  lunch: WeeklyMealData[];
  dinner: WeeklyMealData[];
  totalCalories: number;
}

const WeeklyMenuScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isProUser } = useProUser();
  const { isFavorite } = useFavorites();
  const { 
    isMealEatenOnDate,
    markMealAsEaten,
    unmarkMealAsEaten,
    loading: mealHistoryLoading
  } = useMealHistory();
  const { 
    deleteMealPlan,
    replaceMealBySuggestion,
    removeMealFromLocalStorage,
    generateMealPlan,
    loading,
    error,
    clearError
  } = useMealPlans();
  
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Bắt đầu từ thứ 2 của tuần hiện tại
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return monday;
  });
  
  const [weeklyData, setWeeklyData] = useState<DayMealData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{ meal: WeeklyMealData; dateString: string } | null>(null);
  const [showMealActionModal, setShowMealActionModal] = useState(false);

  // Tạo danh sách 7 ngày trong tuần
  const getWeekDays = (startDate: Date): Date[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Convert TodayMealPlanDto to WeeklyMealData format
  const convertToWeeklyMealData = (mealPlan: TodayMealPlanDto, dateString: string, index?: number): WeeklyMealData => {
    const mealId = mealPlan.meal.mealid;
    const caloriesNumber = mealPlan.meal.calories || 0;
    const isEaten = isMealEatenOnDate(mealId, dateString);
    
    // Xác định mealTimeId dựa trên categoryName
    let mealTimeId = 1; // Default: breakfast
    if (mealPlan.meal.categoryName?.toLowerCase().includes('lunch') || 
        mealPlan.meal.categoryName?.toLowerCase().includes('trưa')) {
      mealTimeId = 2;
    } else if (mealPlan.meal.categoryName?.toLowerCase().includes('dinner') || 
               mealPlan.meal.categoryName?.toLowerCase().includes('tối')) {
      mealTimeId = 3;
    }

    return {
      id: `${mealPlan.planId}-${mealId}-${mealPlan.mealTime}-${index || 0}`,
      title: mealPlan.meal.name,
      calories: `${caloriesNumber} kcal`,
      time: `${mealPlan.meal.cookingtime || 0} phút`,
      image: { uri: mealPlan.meal.imageUrl || 'https://via.placeholder.com/300x200' },
      tag: mealPlan.meal.categoryName || 'Món ăn',
      isLocked: (mealPlan.meal.isPremium || false) && !isProUser(),
      isEaten,
      caloriesNumber,
      mealTimeId,
      planId: mealPlan.planId, // Lưu planId để có thể xóa/sửa
    };
  };

  // Load meal plans cho một ngày cụ thể
  const loadDayMealPlans = async (date: Date): Promise<DayMealData> => {
    try {
      const dateString = date.toISOString().split('T')[0];
      
      // Load từ API
      const response = await mealPlanAPI.getMealPlanByDate(date);
      let apiMeals: TodayMealPlanDto[] = [];
      
      if (response.success && response.data) {
        apiMeals = response.data;
      }
      
      // Load từ local storage
      const userAddedMeals = await AsyncStorage.getItem('userAddedMeals');
      const localMeals = userAddedMeals ? JSON.parse(userAddedMeals) : [];
      
      // Merge local meals với API data
      const allMeals = [...apiMeals];
      
      for (const localMeal of localMeals) {
        if (localMeal.date === dateString) {
          try {
            const mealDetailResponse = await mealPlanAPI.getMealDetail(localMeal.mealId);
            if (mealDetailResponse.success && mealDetailResponse.data) {
              const mealDetail = mealDetailResponse.data;
              const todayMealPlan: TodayMealPlanDto = {
                planId: -1, // Local meals don't have a planId from backend
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
              allMeals.push(todayMealPlan);
            }
          } catch (error) {
            console.error('Error fetching meal detail for local meal:', error);
          }
        }
      }
      
      // Phân loại theo bữa ăn
      const breakfast: TodayMealPlanDto[] = [];
      const lunch: TodayMealPlanDto[] = [];
      const dinner: TodayMealPlanDto[] = [];

      allMeals.forEach(plan => {
        const mealTime = plan.mealTime.toLowerCase();
        if (mealTime.includes('breakfast') || mealTime.includes('sáng')) {
          breakfast.push(plan);
        } else if (mealTime.includes('lunch') || mealTime.includes('trưa')) {
          lunch.push(plan);
        } else if (mealTime.includes('dinner') || mealTime.includes('tối')) {
          dinner.push(plan);
        }
      });
      
      const breakfastMeals = breakfast.map((mealPlan, index) => convertToWeeklyMealData(mealPlan, dateString, index));
      const lunchMeals = lunch.map((mealPlan, index) => convertToWeeklyMealData(mealPlan, dateString, index));
      const dinnerMeals = dinner.map((mealPlan, index) => convertToWeeklyMealData(mealPlan, dateString, index));
      
      const totalCalories = breakfast.reduce((total, plan) => total + (plan.meal.calories || 0), 0) +
                           lunch.reduce((total, plan) => total + (plan.meal.calories || 0), 0) +
                           dinner.reduce((total, plan) => total + (plan.meal.calories || 0), 0);

      return {
        date: new Date(date),
        dateString,
        dayName: date.toLocaleDateString('vi-VN', { weekday: 'long' }),
        breakfast: breakfastMeals,
        lunch: lunchMeals,
        dinner: dinnerMeals,
        totalCalories,
      };
    } catch (error) {
      console.error('Error loading day meal plans:', error);
      return {
        date: new Date(date),
        dateString: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('vi-VN', { weekday: 'long' }),
        breakfast: [],
        lunch: [],
        dinner: [],
        totalCalories: 0,
      };
    }
  };

  // Load dữ liệu cho cả tuần
  const loadWeeklyData = async () => {
    setIsLoading(true);
    try {
      const weekDays = getWeekDays(currentWeekStart);
      const weeklyMealData: DayMealData[] = [];
      
      for (const day of weekDays) {
        const dayData = await loadDayMealPlans(day);
        weeklyMealData.push(dayData);
      }
      
      setWeeklyData(weeklyMealData);
    } catch (error) {
      console.error('Error loading weekly data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu thực đơn tuần');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleGoBack = () => navigation.goBack();
  
  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };
  
  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const handleMealPress = (meal: WeeklyMealData) => {
    const convertedMeal = {
      id: meal.id,
      title: meal.title,
      calories: meal.calories,
      price: "0 VND",
      image: meal.image,
      cookingTime: meal.time,
      ingredients: [
        { name: "Thành phần chính", amount: "200g" },
      ],
      instructions: [
        "Hướng dẫn sẽ được cập nhật sau.",
      ],
    };
    navigation.navigate('MealDetail', { meal: convertedMeal });
  };

  const handleEatMeal = async (meal: WeeklyMealData, dateString: string) => {
    if (!meal.caloriesNumber || !meal.mealTimeId) {
      Alert.alert('Lỗi', 'Không thể xác định thông tin món ăn');
      return;
    }

    try {
      const success = await markMealAsEaten(
        parseInt(meal.id),
        meal.caloriesNumber,
        1, // quantity
        meal.mealTimeId,
        dateString
      );

      if (success) {
        // Reload data để cập nhật UI
        await loadWeeklyData();
      }
    } catch (error) {
      console.error('Error eating meal:', error);
    }
  };

  const handleUneatMeal = async (meal: WeeklyMealData, dateString: string) => {
    try {
      const success = await unmarkMealAsEaten(parseInt(meal.id), dateString);
      
      if (success) {
        // Reload data để cập nhật UI
        await loadWeeklyData();
      }
    } catch (error) {
      console.error('Error unmarking meal as eaten:', error);
    }
  };

  // Kiểm tra xem ngày có phải là quá khứ không
  const isPastDate = (dateString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateString);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Xử lý xóa món ăn
  const handleDeleteMeal = async (meal: WeeklyMealData, dateString: string) => {
    if (isPastDate(dateString)) {
      Alert.alert('Thông báo', 'Không thể xóa món ăn trong quá khứ');
      return;
    }

    if (!meal.planId || meal.planId <= 0) {
      // Xóa từ local storage
      const success = await removeMealFromLocalStorage(parseInt(meal.id), dateString);
      if (success) {
        Alert.alert('Thành công', 'Đã xóa món ăn khỏi thực đơn');
        await loadWeeklyData();
      }
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa món ăn này khỏi thực đơn?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteMealPlan(meal.planId!);
            if (success) {
              Alert.alert('Thành công', 'Đã xóa món ăn khỏi thực đơn');
              await loadWeeklyData();
            } else {
              Alert.alert('Lỗi', 'Không thể xóa món ăn');
            }
          },
        },
      ]
    );
  };

  // Xử lý thay đổi món ăn tự động
  const handleReplaceMeal = async (meal: WeeklyMealData, dateString: string) => {
    if (isPastDate(dateString)) {
      Alert.alert('Thông báo', 'Không thể thay đổi món ăn trong quá khứ');
      return;
    }

    if (!meal.planId || meal.planId <= 0) {
      Alert.alert('Thông báo', 'Không thể thay đổi món ăn này. Món này được thêm từ local storage.');
      return;
    }

    try {
      const success = await replaceMealBySuggestion(meal.planId);
      if (success) {
        Alert.alert('Thành công', 'Đã thay đổi món ăn tự động');
        await loadWeeklyData();
      } else {
        Alert.alert('Lỗi', 'Không thể thay đổi món ăn');
      }
    } catch (error) {
      console.error('Error replacing meal:', error);
      Alert.alert('Lỗi', 'Không thể thay đổi món ăn');
    }
  };

  // Tự động đổi tất cả món từ hôm nay đến hết tuần
  const handleAutoReplaceWeekMeals = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Lấy tất cả các ngày từ hôm nay đến hết tuần
    const weekDays = getWeekDays(currentWeekStart);
    const futureDays = weekDays.filter(day => {
      const dayDate = new Date(day);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate >= today;
    });

    if (futureDays.length === 0) {
      Alert.alert('Thông báo', 'Không có ngày nào trong tuần để thay đổi');
      return;
    }

    Alert.alert(
      'Xác nhận',
      `Bạn có muốn tự động đổi món ăn cho ${futureDays.length} ngày từ hôm nay đến hết tuần không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            setIsLoading(true);
            let successCount = 0;
            let failCount = 0;

            for (const day of futureDays) {
              try {
                // Load meal plans cho ngày này trực tiếp
                const dayData = await loadDayMealPlans(day);
                
                // Thay đổi tất cả món ăn có planId > 0
                const allMeals = [...dayData.breakfast, ...dayData.lunch, ...dayData.dinner];
                for (const meal of allMeals) {
                  if (meal.planId && meal.planId > 0) {
                    const success = await replaceMealBySuggestion(meal.planId);
                    if (success) successCount++;
                    else failCount++;
                  }
                }
              } catch (error) {
                console.error(`Error replacing meals for ${day.toISOString().split('T')[0]}:`, error);
                failCount++;
              }
            }

            setIsLoading(false);
            Alert.alert(
              'Hoàn thành',
              `Đã thay đổi ${successCount} món ăn thành công${failCount > 0 ? `, ${failCount} món thất bại` : ''}`
            );
            await loadWeeklyData();
          },
        },
      ]
    );
  };

  // Debug function đã xóa để push git
  // const debugData = () => {
  //   console.log('🔍 Debug Weekly Data:');
  //   weeklyData.forEach((day, index) => {
  //     console.log(`Day ${index + 1} (${day.dateString}):`, {
  //       breakfast: day.breakfast.length,
  //       lunch: day.lunch.length,
  //       dinner: day.dinner.length,
  //       totalCalories: day.totalCalories
  //     });
  //   });
  // };

  // Load data khi component mount và khi currentWeekStart thay đổi
  useEffect(() => {
    loadWeeklyData();
  }, [currentWeekStart]);

  // Debug data khi weeklyData thay đổi - đã xóa để push git
  // useEffect(() => {
  //   if (weeklyData.length > 0) {
  //     debugData();
  //   }
  // }, [weeklyData]);

  // Reload data khi quay lại screen
  useFocusEffect(
    React.useCallback(() => {
      loadWeeklyData();
    }, [currentWeekStart])
  );

  const formatWeekRange = () => {
    const weekDays = getWeekDays(currentWeekStart);
    const startDate = weekDays[0];
    const endDate = weekDays[6];
    
    return `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`;
  };

  const renderDayMeals = (dayData: DayMealData) => {
    const isToday = dayData.dateString === new Date().toISOString().split('T')[0];
    const isPast = isPastDate(dayData.dateString);
    
    return (
      <View key={dayData.dateString} style={styles.dayContainer}>
        <View style={[styles.dayHeader, isToday && styles.todayHeader]}>
          <Text style={[styles.dayName, isToday && styles.todayText]}>
            {dayData.dayName}
          </Text>
          <Text style={[styles.dayDate, isToday && styles.todayText]}>
            {dayData.date.getDate()}/{dayData.date.getMonth() + 1}
          </Text>
          <Text style={[styles.totalCalories, isToday && styles.todayText]}>
            {dayData.totalCalories} kcal
          </Text>
        </View>

        <View style={styles.mealsContainer}>
          {/* Bữa sáng */}
          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>Bữa sáng</Text>
            {dayData.breakfast.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dayData.breakfast.map((meal, index) => (
                  <View key={meal.id || `breakfast-${index}`} style={styles.mealCardContainer}>
                    <TouchableOpacity
                      style={[styles.mealCard, meal.isEaten && styles.eatenMealCard]}
                      onPress={() => handleMealPress(meal)}
                    >
                      <Text style={[styles.mealName, meal.isEaten && styles.eatenMealText]} numberOfLines={2}>
                        {meal.title}
                      </Text>
                      <Text style={[styles.mealCalories, meal.isEaten && styles.eatenMealText]}>{meal.calories}</Text>
                      {meal.isEaten && (
                        <View style={styles.eatenBadge}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <View style={styles.mealActions}>
                      <TouchableOpacity
                        style={[styles.eatButton, meal.isEaten && styles.uneatButton]}
                        onPress={() => meal.isEaten ? handleUneatMeal(meal, dayData.dateString) : handleEatMeal(meal, dayData.dateString)}
                      >
                        <Ionicons 
                          name={meal.isEaten ? "close" : "checkmark"} 
                          size={14} 
                          color="white" 
                        />
                      </TouchableOpacity>
                      {!isPast && (
                        <>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.replaceButton]}
                            onPress={() => handleReplaceMeal(meal, dayData.dateString)}
                            disabled={!meal.planId || meal.planId <= 0}
                          >
                            <Ionicons name="refresh" size={12} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteMeal(meal, dayData.dateString)}
                          >
                            <Ionicons name="trash" size={12} color="white" />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyMeal}>Chưa có món ăn</Text>
            )}
          </View>

          {/* Bữa trưa */}
          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>Bữa trưa</Text>
            {dayData.lunch.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dayData.lunch.map((meal, index) => (
                  <View key={meal.id || `lunch-${index}`} style={styles.mealCardContainer}>
                    <TouchableOpacity
                      style={[styles.mealCard, meal.isEaten && styles.eatenMealCard]}
                      onPress={() => handleMealPress(meal)}
                    >
                      <Text style={[styles.mealName, meal.isEaten && styles.eatenMealText]} numberOfLines={2}>
                        {meal.title}
                      </Text>
                      <Text style={[styles.mealCalories, meal.isEaten && styles.eatenMealText]}>{meal.calories}</Text>
                      {meal.isEaten && (
                        <View style={styles.eatenBadge}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <View style={styles.mealActions}>
                      <TouchableOpacity
                        style={[styles.eatButton, meal.isEaten && styles.uneatButton]}
                        onPress={() => meal.isEaten ? handleUneatMeal(meal, dayData.dateString) : handleEatMeal(meal, dayData.dateString)}
                      >
                        <Ionicons 
                          name={meal.isEaten ? "close" : "checkmark"} 
                          size={14} 
                          color="white" 
                        />
                      </TouchableOpacity>
                      {!isPast && (
                        <>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.replaceButton]}
                            onPress={() => handleReplaceMeal(meal, dayData.dateString)}
                            disabled={!meal.planId || meal.planId <= 0}
                          >
                            <Ionicons name="refresh" size={12} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteMeal(meal, dayData.dateString)}
                          >
                            <Ionicons name="trash" size={12} color="white" />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyMeal}>Chưa có món ăn</Text>
            )}
          </View>

          {/* Bữa tối */}
          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>Bữa tối</Text>
            {dayData.dinner.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dayData.dinner.map((meal, index) => (
                  <View key={meal.id || `dinner-${index}`} style={styles.mealCardContainer}>
                    <TouchableOpacity
                      style={[styles.mealCard, meal.isEaten && styles.eatenMealCard]}
                      onPress={() => handleMealPress(meal)}
                    >
                      <Text style={[styles.mealName, meal.isEaten && styles.eatenMealText]} numberOfLines={2}>
                        {meal.title}
                      </Text>
                      <Text style={[styles.mealCalories, meal.isEaten && styles.eatenMealText]}>{meal.calories}</Text>
                      {meal.isEaten && (
                        <View style={styles.eatenBadge}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <View style={styles.mealActions}>
                      <TouchableOpacity
                        style={[styles.eatButton, meal.isEaten && styles.uneatButton]}
                        onPress={() => meal.isEaten ? handleUneatMeal(meal, dayData.dateString) : handleEatMeal(meal, dayData.dateString)}
                      >
                        <Ionicons 
                          name={meal.isEaten ? "close" : "checkmark"} 
                          size={14} 
                          color="white" 
                        />
                      </TouchableOpacity>
                      {!isPast && (
                        <>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.replaceButton]}
                            onPress={() => handleReplaceMeal(meal, dayData.dateString)}
                            disabled={!meal.planId || meal.planId <= 0}
                          >
                            <Ionicons name="refresh" size={12} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteMeal(meal, dayData.dateString)}
                          >
                            <Ionicons name="trash" size={12} color="white" />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyMeal}>Chưa có món ăn</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thực đơn tuần</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Week Navigation */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={handlePreviousWeek} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.weekText}>{formatWeekRange()}</Text>
        <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Auto Replace Button */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.autoReplaceButton}
          onPress={handleAutoReplaceWeekMeals}
        >
          <Ionicons name="refresh" size={18} color="white" />
          <Text style={styles.autoReplaceButtonText}>
            Tự động đổi món từ hôm nay
          </Text>
        </TouchableOpacity>
        
        {/* Debug Button - Đã xóa để push git */}
        {/* <TouchableOpacity 
          style={[styles.autoReplaceButton, { backgroundColor: '#666', marginTop: 8 }]}
          onPress={debugData}
        >
          <Ionicons name="bug" size={18} color="white" />
          <Text style={styles.autoReplaceButtonText}>
            Debug Data
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorDismiss}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải thực đơn tuần...</Text>
        </View>
      )}

      {/* Content */}
      {!isLoading && (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {weeklyData.length > 0 ? (
            weeklyData.map(renderDayMeals)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={COLORS.textDim} />
              <Text style={styles.emptyTitle}>Chưa có thực đơn tuần</Text>
              <Text style={styles.emptyMessage}>
                Hãy tạo thực đơn cho từng ngày để xem tổng quan tuần
              </Text>
            </View>
          )}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    gap: SPACING.xl,
  },
  navButton: {
    padding: SPACING.sm,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  dayContainer: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    borderRadius: RADII.md,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.muted,
  },
  todayHeader: {
    backgroundColor: COLORS.primary,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  todayText: {
    color: 'white',
  },
  dayDate: {
    fontSize: 14,
    color: COLORS.textDim,
  },
  totalCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  mealsContainer: {
    padding: SPACING.md,
  },
  mealSection: {
    marginBottom: SPACING.md,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  mealCardContainer: {
    marginRight: SPACING.sm,
    alignItems: 'center',
  },
  mealCard: {
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADII.sm,
    width: 120,
    minHeight: 60,
    justifyContent: 'center',
    position: 'relative',
  },
  eatenMealCard: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  mealName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  eatenMealText: {
    color: '#2E7D32',
    textDecorationLine: 'line-through',
  },
  mealCalories: {
    fontSize: 10,
    color: COLORS.textDim,
  },
  eatenBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eatButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  uneatButton: {
    backgroundColor: '#F44336',
  },
  mealActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  actionButton: {
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replaceButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtons: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  autoReplaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.md,
    gap: SPACING.xs,
  },
  autoReplaceButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMeal: {
    fontSize: 12,
    color: COLORS.textDim,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffebee',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderRadius: RADII.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    flex: 1,
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
  errorDismiss: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textDim,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default WeeklyMenuScreen;
