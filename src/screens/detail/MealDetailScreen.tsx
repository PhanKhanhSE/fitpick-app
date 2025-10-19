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
import { COLORS } from '../../utils/theme';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions' | 'Nutrition' | 'Reviews'>('Ingredients');
  const [scrollY] = useState(new Animated.Value(0));
  const [quantity, setQuantity] = useState(1);
  const [mealDetail, setMealDetail] = useState<MealDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { meal } = route.params;

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
      loadMealDetail(parseInt(route.params.meal.id));
    }
  }, [route.params?.meal?.id]);

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

  // Chuyển đổi dữ liệu từ API thành format cho components
  const ingredients = mealDetail.ingredients?.map(ing => ({
    name: ing.ingredientName,
    amount: `${ing.quantity || 0}${ing.unit || 'g'}`
  })) || [];

  const instructions = mealDetail.instructions?.map(inst => inst.instruction) || [];

  const handleGoBack = () => navigation.goBack();
  const handleToggleFavorite = () => setIsFavorite(!isFavorite);
  const handleAddToPlan = () => console.log('Add to meal plan');
  const handleAddToFavorites = () => console.log('Add to favorites');
  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
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
        isFavorite={isFavorite}
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
            calories={`${mealDetail.calories} cal`}
            carbs={`${mealDetail.carbs}g`}
            protein={`${mealDetail.protein}g`}
            fat={`${mealDetail.fat}g`}
          />

          {/* Tabs */}
          <MealDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ingredients={ingredients}
            instructions={instructions}
            calories={`${mealDetail.calories} cal`}
            carbs={`${mealDetail.carbs}g`}
            protein={`${mealDetail.protein}g`}
            fat={`${mealDetail.fat}g`}
            rating={4.5}
            reviewCount={12}
            onViewAllReviews={handleViewAllReviews}
          />
        </View>
      </Animated.ScrollView>

      {/* Bottom Buttons */}
      <MealDetailActions
        onAddToPlan={handleAddToPlan}
        onAddToFavorites={handleAddToFavorites}
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
