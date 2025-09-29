import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
import { 
  MealSection, 
  MealItemActionModal, 
  MenuActionModal,
  ConfirmDeleteModal, 
  ReplaceSuggestionModal, 
  SuccessModal 
} from '../../components/menu';

const MenuScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState('Thứ Hai, 8 tháng 9');
  
  // Modal states
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showMealActionModal, setShowMealActionModal] = useState(false);
  const [showMenuActionModal, setShowMenuActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setSelectedMeal(null);
  };

  const handleAddToFavorites = () => {
    setShowMealActionModal(false);
    setSuccessMessage('Đã thêm vào yêu thích');
    setShowSuccessModal(true);
  };

  const handleAddToProductList = () => {
    setShowMealActionModal(false);
    setSuccessMessage('Đã thêm vào danh sách sản phẩm');
    setShowSuccessModal(true);
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

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    setSuccessMessage('Đã xóa món thành công');
    setShowSuccessModal(true);
  };

  const handleReplaceByGoal = () => {
    setShowReplaceModal(false);
    setSuccessMessage('Đã thay đổi theo gợi ý');
    setShowSuccessModal(true);
  };

  const handleReplaceByFavorites = () => {
    setShowReplaceModal(false);
    setSuccessMessage('Đã thay đổi theo danh sách yêu thích');
    setShowSuccessModal(true);
  };

  const handleShowDailyView = () => {
    setShowMenuActionModal(false);
    setSuccessMessage('Chuyển sang hiển thị theo ngày');
    setShowSuccessModal(true);
  };

  const handleShowWeeklyView = () => {
    setShowMenuActionModal(false);
    setSuccessMessage('Tính năng PRO - vui lòng nâng cấp');
    setShowSuccessModal(true);
  };

  const handleAddAllToShoppingList = () => {
    setSuccessMessage('Đã thêm tất cả vào danh sách sản phẩm');
    setShowSuccessModal(true);
  };

  const handleClearAll = () => {
    setSelectedMeals([]);
    setSuccessMessage('Đã xóa tất cả thành công');
    setShowSuccessModal(true);
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
          <Text style={styles.dateText}>{currentDate}</Text>
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={() => handleDateNavigation('next')}
          >
            <Ionicons name="arrow-forward-outline" size={18} color="white" />
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
    paddingVertical: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  moreButton: {
    padding: SPACING.xs,
    position: 'absolute',
    right: SPACING.umd,
    top: SPACING.xs,
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
});

export default MenuScreen;
