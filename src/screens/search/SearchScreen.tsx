import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import { PopularSection, SuggestedSection, SearchHistory, FilterModal } from '../../components/search';
import PremiumModal from '../../components/home/PremiumModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AppliedFilters {
  nutritionGoal: boolean;
  mealType: string[];
  ingredients: string[];
  dietType: string[];
  cookingTime: string[];
}

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Search states
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Gà hấp', 'Nước ép cam', 'Cá hồi nướng', 'Sinh tố', 'Cơm tấm', 'Salad trái cây'
  ]);
  
  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    nutritionGoal: false,
    mealType: [],
    ingredients: [],
    dietType: [],
    cookingTime: [],
  });

  // Sample data for popular dishes
  const popularDishes = [
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
      title: 'Thực đơn Premium đặc biệt',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: true,
    },
    {
      id: '3',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: false,
    },
    {
      id: '4',
      title: 'Món ăn VIP (Premium)',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: true,
    },
  ];

  // Sample data for suggested dishes
  const suggestedDishes = [
    {
      id: '3',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: false,
    },
    {
      id: '4',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: false,
    },
    {
      id: '5',
      title: 'Thực đơn Premium đặc biệt',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: true,
    },
    {
      id: '6',
      title: 'Món ăn VIP (Premium)',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: true,
    },
    {
      id: '7',
      title: 'Thực đơn thời thượng (Premium)',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: true,
    },
    {
      id: '8',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: false,
    },
  ];

  const handleFavoritePress = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleMealPress = (meal: any) => {
    if (meal.isLocked) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate('MealDetail', { meal });
    }
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
  };

  const handleUpgrade = () => {
    console.log('Upgrade to premium');
    setShowPremiumModal(false);
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleSearchCancel = () => {
    setIsSearchActive(false);
    setSearchText('');
  };

  const handleSearchHistoryPress = (text: string) => {
    setSearchText(text);
  };

  const handleSearch = (text: string) => {
    if (text.trim() && !searchHistory.includes(text.trim())) {
      setSearchHistory(prev => [text.trim(), ...prev.slice(0, 9)]); // Giữ tối đa 10 items
    }
  };

  const removeHistoryItem = (index: number) => {
    setSearchHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    console.log('Applied filters:', appliedFilters);
  };

  const handleClearFilters = () => {
    setAppliedFilters({
      nutritionGoal: false,
      mealType: [],
      ingredients: [],
      dietType: [],
      cookingTime: [],
    });
  };

  const toggleMealType = (type: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      mealType: prev.mealType.includes(type) 
        ? prev.mealType.filter(t => t !== type)
        : [...prev.mealType, type]
    }));
  };

  const toggleIngredient = (ingredient: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredient) 
        ? prev.ingredients.filter(i => i !== ingredient)
        : [...prev.ingredients, ingredient]
    }));
  };

  const toggleDietType = (diet: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      dietType: prev.dietType.includes(diet) 
        ? prev.dietType.filter(d => d !== diet)
        : [...prev.dietType, diet]
    }));
  };

  const toggleCookingTime = (time: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      cookingTime: prev.cookingTime.includes(time) 
        ? prev.cookingTime.filter(t => t !== time)
        : [...prev.cookingTime, time]
    }));
  };

  if (isSearchActive) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Active Search Header */}
        <View style={styles.activeSearchHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleSearchCancel}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.textStrong} />
          </TouchableOpacity>
          
          <View style={styles.activeSearchInputContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.activeSearchInput}
              value={searchText}
              onChangeText={(text) => {
                console.log('Search text changed:', text);
                setSearchText(text);
              }}
              onSubmitEditing={() => handleSearch(searchText)}
              placeholder="Tìm kiếm"
              placeholderTextColor="#9CA3AF"
              autoFocus
              returnKeyType="search"
              clearButtonMode="while-editing"
              selectTextOnFocus
              editable={true}
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <Ionicons name="reorder-three-outline" size={24} color={COLORS.textStrong} />
          </TouchableOpacity>
        </View>

        {/* Search History */}
        <SearchHistory
          searchHistory={searchHistory}
          onHistoryPress={handleSearchHistoryPress}
          onRemoveItem={removeHistoryItem}
        />

        {/* Filter Modal */}
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          appliedFilters={appliedFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          toggleMealType={toggleMealType}
          toggleIngredient={toggleIngredient}
          toggleDietType={toggleDietType}
          toggleCookingTime={toggleCookingTime}
          setAppliedFilters={setAppliedFilters}
        />

        {/* Premium Modal */}
        <PremiumModal
          visible={showPremiumModal}
          onClose={handleClosePremiumModal}
          onUpgrade={handleUpgrade}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Search Bar */}
      <View style={styles.stickyHeader}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm"
          onFilterPress={handleFilterPress}
          onFocus={handleSearchFocus}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Section */}
        <PopularSection
          data={popularDishes}
          favorites={favorites}
          onMealPress={handleMealPress}
          onFavoritePress={handleFavoritePress}
        />

        {/* Suggested Section */}
        <SuggestedSection
          data={suggestedDishes}
          favorites={favorites}
          onMealPress={handleMealPress}
          onFavoritePress={handleFavoritePress}
        />
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        appliedFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        toggleMealType={toggleMealType}
        toggleIngredient={toggleIngredient}
        toggleDietType={toggleDietType}
        toggleCookingTime={toggleCookingTime}
        setAppliedFilters={setAppliedFilters}
      />

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
  // Active Search Styles
  activeSearchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  activeSearchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    minHeight: 40,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  activeSearchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  filterButton: {
    padding: SPACING.sm,
  },
});

export default SearchScreen;