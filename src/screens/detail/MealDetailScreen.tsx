import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../utils/theme';
import { useFavorites } from '../../hooks/useFavorites';
import { useIngredients } from '../../hooks/useIngredients';
import { useMealPlans } from '../../hooks/useMealPlans';
import { getMealTimeFromTag, getMealTimeDisplayName } from '../../utils/mealTimeUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MealDetailHeader,
  MealImageOverlay,
  MealTitleQuantity,
  NutritionSummary,
  MealDetailTabs,
  MealDetailActions,
} from '../../components/details';
import { searchAPI, MealDetailData } from '../../services/searchAPI';



interface MealDetailScreenProps {
  route: {
    params: {
      meal: {
        id: string;
        title: string;
        calories?: string;
        carbs?: string;
        protein?: string;
        fat?: string;
        price: string;
        image: any;
        cookingTime?: string;
        ingredients?: Array<{ name: string; amount: string }>;
        substitutions?: Array<{ original: string; substitute: string }>;
        instructions?: Array<string>;
      };
    };
  };
  navigation: any;
}

const MealDetailScreen: React.FC<MealDetailScreenProps> = ({ route, navigation }) => {
  const { meal } = route.params;
  const { isFavorite: isMealFavorite, toggleFavorite } = useFavorites();
  const { addMealToProducts, getMealQuantity, saveMealQuantity } = useIngredients();
  const { addMealToMenu, isMealInPlan } = useMealPlans();
  
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions' | 'Nutrition' | 'Reviews'>('Ingredients');
  const [scrollY] = useState(new Animated.Value(0));
  const [quantity, setQuantity] = useState(1);
  const [mealDetail, setMealDetail] = useState<MealDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInProductList, setIsInProductList] = useState(false);

  // Kiểm tra xem meal có trong product list không
  const checkIfInProductList = async (mealId: number) => {
    try {
      const savedMealIds = await AsyncStorage.getItem('userProductMealIds');
      if (savedMealIds) {
        const mealIds: number[] = JSON.parse(savedMealIds);
        setIsInProductList(mealIds.includes(mealId));
      }
    } catch (error) {
      console.error('Error checking product list:', error);
    }
  };

  // Load meal detail từ API
  const loadMealDetail = async (mealId: number) => {
    try {
      setIsLoading(true);
      const response = await searchAPI.getMealDetail(mealId);
      
      if (response.success && response.data) {
        setMealDetail(response.data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin món ăn');
      }
    } catch (error) {
      console.error('Error loading meal detail:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin món ăn');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.meal?.id) {
      const mealId = parseInt(route.params.meal.id);
      loadMealDetail(mealId);
      checkIfInProductList(mealId);
      
      // Load số lượng đã lưu
      const loadSavedQuantity = async () => {
        const savedQuantity = await getMealQuantity(mealId);
        setQuantity(savedQuantity);
      };
      loadSavedQuantity();
    }
  }, [route.params?.meal?.id]);

  // Theo dõi thay đổi số lượng từ ProductScreen (đồng bộ 2 chiều)
  useEffect(() => {
    if (route.params?.meal?.id) {
      const mealId = parseInt(route.params.meal.id);
      const interval = setInterval(async () => {
        const savedQuantity = await getMealQuantity(mealId);
        if (savedQuantity !== quantity) {
          setQuantity(savedQuantity);
        }
      }, 1000); // Check mỗi giây

      return () => clearInterval(interval);
    }
  }, [route.params?.meal?.id, quantity]);

  // Render loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F63E7C" />
          <Text style={styles.loadingText}>Đang tải thông tin món ăn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error
  if (!mealDetail) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin món ăn</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Chuyển đổi dữ liệu từ API thành format cho components với tính toán theo số lượng
  const ingredients = mealDetail.ingredients?.map(ing => ({
    name: ing.ingredientName,
    amount: `${((ing.quantity || 0) * quantity).toFixed(1)}${ing.unit || 'g'}`
  })) || [];

  const instructions = mealDetail.instructions?.map(inst => inst.instruction) || [];

  // Tính toán dinh dưỡng theo số lượng
  const calculatedCalories = mealDetail.calories ? (mealDetail.calories * quantity).toFixed(0) : '0';
  const calculatedProtein = mealDetail.protein ? (mealDetail.protein * quantity).toFixed(1) : '0';
  const calculatedCarbs = mealDetail.carbs ? (mealDetail.carbs * quantity).toFixed(1) : '0';
  const calculatedFat = mealDetail.fat ? (mealDetail.fat * quantity).toFixed(1) : '0';

  const handleGoBack = () => navigation.goBack();
  const handleToggleFavorite = async () => {
    const mealId = parseInt(meal.id);
    await toggleFavorite(mealId);
  };
  const handleAddToPlan = async () => {
    if (!mealDetail) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin món ăn');
      return;
    }

    try {
      // Xác định bữa ăn dựa vào tag/category
      const mealTime = getMealTimeFromTag(
        mealDetail.tags?.join(' ') || '', 
        mealDetail.categoryName
      );
      
      const mealTimeDisplay = getMealTimeDisplayName(mealTime);
      
      // Hiển thị confirmation dialog
      Alert.alert(
        'Thêm vào thực đơn',
        `Món ăn "${meal.title}" sẽ được thêm vào ${mealTimeDisplay}. Bạn có muốn tiếp tục?`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Thêm',
            onPress: async () => {
              const mealId = parseInt(meal.id);
              const today = new Date();
              
              const success = await addMealToMenu(mealId, today, mealTime);
              
              if (success) {
                Alert.alert(
                  'Thành công', 
                  `Đã thêm "${meal.title}" vào ${mealTimeDisplay}`,
                  [
                    {
                      text: 'Xem thực đơn',
                      onPress: () => {
                        navigation.navigate('MainTabs' as any, { screen: 'Menu' });
                      }
                    },
                    {
                      text: 'OK',
                      style: 'default'
                    }
                  ]
                );
              } else {
                Alert.alert('Lỗi', 'Không thể thêm món ăn vào thực đơn');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding to plan:', error);
      Alert.alert('Lỗi', 'Không thể thêm món ăn vào thực đơn');
    }
  };

  const handleAddToProductList = async () => {
    const mealId = parseInt(meal.id);
    const success = await addMealToProducts(mealId, meal.title);
    
    if (success) {
      setIsInProductList(true); // Cập nhật state
      Alert.alert('Thành công', 'Đã thêm vào danh sách sản phẩm');
      // Navigate to ProductScreen tab thay vì stack screen
      navigation.navigate('MainTabs', { screen: 'Profile' });
    } else {
      Alert.alert('Lỗi', 'Không thể thêm vào danh sách sản phẩm');
    }
  };
  const increaseQty = async () => {
    const mealId = parseInt(meal.id);
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await saveMealQuantity(mealId, newQuantity);
  };
  
  const decreaseQty = async () => {
    const mealId = parseInt(meal.id);
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    await saveMealQuantity(mealId, newQuantity);
  };
  const handleViewAllReviews = () => {
    navigation.navigate('ReviewsScreen', { 
      mealId: meal.id,
      mealTitle: meal.title 
    });
  };

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['transparent', COLORS.background],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header Overlay */}
      <MealDetailHeader
        onGoBack={handleGoBack}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isMealFavorite(parseInt(meal.id))}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Image */}
        <MealImageOverlay
          image={{ uri: mealDetail.imageUrl }}
          cookingTime={`${mealDetail.cookingtime} phút`}
          rating={4.5}
          reviewCount={12}
        />

        {/* Title + Quantity + Nutrition */}
        <View style={styles.contentContainer}>
          {/* Meal Title + Quantity Row */}
          <MealTitleQuantity
            title={mealDetail.name}
            quantity={quantity}
            onIncreaseQuantity={increaseQty}
            onDecreaseQuantity={decreaseQty}
          />

          {/* Nutrition Summary */}
          <NutritionSummary
            calories={`${calculatedCalories} cal`}
            carbs={`${calculatedCarbs}g`}
            protein={`${calculatedProtein}g`}
            fat={`${calculatedFat}g`}
          />

          {/* Tabs */}
          <MealDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ingredients={ingredients}
            instructions={instructions}
            calories={`${calculatedCalories} cal`}
            carbs={`${calculatedCarbs}g`}
            protein={`${calculatedProtein}g`}
            fat={`${calculatedFat}g`}
            rating={4.5}
            reviewCount={12}
            onViewAllReviews={handleViewAllReviews}
          />
        </View>
      </Animated.ScrollView>

      {/* Bottom Buttons */}
      <MealDetailActions
        onAddToPlan={handleAddToPlan}
        onAddToProductList={handleAddToProductList}
        isInProductList={isInProductList}
        isInMealPlan={isMealInPlan(parseInt(meal.id))}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  contentContainer: { 
    padding: 16 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default MealDetailScreen;
