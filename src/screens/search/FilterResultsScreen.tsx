import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MealData } from '../../services/searchAPI';
import { filterAPI } from '../../services/filterAPI';
import { useFavorites } from '../../hooks/useFavorites';
import MealCardHorizontal from '../../components/MealCardHorizontal';

interface AppliedFilters {
  nutritionGoal: boolean;
  mealType: string[];
  ingredients: string[];
  cookingTime: string[];
}

interface FilterResultsScreenProps {
  route: {
    params: {
      appliedFilters: AppliedFilters;
    };
  };
}

type RootStackParamList = {
  MealDetail: { mealId: number };
  Search: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FilterResultsScreen: React.FC<FilterResultsScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { appliedFilters } = route.params;
  
  const [searchResults, setSearchResults] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resultCount, setResultCount] = useState(0);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    loadFilterResults();
  }, []);

  const loadFilterResults = async () => {
    try {
      setIsLoading(true);
      
      console.log('🔍 Debug - Applied filters:', appliedFilters);
      
      if (appliedFilters.nutritionGoal) {
        console.log('🔍 Debug - Using personal nutrition search');
        await handleSearchWithPersonalNutrition();
      } else {
        console.log('🔍 Debug - Using general filter search');
        await handleSearchWithFilters();
      }
    } catch (error) {
      console.error('Error loading filter results:', error);
      Alert.alert('Lỗi', 'Không thể tải kết quả bộ lọc');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchWithFilters = async () => {
    try {
      // Use new filter API
      const filterRequest = {
        dietType: null,
        maxCookingTime: appliedFilters.cookingTime.includes('≤ 15 phút') ? 15 :
                       appliedFilters.cookingTime.includes('≤ 30 phút') ? 30 :
                       appliedFilters.cookingTime.includes('≤ 60 phút') ? 60 : null,
        ingredients: appliedFilters.ingredients.length > 0 ? appliedFilters.ingredients : null,
        mealTypes: appliedFilters.mealType.length > 0 ? appliedFilters.mealType : null,
        page: 0,
        pageSize: 50 // Show more results in dedicated screen
      };

      console.log('🔍 Debug - Filter request:', filterRequest);
      const response = await filterAPI.searchWithFilters(filterRequest);
      console.log('🔍 Debug - Filter response:', response);
      
      if (response.success && response.data) {
        const searchData = Array.isArray(response.data) ? response.data as unknown as MealData[] : [];
        setSearchResults(searchData);
        setResultCount(searchData.length);
      } else {
        setSearchResults([]);
        setResultCount(0);
      }
    } catch (error) {
      console.error('Error searching with filters:', error);
      setSearchResults([]);
      setResultCount(0);
    }
  };

  const handleSearchWithPersonalNutrition = async () => {
    try {
      // Get user's nutrition profile first
      const { userProfileAPI } = await import('../../services/userProfileAPI');
      const nutritionResponse = await userProfileAPI.getNutritionStats();
      
      if (!nutritionResponse.success) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin dinh dưỡng cá nhân. Vui lòng kiểm tra lại profile của bạn.');
        return;
      }

      // Prepare filters for personal nutrition search
      const personalFilters = {
        dietType: null,
        maxCookingTime: appliedFilters.cookingTime.includes('≤ 15 phút') ? 15 :
                       appliedFilters.cookingTime.includes('≤ 30 phút') ? 30 :
                       appliedFilters.cookingTime.includes('≤ 60 phút') ? 60 : null,
        ingredients: appliedFilters.ingredients,
        mealTypes: appliedFilters.mealType
      };

      const response = await filterAPI.searchWithPersonalNutrition(personalFilters);
      
      if (response.success && response.data) {
        const searchData = Array.isArray(response.data) ? response.data as unknown as MealData[] : [];
        setSearchResults(searchData);
        setResultCount(searchData.length);
      } else {
        setSearchResults([]);
        setResultCount(0);
      }
    } catch (error) {
      console.error('Error searching with personal nutrition:', error);
      setSearchResults([]);
      setResultCount(0);
    }
  };

  const handleMealPress = (meal: MealData) => {
    navigation.navigate('MealDetail', { mealId: meal.mealid });
  };

  const handleFavoritePress = (mealId: number) => {
    toggleFavorite(mealId);
  };

  const convertMealData = (meal: MealData, index?: number) => {
    return {
      id: meal.mealid ? meal.mealid.toString() : `temp-${index || Math.random()}`,
      title: meal.name || 'Unknown Meal',
      calories: meal.calories ? `${meal.calories} kcal` : '0 kcal',
      time: meal.cookingtime ? `${meal.cookingtime} phút` : '15 phút',
      image: { uri: meal.imageUrl || 'https://via.placeholder.com/150' },
      tag: convertCategoryToVietnamese(meal.categoryName || 'Món ăn'),
      isLocked: meal.isPremium || false,
      isFavorite: meal.mealid ? isFavorite(meal.mealid) : false,
      description: meal.description || '',
      price: meal.price || 0,
      dietType: meal.diettype || '',
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      instructions: meal.instructions || [],
    };
  };

  const convertCategoryToVietnamese = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Breakfast': 'Bữa sáng',
      'Lunch': 'Bữa trưa',
      'Dinner': 'Bữa tối',
      'Snack': 'Đồ ăn vặt',
      'Dessert': 'Tráng miệng',
    };
    return categoryMap[category] || category;
  };

  const getFilterSummary = () => {
    const filters = [];
    if (appliedFilters.mealType.length > 0) {
      filters.push(`Bữa ăn: ${appliedFilters.mealType.join(', ')}`);
    }
    if (appliedFilters.ingredients.length > 0) {
      filters.push(`Nguyên liệu: ${appliedFilters.ingredients.join(', ')}`);
    }
    if (appliedFilters.cookingTime.length > 0) {
      filters.push(`Thời gian: ${appliedFilters.cookingTime.join(', ')}`);
    }
    if (appliedFilters.nutritionGoal) {
      filters.push('Dinh dưỡng cá nhân');
    }
    return filters.join(' • ');
  };

  const renderMealItem = ({ item, index }: { item: MealData; index: number }) => {
    const convertedMeal = convertMealData(item, index);
    
    return (
      <View style={styles.mealItem}>
        <MealCardHorizontal
          id={convertedMeal.id}
          title={convertedMeal.title}
          calories={convertedMeal.calories}
          time={convertedMeal.time}
          image={convertedMeal.image}
          tag={convertedMeal.tag}
          isLocked={convertedMeal.isLocked}
          isFavorite={convertedMeal.isFavorite}
          onPress={() => handleMealPress(item)}
          onFavoritePress={() => handleFavoritePress(item.mealid)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textStrong} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả bộ lọc</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Summary */}
      <View style={styles.filterSummary}>
        <Text style={styles.filterSummaryTitle}>Bộ lọc đã áp dụng:</Text>
        <Text style={styles.filterSummaryText}>{getFilterSummary()}</Text>
      </View>

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={styles.resultsCountText}>
          Tìm thấy {resultCount} món ăn phù hợp
        </Text>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      )}

      {/* Results */}
      {!isLoading && (
        <ScrollView style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <View style={styles.mealsList}>
              {searchResults.map((meal, index) => (
                <View key={meal.mealid || `temp-${index}`}>
                  {renderMealItem({ item: meal, index })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
              <Text style={styles.emptyStateTitle}>Không tìm thấy món ăn</Text>
              <Text style={styles.emptyStateText}>
                Không có món ăn nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc.
              </Text>
              <TouchableOpacity 
                style={styles.adjustFilterButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.adjustFilterButtonText}>Điều chỉnh bộ lọc</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textStrong,
  },
  placeholder: {
    width: 40,
  },
  filterSummary: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textStrong,
    marginBottom: SPACING.xs,
  },
  filterSummaryText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  resultsCount: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary + '10',
  },
  resultsCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  resultsContainer: {
    flex: 1,
  },
  mealsList: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  mealItem: {
    marginBottom: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textStrong,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  adjustFilterButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
  },
  adjustFilterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterResultsScreen;
