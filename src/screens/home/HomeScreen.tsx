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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('personal'); // 'personal' or 'community'
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  // State cho dữ liệu từ API
  const [nutritionData, setNutritionData] = useState({
    targetCalories: 0,
    consumedCalories: 0,
    starch: { current: 0, target: 0 },
    protein: { current: 0, target: 0 },
    fat: { current: 0, target: 0 },
  });

  const [myMealData, setMyMealData] = useState([]);
  const [suggestedMeals, setSuggestedMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dữ liệu từ API
  useEffect(() => {
    if (selectedTab === 'personal') {
      loadPersonalData();
    }
  }, [selectedTab]);

  const loadPersonalData = async () => {
    try {
      setIsLoading(true);
      
      const [nutritionResponse, mealsResponse] = await Promise.all([
        userProfileAPI.getNutritionStats(),
        userProfileAPI.getUserMeals()
      ]);

      if (nutritionResponse.success && nutritionResponse.data) {
        setNutritionData(nutritionResponse.data);
      }

      if (mealsResponse.success && mealsResponse.data) {
        setMyMealData(mealsResponse.data);
      }

      // Suggested meals có thể lấy từ API khác hoặc giữ dữ liệu mẫu
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
      setMyMealData([]);
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
              mealData={myMealData}
              onMealPress={handleMealPress}
              onSeeMore={handleSeeMoreMenu}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
