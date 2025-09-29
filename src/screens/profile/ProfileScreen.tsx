import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, SPACING } from '../../utils/theme';
import { NutritionStats } from '../../components/home';
import {
  NavigationHeader,
  UserProfile,
  StickyTabsWithDate,
  NutritionBars,
  TipSection,
  UsedMeals,
} from '../../components/profile';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'nutrition' | 'posts'>('nutrition');
  const { height } = useWindowDimensions();
  
  // Check if screen is short (less than 700px height)
  const isShortScreen = height < 700;

  // Sample user data
  const userData = {
    name: 'Quang Minh',
    accountType: 'FREE',
    avatar: 'https://i.pravatar.cc/100?img=1',
  };

  // Nutrition data
  const nutritionData = {
    targetCalories: 1000,
    consumedCalories: 1000,
    starch: { current: 90, target: 100 },
    protein: { current: 110, target: 100 },
    fat: { current: 90, target: 100 },
  };

  // Nutrition bars data
  const nutritionBars = [
    { label: 'Đường', current: 0, target: 0, unit: 'g', color: COLORS.primary },
    { label: 'Natri (Sodium)', current: 0, target: 0, unit: 'mg', color: COLORS.primary },
    { label: 'Chất béo bão hòa', current: 0, target: 0, unit: 'g', color: COLORS.primary },
    { label: 'Canxi (Calcium)', current: 0, target: 0, unit: 'mg', color: COLORS.primary },
    { label: 'Vitamin D', current: 0, target: 0, unit: 'IU', color: COLORS.primary },
  ];

  // Sample used meals
  const usedMeals = [
    {
      id: '1',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: false,
    },
    {
      id: '2',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa trưa',
      isLocked: false,
    },

    {
      id: '3',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa trưa',
      isLocked: false,
    },
    {
      id: '4',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa trưa',
      isLocked: false,
    },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSettings = () => {
    // Navigate to settings or show settings modal
    console.log('Settings pressed');
  };

  const handleMealPress = (meal: any) => {
    navigation.navigate('MealDetail', { meal });
  };

  const handleTabChange = (tab: 'nutrition' | 'posts') => {
    setActiveTab(tab);
  };

  const handlePreviousDate = () => {
    console.log('Previous date');
  };

  const handleNextDate = () => {
    console.log('Next date');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Navigation Header - Always on top */}
      <NavigationHeader
        onGoBack={handleGoBack}
        onSettings={handleSettings}
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // Make the tabs sticky
      >
        {/* User Profile - Will scroll normally */}
        <UserProfile
          name={userData.name}
          accountType={userData.accountType}
          avatar={userData.avatar}
        />

        {/* Sticky Tabs with Date - Will stick when scrolling */}
        <StickyTabsWithDate
          activeTab={activeTab}
          onTabChange={handleTabChange}
          dateText="Thứ Hai, 8 tháng 9"
          onPreviousDate={handlePreviousDate}
          onNextDate={handleNextDate}
        />

        {/* Content based on active tab */}
        {activeTab === 'nutrition' ? (
          <>
            <NutritionStats
              targetCalories={nutritionData.targetCalories}
              consumedCalories={nutritionData.consumedCalories}
              starch={nutritionData.starch}
              protein={nutritionData.protein}
              fat={nutritionData.fat}
            />
            
            <NutritionBars nutritionBars={nutritionBars} />
            
            <TipSection 
              tipText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices."
            />

            <UsedMeals
              meals={usedMeals}
              onMealPress={handleMealPress}
            />
          </>
        ) : (
          <View style={styles.postsContainer}>
            <Text style={styles.emptyText}>Chưa có bài viết nào</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  postsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
  },
});

export default ProfileScreen;