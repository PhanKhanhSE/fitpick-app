import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { useIngredients } from '../../hooks/useIngredients';
import { useMealPlans } from '../../hooks/useMealPlans';
import { useUser } from '../../hooks/useUser';
import { useProUser } from '../../hooks/useProUser';
import { useFavorites } from '../../hooks/useFavorites';
import { TodayMealPlanDto } from '../../services/mealPlanAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
import { 
  MealSection, 
  MealItemActionModal, 
  MenuActionModal,
  ConfirmDeleteModal, 
  ReplaceSuggestionModal, 
  SuccessModal 
} from '../../components/menu';
import ProUpgradeModal from '../../components/common/ProUpgradeModal';
import { paymentsAPI } from '../../services/paymentAPI';
import { Linking } from 'react-native';

const MenuScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { addMealToProducts, isMealInProductList, loadUserProducts } = useIngredients();
  const { userInfo } = useUser();
  const { isProUser: checkIsProUser, permissions, canViewFutureDates, canPlanFutureMeals } = useProUser();
  
  // Get Pro status as a value using useMemo to avoid calling class as function
  const isPro = useMemo(() => {
    if (typeof checkIsProUser === 'function') {
      return checkIsProUser();
    }
    return permissions?.isProUser || false;
  }, [checkIsProUser, permissions]);
  const { isFavorite, loadFavorites } = useFavorites();
  const { 
    todayMealPlans, 
    loading, 
    error, 
    loadTodayMealPlan, 
    generateMealPlan, 
    swapMeal, 
    deleteMealPlan, 
    replaceMealBySuggestion,
    replaceMealByFavorites,
    addMealToProductList,
    removeMealFromLocalStorage,
    getMealPlansByTime,
    getTotalCalories,
    clearError
  } = useMealPlans();
  
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const isReloadingRef = useRef(false);
  const lastLoadedDateRef = useRef<string>('');
  const lastMealAddedTimestampRef = useRef<number>(0); // Track khi nào có món mới được thêm
  const forceReloadRef = useRef(false); // Flag để force reload khi navigate từ màn hình khác
  
  // Modal states
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showMealActionModal, setShowMealActionModal] = useState(false);
  const [showMenuActionModal, setShowMenuActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Convert TodayMealPlanDto to MealData format for UI
  const convertToMealData = (mealPlan: TodayMealPlanDto) => ({
    id: mealPlan.meal.mealid.toString(),
    title: mealPlan.meal.name,
    calories: `${mealPlan.meal.calories || 0} kcal`,
    time: `${mealPlan.meal.cookingtime || 0} phút`,
    image: { uri: mealPlan.meal.imageUrl || 'https://via.placeholder.com/300x200' },
  });

  // Get meal plans grouped by time
  const { breakfast, lunch, dinner } = getMealPlansByTime();
  
  // Convert to UI format
  const buasangMeals = breakfast.map(convertToMealData);
  const buatruaMeals = lunch.map(convertToMealData);
  const buatoiMeals = dinner.map(convertToMealData);

  // Debug logs đã xóa để push git
  // console.log('🖥️ Debug - MenuScreen render data:');
  // console.log('  - Breakfast meals:', buasangMeals.length, buasangMeals.map(m => m.title));
  // console.log('  - Lunch meals:', buatruaMeals.length, buatruaMeals.map(m => m.title));
  // console.log('  - Dinner meals:', buatoiMeals.length, buatoiMeals.map(m => m.title));

  // Convert menu meal to format expected by MealDetailScreen
  const convertMenuMealToMeal = (meal: any) => {
    return {
      id: meal.id,
      title: meal.title,
      calories: meal.calories,
      price: "0 VND", // Default price
      image: meal.image,
      cookingTime: meal.time,
      ingredients: [
        { name: "Thành phần chính", amount: "200g" },
      ],
      instructions: [
        "Hướng dẫn sẽ được cập nhật sau.",
      ],
    };
  };

  const handleToggleSelect = (id: string) => {
    setSelectedMeals(prev => 
      prev.includes(id) 
        ? prev.filter(mealId => mealId !== id)
        : [...prev, id]
    );
  };

  const handleMealPress = (meal: any) => {
    const convertedMeal = convertMenuMealToMeal(meal);
    navigation.navigate('MealDetail', { meal: convertedMeal });
  };

  const handleOptionsPress = (meal: any) => {
    setSelectedMeal(meal);
    setShowMealActionModal(true);
  };

  const handleMorePress = () => {
    setShowMenuActionModal(true);
  };

  // Modal handlers
  const handleCloseModal = () => {
    setShowMealActionModal(false);
    setShowMenuActionModal(false);
    setShowDeleteModal(false);
    setShowReplaceModal(false);
    setShowSuccessModal(false);
    setShowProUpgradeModal(false);
    setSelectedMeal(null);
  };

  const handleUpgradeToPro = async () => {
    try {
      setShowProUpgradeModal(false);
      const res = await paymentsAPI.createPayment({ plan: 'PRO', amount: 29000, returnUrl: 'fitpick://payments/callback' });
      const url = res?.data?.checkoutUrl || res?.data?.paymentUrl || res?.data?.url || res?.checkoutUrl || res?.paymentUrl || res?.url;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', 'Không nhận được link thanh toán.');
      }
    } catch (e: any) {

      Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán.');
    }
  };

  const handleAddToFavorites = () => {
    setShowMealActionModal(false);
    setSuccessMessage('Đã thêm vào yêu thích');
    setShowSuccessModal(true);
  };

  const handleAddToProductList = async () => {
    if (!selectedMeal) return;
    
    setShowMealActionModal(false);
    
    try {
      // Ensure mealId is a valid number
      const mealId = parseInt(selectedMeal.id);
      if (isNaN(mealId)) {
        setSuccessMessage('Lỗi: Không tìm thấy ID món ăn');
        setShowSuccessModal(true);
        return;
      }
      
      // Use addMealToProducts from useIngredients hook directly for better reliability
      const success = await addMealToProducts(mealId, selectedMeal.title, selectedMeal.image?.uri);
      
      if (success) {
        // Reload user products to sync state
        await loadUserProducts();
        setSuccessMessage('Đã thêm vào danh sách sản phẩm');
        setShowSuccessModal(true);
        
        // Navigate to ProductScreen sau khi thêm thành công
        setTimeout(() => {
          navigation.navigate('MainTabs' as any, { screen: 'Profile' });
        }, 1500);
      } else {
        setSuccessMessage('Không thể thêm vào danh sách sản phẩm');
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error adding meal to product list:', error);
      setSuccessMessage('Không thể thêm vào danh sách sản phẩm');
      setShowSuccessModal(true);
    }
  };

  const handleShowReplaceModal = () => {
    setShowMealActionModal(false);
    setShowReplaceModal(true);
  };

  const handleReplaceFromFavorites = () => {
    setShowMealActionModal(false);
    setSuccessMessage('Đã thay đổi theo danh sách yêu thích');
    setShowSuccessModal(true);
  };

  const handleShowDeleteModal = () => {
    setShowMealActionModal(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMeal) return;
    
    setShowDeleteModal(false);
    
    try {
      // Tìm meal plan tương ứng với meal này
      const mealPlan = todayMealPlans.find(plan => plan.meal.mealid === parseInt(selectedMeal.id));
      
      if (mealPlan) {
        if (mealPlan.planId > 0) {
          // Backend meal - xóa từ database
          const success = await deleteMealPlan(mealPlan.planId);
          
          if (success) {
            setSuccessMessage('Đã xóa món ăn khỏi thực đơn');
            setShowSuccessModal(true);
          } else {
            Alert.alert('Lỗi', 'Không thể xóa món ăn');
          }
        } else {
          // Local meal - xóa từ AsyncStorage
          const success = await removeMealFromLocalStorage(parseInt(selectedMeal.id), mealPlan.date);
          
          if (success) {
            setSuccessMessage('Đã xóa món ăn khỏi thực đơn');
            setShowSuccessModal(true);
            // Reload data để cập nhật UI
            await loadTodayMealPlan(currentDate);
          } else {
            Alert.alert('Lỗi', 'Không thể xóa món ăn');
          }
        }
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy món ăn trong thực đơn');
      }
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể xóa món ăn');
    }
  };

  const handleReplaceByGoal = async () => {
    if (!selectedMeal) return;
    
    setShowReplaceModal(false);
    
    try {
      // Tìm meal plan tương ứng với meal này
      const mealPlan = todayMealPlans.find(plan => plan.meal.mealid === parseInt(selectedMeal.id));
      
      // Debug logs đã xóa để push git
      
      if (mealPlan && mealPlan.planId && mealPlan.planId > 0) {
        // console.log('🔍 Debug - Using planId:', mealPlan.planId);
        const success = await replaceMealBySuggestion(mealPlan.planId);
        
        if (success) {
          setSuccessMessage('Đã thay đổi món theo gợi ý');
          setShowSuccessModal(true);
        } else {
          Alert.alert('Lỗi', 'Không thể thay đổi món theo gợi ý');
        }
      } else {
        // console.error('❌ Debug - Meal plan not found or planId is invalid:', mealPlan);
        Alert.alert(
          'Không thể thay đổi món này', 
          'Món ăn này được thêm từ local storage. Để sử dụng tính năng thay đổi, hãy tạo thực đơn mới từ hệ thống.',
          [
            { text: 'Tạo thực đơn mới', onPress: handleGenerateMealPlan },
            { text: 'Hủy', style: 'cancel' }
          ]
        );
      }
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể thay đổi món theo gợi ý');
    }
  };

  const handleReplaceByFavorites = async () => {
    if (!selectedMeal) return;
    
    setShowReplaceModal(false);
    
    try {
      // Tìm meal plan tương ứng với meal này
      const mealPlan = todayMealPlans.find(plan => plan.meal.mealid === parseInt(selectedMeal.id));
      
      // Debug logs đã xóa để push git
      
      if (mealPlan && mealPlan.planId && mealPlan.planId > 0) {
        // console.log('🔍 Debug - Using planId:', mealPlan.planId);
        const success = await replaceMealByFavorites(mealPlan.planId);
        
        if (success) {
          setSuccessMessage('Đã thay đổi món từ danh sách yêu thích');
          setShowSuccessModal(true);
        } else {
          Alert.alert('Lỗi', 'Không thể thay đổi món từ danh sách yêu thích');
        }
      } else {
        // console.error('❌ Debug - Meal plan not found or planId is invalid:', mealPlan);
        Alert.alert('Lỗi', 'Không thể thay đổi món này. Món ăn này có thể là món được thêm từ local storage.');
      }
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể thay đổi món từ danh sách yêu thích');
    }
  };

  const handleShowDailyView = () => {
    setShowMenuActionModal(false);
    setSuccessMessage('Chuyển sang hiển thị theo ngày');
    setShowSuccessModal(true);
  };

  const handleShowWeeklyView = () => {
    setShowMenuActionModal(false);
    if (isPro) {
      navigation.navigate('WeeklyMenuScreen');
    } else {
      setShowProUpgradeModal(true);
    }
  };

  const handleAddAllToShoppingList = async () => {
    try {
      const allMeals = [...buasangMeals, ...buatruaMeals, ...buatoiMeals];
      let successCount = 0;
      
      for (const meal of allMeals) {
        const success = await addMealToProductList(parseInt(meal.id), meal.title);
        if (success) successCount++;
      }
      
      if (successCount > 0) {
        // Ẩn modal trước
        setShowMenuActionModal(false);
        setSuccessMessage(`Đã thêm ${successCount}/${allMeals.length} món vào danh sách sản phẩm`);
        setShowSuccessModal(true);
        
        // Navigate to ProductScreen sau khi thêm thành công
        setTimeout(() => {
          setShowSuccessModal(false);
          (navigation as any).jumpTo('Profile');
        }, 1500);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm món ăn nào vào danh sách sản phẩm');
      }
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể thêm vào danh sách sản phẩm');
    }
  };

  const handleClearAll = async () => {
    try {
      const allMeals = [...buasangMeals, ...buatruaMeals, ...buatoiMeals];
      let successCount = 0;
      
      for (const meal of allMeals) {
        const mealPlan = todayMealPlans.find(plan => plan.meal.mealid === parseInt(meal.id));
        if (mealPlan) {
          if (mealPlan.planId > 0) {
            // Backend meal - xóa từ database
            const success = await deleteMealPlan(mealPlan.planId);
            if (success) successCount++;
          } else {
            // Local meal - xóa từ AsyncStorage
            const success = await removeMealFromLocalStorage(parseInt(meal.id), mealPlan.date);
            if (success) successCount++;
          }
        }
      }
      
      if (successCount > 0) {
        setSuccessMessage(`Đã xóa ${successCount}/${allMeals.length} món khỏi thực đơn`);
        setShowSuccessModal(true);
        // Reload data để cập nhật UI
        await loadTodayMealPlan(currentDate);
      } else {
        Alert.alert('Lỗi', 'Không thể xóa món ăn nào');
      }
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể xóa tất cả');
    }
  };

  const handleGenerateMealPlan = async () => {
    // Kiểm tra quyền tạo meal plan cho ngày tương lai
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(currentDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today && !canPlanFutureMeals()) {
      setShowProUpgradeModal(true);
      return;
    }
    
    try {
      const success = await generateMealPlan(currentDate);
      
      if (success) {
        setSuccessMessage('Đã tạo thực đơn mới');
        setShowSuccessModal(true);
      } else {
        Alert.alert('Lỗi', 'Không thể tạo thực đơn mới');
      }
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể tạo thực đơn mới');
    }
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      // Kiểm tra quyền xem ngày tương lai
      if (!canViewFutureDates()) {
        // User FREE: chỉ cho phép xem đến hôm nay
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        if (newDate.getTime() >= tomorrow.getTime()) {
          setShowProUpgradeModal(true);
          return;
        }
      }
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };

  // Test function để kiểm tra AsyncStorage
  const testAsyncStorage = async () => {
    try {
      const userAddedMeals = await AsyncStorage.getItem('userAddedMeals');

      if (userAddedMeals) {
        const meals = JSON.parse(userAddedMeals);

        const today = new Date().toISOString().split('T')[0];
        const todayMeals = meals.filter((m: any) => m.date === today);

      }
    } catch (error) {

    }
  };

  // Load data khi component mount và khi currentDate thay đổi
  useEffect(() => {
    // Format date bằng local time để tránh timezone issue (giống WeeklyMenuScreen)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Chỉ load nếu ngày thay đổi hoặc chưa load lần nào, và không đang loading
    if (dateString !== lastLoadedDateRef.current && !isReloadingRef.current && !loading) {
      isReloadingRef.current = true;
      loadTodayMealPlan(currentDate, false).finally(() => {
        lastLoadedDateRef.current = dateString;
        isReloadingRef.current = false;
      });
    }
  }, [currentDate, loadTodayMealPlan, loading]);

  // Reload data khi quay lại screen (chỉ reload nếu ngày thay đổi, chưa load, hoặc có món mới được thêm)
  useFocusEffect(
    React.useCallback(() => {
      // Format date bằng local time để tránh timezone issue (giống WeeklyMenuScreen)
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check xem có món mới được thêm không (từ AsyncStorage)
      const checkForNewMeals = async () => {
        try {
          const lastMealAddedTimestamp = await AsyncStorage.getItem('lastMealAddedTimestamp');
          const timestamp = lastMealAddedTimestamp ? parseInt(lastMealAddedTimestamp) : 0;
          
          // Chỉ reload nếu:
          // 1. Ngày thay đổi (chưa load cho ngày này)
          // 2. Hoặc có món mới được thêm sau lần load cuối (timestamp > lastMealAddedTimestampRef)
          // 3. Hoặc chưa load lần nào (lastLoadedDateRef rỗng)
          // 4. Hoặc force reload flag được set (khi navigate từ màn hình khác sau khi thêm món)
          const shouldReload = !isReloadingRef.current && !loading && (
            dateString !== lastLoadedDateRef.current || 
            (timestamp > 0 && timestamp > lastMealAddedTimestampRef.current) ||
            lastLoadedDateRef.current === '' ||
            forceReloadRef.current
          );
          
          if (shouldReload) {
            isReloadingRef.current = true;
            forceReloadRef.current = false; // Reset force reload flag
            // Force reload nếu có timestamp mới (có món mới được thêm)
            const forceReload = timestamp > 0 && timestamp > lastMealAddedTimestampRef.current;
            loadTodayMealPlan(currentDate, forceReload).finally(() => {
              lastLoadedDateRef.current = dateString;
              // Update timestamp sau khi reload (chỉ nếu timestamp > 0)
              if (timestamp > 0) {
                lastMealAddedTimestampRef.current = timestamp;
              }
              // Reset flag sau một chút để có thể reload lần sau
              setTimeout(() => {
                isReloadingRef.current = false;
              }, 1000);
            });
          }
        } catch (error) {
          console.error('Error checking for new meals:', error);
          // Fallback: reload nếu ngày thay đổi, chưa load, hoặc force reload
          if (!isReloadingRef.current && !loading && (dateString !== lastLoadedDateRef.current || lastLoadedDateRef.current === '' || forceReloadRef.current)) {
            isReloadingRef.current = true;
            forceReloadRef.current = false; // Reset force reload flag
            loadTodayMealPlan(currentDate, forceReloadRef.current).finally(() => {
              lastLoadedDateRef.current = dateString;
              setTimeout(() => {
                isReloadingRef.current = false;
              }, 1000);
            });
          }
        }
      };
      
      checkForNewMeals();
      // Reload favorites to sync with changes from other screens (không block)
      loadFavorites();
    }, [currentDate, loadTodayMealPlan, loadFavorites, loading])
  );

  // Test AsyncStorage chỉ khi mount lần đầu
  useEffect(() => {
    testAsyncStorage();
  }, []);

  // Không cần navigation listener nữa vì useFocusEffect đã handle việc check timestamp

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Thực đơn của tôi</Text>
            {isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateContainer}>
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={() => handleDateNavigation('prev')}
          >
            <Ionicons name="arrow-back-outline" size={18} color="white" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{currentDate.toLocaleDateString('vi-VN')}</Text>
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={() => handleDateNavigation('next')}
          >
            <Ionicons name="arrow-forward-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
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
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      )}

      {/* Content */}
      {!loading && (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <MealSection
            title="Bữa sáng"
            totalCalories={`${getTotalCalories(breakfast)} kcal`}
            meals={buasangMeals}
            selectedMeals={selectedMeals}
            showDivider={true}
            onMealPress={handleMealPress}
            onToggleSelect={handleToggleSelect}
            onOptionsPress={handleOptionsPress}
          />

          <MealSection
            title="Bữa trưa"
            totalCalories={`${getTotalCalories(lunch)} kcal`}
            meals={buatruaMeals}
            selectedMeals={selectedMeals}
            showDivider={true}
            onMealPress={handleMealPress}
            onToggleSelect={handleToggleSelect}
            onOptionsPress={handleOptionsPress}
          />

        <MealSection
          title="Bữa tối"
          totalCalories={`${getTotalCalories(dinner)} kcal`}
          meals={buatoiMeals}
          selectedMeals={selectedMeals}
          showDivider={true}
          onMealPress={handleMealPress}
          onToggleSelect={handleToggleSelect}
          onOptionsPress={handleOptionsPress}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddAllToShoppingList}
          >
            <Text style={styles.primaryButtonText}>
              Thêm tất cả vào danh sách sản phẩm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleClearAll}
          >
            <Text style={styles.secondaryButtonText}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      )}

      {/* Modals */}
      <MealItemActionModal
        visible={showMealActionModal}
        item={selectedMeal}
        onClose={handleCloseModal}
        onAddToFavorites={handleAddToFavorites}
        onAddToProductList={handleAddToProductList}
        onReplaceWithSuggestion={handleShowReplaceModal}
        onReplaceFromFavorites={handleReplaceFromFavorites}
        onDelete={handleShowDeleteModal}
        isInFavorites={selectedMeal ? isFavorite(parseInt(selectedMeal.id)) : false}
        isInProductList={selectedMeal ? isMealInProductList(parseInt(selectedMeal.id)) : false}
      />
      
      <MenuActionModal
        visible={showMenuActionModal}
        onClose={handleCloseModal}
        onShowDailyView={handleShowDailyView}
        onShowWeeklyView={handleShowWeeklyView}
      />
      
      <ConfirmDeleteModal
        visible={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      
      <ReplaceSuggestionModal
        visible={showReplaceModal}
        onClose={handleCloseModal}
        onReplaceByGoal={handleReplaceByGoal}
        onReplaceByFavorites={handleReplaceByFavorites}
      />
      
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleCloseModal}
        message={successMessage}
      />
      
      {/* Pro Upgrade Modal - Chỉ hiển thị cho tài khoản Free */}
      {!isPro && (
        <ProUpgradeModal
          visible={showProUpgradeModal}
          onClose={handleCloseModal}
          onUpgrade={handleUpgradeToPro}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: -SPACING.lg,
  },
  stickyHeader: {
    backgroundColor: COLORS.background,
    marginBottom: -SPACING.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.umd,
    marginTop: -SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  proBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.sm,
    marginLeft: SPACING.sm,
  },
  proText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: SPACING.xs,
    position: 'absolute',
    right: SPACING.umd,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.xxl,
  },
  dateNavButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.lg,
    marginRight: SPACING.lg,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: SPACING.lg,
  },
  content: {
    flex: 1,
  },
  actionButtons: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginBottom: -SPACING.xl,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.umd,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADII.umd,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
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
});

export default MenuScreen;
