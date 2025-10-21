import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import NutritionStats from '../../components/home/NutritionStats';
import MyMenuSection from '../../components/home/personal/MyMenuSection';
import SuggestedSection from '../../components/home/personal/SuggestedSection';
import PremiumModal from '../../components/home/PremiumModal';
import CommunityScreen from './community/CommunityScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { userProfileAPI } from '../../services/userProfileAPI';
import { searchAPI } from '../../services/searchAPI';
import { convertCategoryToVietnamese } from '../../utils/categoryMapping';
import { useFavorites } from '../../hooks/useFavorites';
import { useMealPlans } from '../../hooks/useMealPlans';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBadge from '../../components/NotificationBadge';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('personal'); // 'personal' or 'community'
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  
  // Use favorites hook for global state management
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Use meal plans hook for today's meals
  const { todayMealPlans, loadTodayMealPlan } = useMealPlans();

  // Use notifications hook for unread count
  const { unreadCount } = useNotifications();

  // State cho dữ liệu từ API
  const [nutritionData, setNutritionData] = useState({
    targetCalories: 0,
    consumedCalories: 0,
    starch: { current: 0, target: 0 },
    protein: { current: 0, target: 0 },
    fat: { current: 0, target: 0 },
  });

  const [suggestedMeals, setSuggestedMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dữ liệu từ API
  useEffect(() => {
    if (selectedTab === 'personal') {
      loadPersonalData();
      // Load today's meal plan
      loadTodayMealPlan();
    }
  }, [selectedTab]);

  const loadSuggestedMeals = async () => {
    try {
      const response = await searchAPI.searchMeals({ 
        dietType: 'light',
        maxCalories: 500,
        minCalories: 200
      });
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Convert API data to component format
        const suggestedData = response.data.slice(0, 6).map((meal: any) => ({
          id: meal.mealid?.toString() || meal.id?.toString() || Math.random().toString(),
          title: meal.name || meal.title || 'Món ăn',
          calories: `${meal.calories || 0} kcal`,
          time: `${meal.cookingTime || 15} phút`,
          image: { uri: meal.imageUrl || meal.image || 'https://via.placeholder.com/200x150' },
          tag: convertCategoryToVietnamese(meal.categoryName || 'Gợi ý'),
          isLocked: false,
        }));
        setSuggestedMeals(suggestedData);
      } else {
        // Fallback to default data
        setSuggestedMeals([
          {
            id: '1',
            title: 'Salad bơ cá hồi',
            calories: '350 kcal',
            time: '15 phút',
            image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
            tag: 'Gợi ý',
            isLocked: false,
          },
          {
            id: '2',
            title: 'Cơm gà nướng',
            calories: '450 kcal',
            time: '25 phút',
            image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
            tag: 'Gợi ý',
            isLocked: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading suggested meals:', error);
      // Set default data on error
      setSuggestedMeals([
        {
          id: '1',
          title: 'Salad bơ cá hồi',
          calories: '350 kcal',
          time: '15 phút',
          image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
          tag: 'Gợi ý',
          isLocked: false,
        },
        {
          id: '2',
          title: 'Cơm gà nướng',
          calories: '450 kcal',
          time: '25 phút',
          image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
          tag: 'Gợi ý',
          isLocked: false,
        },
      ]);
    }
  };

  const loadPersonalData = async () => {
    try {
      setIsLoading(true);
      
      const nutritionResponse = await userProfileAPI.getNutritionStats();

      if (nutritionResponse.success && nutritionResponse.data) {
        setNutritionData(nutritionResponse.data);
      }

      // Load suggested meals from API
      await loadSuggestedMeals();
    } catch (error) {
      console.error('Error loading personal data:', error);
      // Fallback to default data
      setNutritionData({
        targetCalories: 2000,
        consumedCalories: 0,
        starch: { current: 0, target: 100 },
        protein: { current: 0, target: 100 },
        fat: { current: 0, target: 100 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleMealPress = (meal: any) => {
    if (meal.isLocked) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate('MealDetail', { meal });
    }
  };

  const handlePremiumPress = () => {
    setShowPremiumModal(true);
  };

  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
  };

  const handleUpgrade = () => {
    // Handle upgrade logic here
    console.log('Upgrade to premium');
    setShowPremiumModal(false);
  };

  const handleSeeMore = () => {
    // Navigate to SearchScreen (same as explore more)
    (navigation as any).jumpTo('Explore');
  };

  const handleExploreMore = () => {
    // Navigate to SearchScreen with some default filters
    (navigation as any).jumpTo('Explore');
  };

  const handleSeeMoreMenu = () => {
    (navigation as any).jumpTo('Menu');
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('NotificationsScreen');
  };

  const handlePersonalNutritionPress = () => {
    navigation.navigate('PersonalNutritionScreen');
  };

  // Convert todayMealPlans to MyMenuSection format
  const convertMealPlansToMenuData = () => {
    if (!todayMealPlans || todayMealPlans.length === 0) {
      return [];
    }

    return todayMealPlans.map((mealPlan) => ({
      id: mealPlan.meal.mealid.toString(),
      title: mealPlan.meal.name,
      calories: `${mealPlan.meal.calories} kcal`,
      time: `${mealPlan.meal.cookingtime} phút`,
      image: { uri: mealPlan.meal.imageUrl || 'https://via.placeholder.com/200x150' },
      tag: mealPlan.meal.categoryName || 'Thực đơn',
      isLocked: mealPlan.meal.isPremium || false,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Tabs - Sticky */}
      <View style={styles.stickyHeader}>
        <View style={styles.header}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, selectedTab === 'personal' && styles.activeTab]}
              onPress={() => handleTabPress('personal')}
            >
              <Text style={[styles.tabText, selectedTab === 'personal' && styles.activeTabText]}>
                Dành cho bạn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, selectedTab === 'community' && styles.activeTab]}
              onPress={() => handleTabPress('community')}
            >
              <Text style={[styles.tabText, selectedTab === 'community' && styles.activeTabText]}>
                Cộng đồng
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotificationsPress}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
              <NotificationBadge count={unreadCount} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
              <Ionicons name="person-circle-outline" size={32} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {selectedTab === 'personal' ? (
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Nutrition Stats */}
            <NutritionStats
              targetCalories={nutritionData.targetCalories}
              consumedCalories={nutritionData.consumedCalories}
              starch={nutritionData.starch}
              protein={nutritionData.protein}
              fat={nutritionData.fat}
              onPress={handlePersonalNutritionPress}
            />
            
            {/* My Menu Section */}
            <MyMenuSection 
              mealData={convertMealPlansToMenuData()}
              onMealPress={handleMealPress}
              onSeeMore={handleSeeMoreMenu}
              isFavorite={isFavorite}
              onFavoritePress={toggleFavorite}
            />

            {/* Premium Upgrade */}
            <View style={styles.premiumSection}>
              <Text style={styles.premiumText}>Có ngày thực đơn mới, gợi ý riêng cho bạn mỗi tuần.</Text>
              <TouchableOpacity style={styles.premiumButton} onPress={handlePremiumPress}>
                <Text style={styles.premiumButtonText}>Nâng cấp lên Premium</Text>
              </TouchableOpacity>
            </View>

            {/* Suggested Dishes Section */}
            <SuggestedSection 
              mealData={suggestedMeals}
              onMealPress={handleMealPress}
              onSeeMore={handleSeeMore}
              onExploreMore={handleExploreMore}
              isFavorite={isFavorite}
              onFavoritePress={toggleFavorite}
            />
          </ScrollView>
        )
      ) : (
        <View style={styles.communityContainer}>
          <CommunityScreen />
        </View>
      )}

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={handleClosePremiumModal}
        onUpgrade={handleUpgrade}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    elevation: 3,
    zIndex: 1000,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: -SPACING.md,
    marginRight: SPACING.md,
    paddingBottom: -SPACING.md,

  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,  
  },
  tabText: {
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: SPACING.md,
  },
  premiumSection: {
    marginHorizontal: SPACING.md,
    borderRadius: RADII.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  premiumText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    lineHeight: 25,
  },
  premiumButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.umd,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.umd,
  },
  premiumButtonText: {
    color: 'white',
    fontSize: 14,
  },
  communityContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textDim,
  },
});

export default HomeScreen;
