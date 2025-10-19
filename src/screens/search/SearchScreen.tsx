import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import { PopularSection, SuggestedSection, SearchHistory, FilterModal } from '../../components/search';
import PremiumModal from '../../components/home/PremiumModal';
import { searchAPI, SearchFilters, MealData } from '../../services/searchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertCategoryToVietnamese } from '../../utils/categoryMapping';
import { useFavorites } from '../../hooks/useFavorites';

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
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Favorites hook
  const { favorites, toggleFavorite, isFavorite } = useFavorites(); // TypeScript: favorites is string[]
  
  // Search states
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<MealData[]>([]);
  const [popularMeals, setPopularMeals] = useState<MealData[]>([]);
  const [suggestedMeals, setSuggestedMeals] = useState<MealData[]>([]);
  const [defaultSuggestedMeals, setDefaultSuggestedMeals] = useState<MealData[]>([]);
  
  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    nutritionGoal: false,
    mealType: [],
    ingredients: [],
    dietType: [],
    cookingTime: [],
  });

  // Load initial data and search history
  useEffect(() => {
    loadInitialData();
    loadSearchHistory();
  }, []);

  // Load initial data (popular and suggested meals)
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Load popular meals - get all meals and take first 10
      const popularResponse = await searchAPI.getPopularMeals();
      let popularData: MealData[] = [];
      if (popularResponse.success && popularResponse.data) {
        popularData = Array.isArray(popularResponse.data) ? popularResponse.data.slice(0, 10) : [];
        setPopularMeals(popularData);
      }

      // Load suggested meals - get meals with different criteria to avoid overlap
      const suggestedResponse = await searchAPI.searchMeals({ 
        dietType: 'light',
        maxCalories: 400,
        minCalories: 200 // Add minimum calories to differentiate from popular
      });
      if (suggestedResponse.success && suggestedResponse.data) {
        const suggestedData = Array.isArray(suggestedResponse.data) ? suggestedResponse.data.slice(0, 8) : [];
        
        // Filter out meals that are already in popular to avoid duplication
        const popularMealIds = popularData.map((meal: MealData) => meal.mealid);
        const filteredSuggestedData = suggestedData.filter((meal: MealData) => 
          !popularMealIds.includes(meal.mealid)
        );
        
        setSuggestedMeals(filteredSuggestedData);
        setDefaultSuggestedMeals(filteredSuggestedData); // Store default suggested meals
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load search history from AsyncStorage
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  // Save search history to AsyncStorage
  const saveSearchHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Convert backend meal data to frontend format
  const convertMealData = (meal: MealData) => ({
    id: meal.mealid.toString(),
    title: meal.name,
    calories: meal.calories ? `${meal.calories} kcal` : '0 kcal',
    time: meal.cookingtime ? `${meal.cookingtime} phút` : '0 phút',
    image: { uri: meal.imageUrl || 'https://via.placeholder.com/150' },
    tag: convertCategoryToVietnamese(meal.categoryName || 'Món ăn'),
    isLocked: meal.isPremium || false,
    isFavorite: isFavorite(meal.mealid),
    description: meal.description || '',
    price: meal.price || 0,
    dietType: meal.diettype || '',
    protein: meal.protein || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0,
    instructions: meal.instructions || [],
  });

  // Handle search with text
  const handleSearch = async (text: string) => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      
      // Load popular search results (first 10 results)
      const popularResponse = await searchAPI.searchByText(text.trim());
      let popularData: MealData[] = [];
      if (popularResponse.success && popularResponse.data) {
        popularData = Array.isArray(popularResponse.data) ? popularResponse.data.slice(0, 10) : [];
        setSearchResults(popularData);
      }

      // Load suggested search results (different criteria for variety)
      const suggestedResponse = await searchAPI.searchMeals({ 
        name: text.trim(), // Search by name
        dietType: 'vegetarian', // Different diet type for variety
        maxCalories: 600,
        minCalories: 100
      });
      if (suggestedResponse.success && suggestedResponse.data) {
        const suggestedData = Array.isArray(suggestedResponse.data) ? suggestedResponse.data.slice(0, 8) : [];
        setSuggestedMeals(suggestedData);
      } else {
        // Fallback: try with different criteria if first attempt fails
        try {
          const fallbackResponse = await searchAPI.searchMeals({ 
            name: text.trim(),
            maxCalories: 400,
            minCalories: 200
          });
          if (fallbackResponse.success && fallbackResponse.data) {
            const fallbackData = Array.isArray(fallbackResponse.data) ? fallbackResponse.data.slice(0, 8) : [];
            setSuggestedMeals(fallbackData);
          }
        } catch (fallbackError) {
          console.log('Fallback suggestion search failed:', fallbackError);
          setSuggestedMeals([]);
        }
      }
      
      // Add to search history
      if (!searchHistory.includes(text.trim())) {
        const newHistory = [text.trim(), ...searchHistory.slice(0, 9)]; // Keep max 10 items
        setSearchHistory(newHistory);
        await saveSearchHistory(newHistory);
      }
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm. Vui lòng thử lại.');
      setSearchResults([]);
      setSuggestedMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with filters
  const handleSearchWithFilters = async () => {
    try {
      setIsLoading(true);
      
      const filters: SearchFilters = {};
      
      // Convert frontend filters to backend format
      if (appliedFilters.dietType.length > 0) {
        filters.dietType = appliedFilters.dietType[0]; // Backend expects single diet type
      }
      
      // Add cooking time filters
      if (appliedFilters.cookingTime.includes('≤ 15 phút')) {
        filters.maxCookingTime = 15;
      } else if (appliedFilters.cookingTime.includes('≤ 30 phút')) {
        filters.maxCookingTime = 30;
      } else if (appliedFilters.cookingTime.includes('≤ 60 phút')) {
        filters.maxCookingTime = 60;
      }

      const response = await searchAPI.searchMeals(filters);
      
      if (response.success && response.data) {
        const searchData = Array.isArray(response.data) ? response.data : [];
        setSearchResults(searchData);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching with filters:', error);
      Alert.alert('Lỗi', 'Không thể áp dụng bộ lọc. Vui lòng thử lại.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoritePress = async (id: string) => {
    const mealId = parseInt(id);
    if (!isNaN(mealId)) {
      const success = await toggleFavorite(mealId);
      if (success) {
        // Update local state if needed
        console.log(`Meal ${mealId} favorite status updated`);
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại.');
      }
    }
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

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    
    // Auto reset when search text is empty
    if (text.trim() === '') {
      setSearchResults([]);
      setSuggestedMeals(defaultSuggestedMeals); // Restore default suggested meals
      setIsSearchActive(false);
    }
  };

  const handleSearchCancel = () => {
    setIsSearchActive(false);
    setSearchText('');
    setSearchResults([]);
    setSuggestedMeals(defaultSuggestedMeals); // Restore default suggested meals
  };

  const handleSearchHistoryPress = (text: string) => {
    handleSearchTextChange(text);
    handleSearch(text);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      handleSearch(searchText.trim());
    }
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    handleSearchWithFilters();
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

  const removeHistoryItem = async (index: number) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
    await saveSearchHistory(newHistory);
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Search Bar */}
      <View style={styles.stickyHeader}>
        <SearchBar
          value={searchText}
          onChangeText={handleSearchTextChange}
          placeholder="Tìm kiếm"
          onFilterPress={handleFilterPress}
          onFocus={handleSearchFocus}
          onSubmitEditing={handleSearchSubmit}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 85 } // 85 là chiều cao bottom tab
        ]}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        {/* Search Results - Popular Section */}
        {searchResults.length > 0 && (
          <PopularSection
            data={searchResults.map(convertMealData)}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
          />
        )}

        {/* Search Results - Suggested Section */}
        {searchResults.length > 0 && suggestedMeals.length > 0 && (
          <SuggestedSection
            data={suggestedMeals.map(convertMealData)}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
          />
        )}

        {/* Default Popular Section - Only show when no search results */}
        {searchResults.length === 0 && !isLoading && (
          <PopularSection
            data={popularMeals.map(convertMealData)}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
          />
        )}

        {/* Default Suggested Section - Only show when no search results */}
        {searchResults.length === 0 && !isLoading && (
          <SuggestedSection
            data={defaultSuggestedMeals.map(convertMealData)}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
          />
        )}
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
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
});

export default SearchScreen;