import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import MealSection from '../../components/menu/MealSection';

const MenuScreen: React.FC = () => {
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState('Thứ Hai, 8 tháng 9');

  // Sample data
  const breakfastMeals = [
    {
      id: '1',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
    },
  ];

  const lunchMeals = [
    {
      id: '2',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
    },
    {
      id: '3',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
    },
  ];

  const dinnerMeals = [
    {
      id: '4',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
    },
    {
      id: '5',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
    },
  ];

  const handleToggleSelect = (id: string) => {
    setSelectedMeals(prev => 
      prev.includes(id) 
        ? prev.filter(mealId => mealId !== id)
        : [...prev, id]
    );
  };

  const handleMealPress = (meal: any) => {
    console.log('Meal pressed:', meal.title);
  };

  const handleOptionsPress = (meal: any) => {
    console.log('Options pressed for:', meal.title);
  };

  const handleAddAllToShoppingList = () => {
    console.log('Add all to shopping list');
  };

  const handleClearAll = () => {
    setSelectedMeals([]);
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    console.log('Navigate date:', direction);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Thực đơn của tôi</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateContainer}>
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={() => handleDateNavigation('prev')}
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{currentDate}</Text>
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={() => handleDateNavigation('next')}
          >
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <MealSection
          title="Bữa sáng"
          totalCalories="0 kcal"
          meals={breakfastMeals}
          selectedMeals={selectedMeals}
          showDivider={true}
          onMealPress={handleMealPress}
          onToggleSelect={handleToggleSelect}
          onOptionsPress={handleOptionsPress}
        />

        <MealSection
          title="Bữa trưa"
          totalCalories="0 kcal"
          meals={lunchMeals}
          selectedMeals={selectedMeals}
          showDivider={true}
          onMealPress={handleMealPress}
          onToggleSelect={handleToggleSelect}
          onOptionsPress={handleOptionsPress}
        />

        <MealSection
          title="Bữa tối"
          totalCalories="0 kcal"
          meals={dinnerMeals}
          selectedMeals={selectedMeals}
          showDivider={false}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stickyHeader: {
    backgroundColor: COLORS.background,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  moreButton: {
    padding: SPACING.xs,
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
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADII.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default MenuScreen;
