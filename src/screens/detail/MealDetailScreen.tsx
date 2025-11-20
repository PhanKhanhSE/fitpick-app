import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { useMealHistory } from '../../hooks/useMealHistory';
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
import { mealReviewAPI, MealReview } from '../../services/mealReviewAPI';



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
  const { isFavorite: isMealFavorite, toggleFavorite, loadFavorites } = useFavorites();
  const { addMealToProducts, getMealQuantity, saveMealQuantity, isMealInProductList, loadUserProducts } = useIngredients();
  const { addMealToMenu, isMealInPlan, loadTodayMealPlan } = useMealPlans();
  const { isMealEatenToday, markMealAsEaten, unmarkMealAsEaten, loading: _mealHistoryLoading } = useMealHistory();
  
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions' | 'Nutrition' | 'Reviews'>('Ingredients');
  const [scrollY] = useState(new Animated.Value(0));
  const [quantity, setQuantity] = useState(1);
  const [mealDetail, setMealDetail] = useState<MealDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Không cần state isInProductList, dùng isMealInProductList từ hook
  const [reviews, setReviews] = useState<any[]>([]);
  const [_reviewsLoading, setReviewsLoading] = useState(false);
  const [userReview, setUserReview] = useState<any>(null);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });

  // Không cần checkIfInProductList nữa, dùng isMealInProductList từ hook

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
      Alert.alert('Lỗi', 'Không thể tải thông tin món ăn');
    } finally {
      setIsLoading(false);
    }
  };

  // Load reviews từ API
  const loadReviews = async (mealId: number) => {
    try {
      setReviewsLoading(true);
      
      // Load tất cả reviews, user review và rating stats song song
      const [reviewsResponse, userReviewResponse, ratingStatsResponse] = await Promise.all([
        mealReviewAPI.getMealReviews(mealId),
        mealReviewAPI.getUserReview(mealId),
        mealReviewAPI.getMealRatingStats(mealId)
      ]);
      
      // Xử lý reviews
      if (reviewsResponse.success) {
        const convertedReviews = reviewsResponse.data.map((review: MealReview) => {
          // Ưu tiên avatar từ API, nếu không có thì dùng fallback
          let avatarUrl = review.userAvatar;
          if (!avatarUrl || avatarUrl.trim() === '') {
            // Tạo avatar dựa trên userName thay vì reviewId
            const userNameHash = review.userName.split('').reduce((a, b) => {
              a = ((a << 5) - a) + b.charCodeAt(0);
              return a & a;
            }, 0);
            avatarUrl = `https://i.pravatar.cc/100?img=${Math.abs(userNameHash) % 70 + 1}`;
          }
          
          return {
            id: review.reviewId.toString(),
            user: review.userName,
            date: formatDate(review.createdAt),
            rating: review.rating,
            content: review.comment,
            avatar: avatarUrl
          };
        });
        
        setReviews(convertedReviews);
      } else {
        setReviews([]);
      }
      
      // Xử lý user review
      if (userReviewResponse.success && userReviewResponse.data) {
        // Xử lý avatar cho user review
        let userAvatarUrl = userReviewResponse.data.userAvatar;
        if (!userAvatarUrl || userAvatarUrl.trim() === '') {
          // Tạo avatar dựa trên userName
          const userNameHash = userReviewResponse.data.userName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          userAvatarUrl = `https://i.pravatar.cc/100?img=${Math.abs(userNameHash) % 70 + 1}`;
        }
        
        const convertedUserReview = {
          id: userReviewResponse.data.reviewId.toString(),
          user: userReviewResponse.data.userName,
          date: formatDate(userReviewResponse.data.createdAt),
          rating: userReviewResponse.data.rating,
          content: userReviewResponse.data.comment,
          avatar: userAvatarUrl
        };
        setUserReview(convertedUserReview);
      } else {
        setUserReview(null);
      }
      
      // Xử lý rating stats
      if (ratingStatsResponse.success) {
        setRatingStats({
          averageRating: ratingStatsResponse.data.averageRating,
          totalReviews: ratingStatsResponse.data.totalReviews
        });
      }
      
    } catch (error: any) {
      setReviews([]);
      setUserReview(null);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày`;
    
    return date.toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    if (route.params?.meal?.id) {
      const mealId = parseInt(route.params.meal.id);
      loadMealDetail(mealId);
      checkIfInProductList(mealId);
      loadReviews(mealId);
      
      // Load số lượng đã lưu
      const loadSavedQuantity = async () => {
        const savedQuantity = await getMealQuantity(mealId);
        setQuantity(savedQuantity);
      };
      loadSavedQuantity();
    }
  }, [route.params?.meal?.id]);

  // Reload state when screen comes into focus to sync (chỉ reload khi cần)
  useFocusEffect(
    React.useCallback(() => {
      // Chỉ reload favorites và products để đồng bộ state (ẩn nút nếu đã thêm)
      // Không reload meal plans vì chỉ cần check từ state hiện tại
      loadFavorites();
      loadUserProducts(false); // Không force reload, dùng cache nếu có
    }, [loadFavorites, loadUserProducts])
  );

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
          <ActivityIndicator size="large" color={COLORS.primary} />
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
                // Reload meal plans để cập nhật state (ẩn nút nếu đã thêm)
                // Không cần reload ngay, sẽ reload khi MenuScreen focus
                
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
      Alert.alert('Lỗi', 'Không thể thêm món ăn vào thực đơn');
    }
  };

  const handleAddToProductList = async () => {
    const mealId = parseInt(meal.id);
    const success = await addMealToProducts(mealId, meal.title);
    
    if (success) {
      // Reload user products để cập nhật state (ẩn nút nếu đã thêm)
      await loadUserProducts(true); // Force reload
      
      Alert.alert(
        'Thành công', 
        `Đã thêm "${meal.title}" vào danh sách sản phẩm`,
        [
          {
            text: 'Xem danh sách',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'Profile' });
            }
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
    } else {
      Alert.alert('Lỗi', 'Không thể thêm vào danh sách sản phẩm');
    }
  };

  // Handler để đánh dấu đã ăn
  const handleMarkAsEaten = async () => {
    try {
      const mealId = parseInt(meal.id);
      const calories = parseInt(meal.calories || '0');
      
      await markMealAsEaten(mealId, calories, quantity);
    } catch (error) {
      // Error marking meal as eaten
    }
  };

  // Handler để bỏ đánh dấu đã ăn
  const handleUnmarkAsEaten = async () => {
    try {
      const mealId = parseInt(meal.id);
      
      await unmarkMealAsEaten(mealId);
    } catch (error) {
      // Error unmarking meal as eaten
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
          rating={ratingStats.averageRating}
          reviewCount={ratingStats.totalReviews}
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
            rating={ratingStats.averageRating}
            reviewCount={ratingStats.totalReviews}
            onViewAllReviews={handleViewAllReviews}
            reviews={reviews}
            userReview={userReview}
            onEditReview={() => handleViewAllReviews()}
            onDeleteReview={async () => {
              const mealId = parseInt(route.params.meal.id);
              try {
                await mealReviewAPI.deleteReview(mealId);
                await loadReviews(mealId); // Reload reviews
                Alert.alert('Thành công', 'Đã xóa nhận xét');
              } catch (error) {
                Alert.alert('Lỗi', 'Không thể xóa nhận xét');
              }
            }}
          />
        </View>
      </Animated.ScrollView>

      {/* Bottom Buttons */}
      <MealDetailActions
        onAddToPlan={handleAddToPlan}
        onAddToProductList={handleAddToProductList}
        onMarkAsEaten={handleMarkAsEaten}
        onUnmarkAsEaten={handleUnmarkAsEaten}
        isInProductList={route.params?.meal?.id ? isMealInProductList(parseInt(meal.id)) : false}
        isInMealPlan={route.params?.meal?.id ? isMealInPlan(parseInt(meal.id), new Date()) : false}
        isEaten={isMealEatenToday(parseInt(meal.id))}
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
