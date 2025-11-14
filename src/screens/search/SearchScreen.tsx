import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { COLORS, SPACING, RADII } from "../../utils/theme";
import SearchBar from "../../components/SearchBar";
import {
  PopularSection,
  SuggestedSection,
  SearchHistory,
  FilterModal,
} from "../../components/search";
import PremiumModal from "../../components/home/PremiumModal";
import { searchAPI, SearchFilters, MealData } from "../../services/searchAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertCategoryToVietnamese } from "../../utils/categoryMapping";
import { useFavorites } from "../../hooks/useFavorites";
import { useProUser } from "../../hooks/useProUser";
import { filterAPI } from "../../services/filterAPI";
import { userProfileAPI } from "../../services/userProfileAPI";
import { checkAuthStatus } from "../../services/api";
import { paymentsAPI } from "../../services/paymentAPI";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AppliedFilters {
  nutritionGoal: boolean;
  mealType: string[];
  ingredients: string[];
  cookingTime: string[];
}

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { isProUser } = useProUser();
  
  // Get Pro status as a value for dependencies
  const isPro = isProUser();
  
  const [searchText, setSearchText] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Favorites hook
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Search states
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<MealData[]>([]);
  const [popularMeals, setPopularMeals] = useState<MealData[]>([]);
  const [defaultPopularMeals, setDefaultPopularMeals] = useState<MealData[]>(
    []
  );
  const [suggestedMeals, setSuggestedMeals] = useState<MealData[]>([]);
  const [defaultSuggestedMeals, setDefaultSuggestedMeals] = useState<
    MealData[]
  >([]);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    nutritionGoal: false,
    mealType: [],
    ingredients: [],
    cookingTime: [],
  });

  // Load initial data and search history
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();

      if (!authStatus.isAuthenticated) {
        // User not authenticated, some features may not work
      }
    };

    checkAuth();
    loadInitialData();
    loadSearchHistory();
  }, [isPro]); // Use isPro value instead of function call

  // Get filter parameters for API calls
  const getFilterParams = () => {
    const params: any = {};

    if (appliedFilters.mealType.length > 0) {
      params.mealTypes = appliedFilters.mealType;
    }

    if (appliedFilters.ingredients.length > 0) {
      params.ingredients = appliedFilters.ingredients;
    }

    if (appliedFilters.cookingTime.length > 0) {
      // Convert cooking time strings to numbers
      const maxTime = Math.max(
        ...appliedFilters.cookingTime.map((time) => {
          const match = time.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
      );
      params.maxCookingTime = maxTime;
    }

    return params;
  };

  // Load initial data (popular and suggested meals)
  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load popular meals with current filters
      const popularResponse = await searchAPI.searchMeals({
        page: 1,
        limit: 10,
        ...getFilterParams(),
      });

      if (popularResponse.success) {
        const popularData = popularResponse.data.map(
          (meal: MealData, index: number) => convertMealData(meal, index)
        );
        setPopularMeals(popularData);
        setDefaultPopularMeals(popularData);
      }

      // Load suggested meals with current filters
      const suggestedResponse = await searchAPI.searchMeals({
        page: 1,
        limit: 10,
        ...getFilterParams(),
      });

      if (suggestedResponse.success) {
        const suggestedData = suggestedResponse.data.map(
          (meal: MealData, index: number) => convertMealData(meal, index)
        );
        setSuggestedMeals(suggestedData);
        setDefaultSuggestedMeals(suggestedData);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load search history from AsyncStorage
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("searchHistory");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      // Error loading search history
    }
  };

  // Save search history to AsyncStorage
  const saveSearchHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem("searchHistory", JSON.stringify(history));
    } catch (error) {
      // Error saving search history
    }
  };

  // Convert backend meal data to frontend format
  const convertMealData = (meal: MealData, index: number) => {
    // Create unique ID by combining mealid and index to avoid duplicates
    const uniqueId = meal.mealid
      ? `${meal.mealid}-${index}`
      : `temp-${index}-${Date.now()}`;

    return {
      id: uniqueId,
      title: meal.name || "Unknown Meal",
      calories: meal.calories ? `${meal.calories} kcal` : "0 kcal",
      time: meal.cookingtime ? `${meal.cookingtime} phút` : "15 phút",
      image: { uri: meal.imageUrl || "https://via.placeholder.com/150" },
      tag: convertCategoryToVietnamese(meal.categoryName || "Món ăn"),
      // Premium/Pro users can view all meals, only Free users are restricted
      isLocked: (meal.isPremium || false) && !isPro,
      isFavorite: meal.mealid ? isFavorite(meal.mealid) : false,
      description: meal.description || "",
      price: meal.price || 0,
      dietType: meal.diettype || "",
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      instructions: meal.instructions || [],
    };
  };

  // Handle search with text
  const handleSearch = async (text: string) => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);

      // Search for meals by name
      const searchResponse = await searchAPI.searchMeals({
        name: text.trim(),
      });

      if (searchResponse.success && searchResponse.data) {
        const searchData = Array.isArray(searchResponse.data)
          ? searchResponse.data
          : [];

        // Filter and sort results for more accurate matches
        const searchTerm = text.trim().toLowerCase();

        const filteredAndSortedData = (searchData as MealData[])
          .map((meal: MealData) => {
            const mealName = meal.name?.toLowerCase() || "";
            let score = 0;

            // Exact match gets highest priority (score: 100)
            if (mealName === searchTerm) {
              score = 100;
            }
            // Starts with search term (score: 80)
            else if (mealName.startsWith(searchTerm)) {
              score = 80;
            }
            // Contains search term as whole word (score: 60)
            else if (mealName.includes(searchTerm)) {
              score = 60;
            }
            // Contains all search words (score: 40)
            else {
              const words = mealName.split(/\s+/);
              const searchWords = searchTerm.split(/\s+/);
              const allWordsFound = searchWords.every((searchWord) =>
                words.some((mealWord) => mealWord.includes(searchWord))
              );
              if (allWordsFound) {
                score = 40;
              }
            }

            return { meal, score };
          })
          .filter((item: { meal: MealData; score: number }) => item.score >= 40) // Only include meals with good relevance (score >= 40)
          .sort(
            (
              a: { meal: MealData; score: number },
              b: { meal: MealData; score: number }
            ) => b.score - a.score
          ) // Sort by score descending
          .slice(0, 20) // Limit to top 20 results
          .map((item: { meal: MealData; score: number }) => item.meal); // Extract just the meal objects

        // Convert to display format
        const convertedData = filteredAndSortedData.map(
          (meal: MealData, index: number) => convertMealData(meal, index)
        );

        // Set search results (converted UI shape) — cast to MealData[] to satisfy existing state typing
        setSearchResults(convertedData as unknown as MealData[]);
        setSuggestedMeals([]); // Clear suggested meals when searching
      } else {
        setSearchResults([]);
        setSuggestedMeals([]);
      }

      // Add to search history
      if (!searchHistory.includes(text.trim())) {
        const newHistory = [text.trim(), ...searchHistory.slice(0, 9)]; // Keep max 10 items
        setSearchHistory(newHistory);
        await saveSearchHistory(newHistory);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tìm kiếm. Vui lòng thử lại.");
      setSearchResults([]);
      setSuggestedMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with filters
  const handleSearchWithFilters = async () => {
    try {
      // Use new filter API
      const filterRequest = {
        dietType: null,
        maxCookingTime: appliedFilters.cookingTime.includes("≤ 15 phút")
          ? 15
          : appliedFilters.cookingTime.includes("≤ 30 phút")
          ? 30
          : appliedFilters.cookingTime.includes("≤ 60 phút")
          ? 60
          : null,
        ingredients:
          appliedFilters.ingredients.length > 0
            ? appliedFilters.ingredients
            : null,
        mealTypes:
          appliedFilters.mealType.length > 0 ? appliedFilters.mealType : null,
        page: 0,
        pageSize: 20,
      };

      const response = await filterAPI.searchWithFilters(filterRequest);

      if (response.success && response.data) {
        const searchData = Array.isArray(response.data)
          ? (response.data as unknown as MealData[])
          : [];
        setSearchResults(searchData);

        // Show success message
        Alert.alert(
          "Thành công",
          `Đã tìm thấy ${searchData.length} món ăn phù hợp với bộ lọc của bạn!`,
          [{ text: "OK" }]
        );
      } else {
        setSearchResults([]);
        Alert.alert(
          "Thông báo",
          "Không tìm thấy món ăn phù hợp với bộ lọc của bạn."
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể áp dụng bộ lọc. Vui lòng thử lại.");
      setSearchResults([]);
    }
  };

  // Handle search with personal nutrition
  const handleSearchWithPersonalNutrition = async () => {
    try {
      // Get user's nutrition profile first
      const nutritionResponse = await userProfileAPI.getNutritionStats();

      if (!nutritionResponse.success) {
        Alert.alert(
          "Lỗi",
          "Không thể lấy thông tin dinh dưỡng cá nhân. Vui lòng kiểm tra lại profile của bạn."
        );
        return;
      }

      // Prepare filters for personal nutrition search
      const personalFilters = {
        dietType: null,
        maxCookingTime: appliedFilters.cookingTime.includes("≤ 15 phút")
          ? 15
          : appliedFilters.cookingTime.includes("≤ 30 phút")
          ? 30
          : appliedFilters.cookingTime.includes("≤ 60 phút")
          ? 60
          : null,
        ingredients: appliedFilters.ingredients,
        mealTypes: appliedFilters.mealType,
      };

      const response = await filterAPI.searchWithPersonalNutrition(
        personalFilters
      );

      if (response.success && response.data) {
        const searchData = Array.isArray(response.data)
          ? (response.data as unknown as MealData[])
          : [];
        setSearchResults(searchData);

        // Show success message
        Alert.alert(
          "Thành công",
          "Đã tìm kiếm món ăn phù hợp với mục tiêu dinh dưỡng cá nhân của bạn!",
          [{ text: "OK" }]
        );
      } else {
        setSearchResults([]);
        Alert.alert(
          "Thông báo",
          "Không tìm thấy món ăn phù hợp với dinh dưỡng cá nhân của bạn."
        );
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể tìm kiếm với dinh dưỡng cá nhân. Vui lòng thử lại."
      );
      setSearchResults([]);
    }
  };

  const handleFavoritePress = async (id: string) => {
    const mealId = parseInt(id);
    if (!isNaN(mealId)) {
      const success = await toggleFavorite(mealId);
      if (!success) {
        Alert.alert(
          "Lỗi",
          "Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại."
        );
      }
    }
  };

  const handleMealPress = (meal: any) => {
    // Premium/Pro users can view all meals, only Free users are restricted
    if (meal.isLocked && !isPro) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate("MealDetail", { meal });
    }
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
  };

  const handleUpgrade = async () => {
    try {
      setShowPremiumModal(false);
      const res = await paymentsAPI.createPayment({
        plan: "PRO",
        amount: 29000,
        returnUrl: "fitpick://payments/callback",
      });
      const url =
        res?.data?.checkoutUrl ||
        res?.data?.paymentUrl ||
        res?.data?.url ||
        res?.checkoutUrl ||
        res?.paymentUrl ||
        res?.url;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không nhận được link thanh toán.");
      }
    } catch (e: any) {
      Alert.alert("Lỗi", "Không thể khởi tạo thanh toán.");
    }
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);

    // Auto reset when search text is empty
    if (text.trim() === "") {
      setSearchResults([]);
      setSuggestedMeals(defaultSuggestedMeals); // Restore default suggested meals
      setIsSearchActive(false);
    }
  };

  const handleSearchCancel = () => {
    setIsSearchActive(false);
    setSearchText("");
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

  const handleApplyFilters = async () => {
    setShowFilterModal(false);

    // Navigate to FilterResultsScreen
    navigation.navigate("FilterResults", { appliedFilters });
  };

  const handleClearFilters = () => {
    setAppliedFilters({
      nutritionGoal: false,
      mealType: [],
      ingredients: [],
      cookingTime: [],
    });
  };

  const removeHistoryItem = async (index: number) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
    await saveSearchHistory(newHistory);
  };

  const toggleMealType = (type: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      mealType: prev.mealType.includes(type)
        ? prev.mealType.filter((t) => t !== type)
        : [...prev.mealType, type],
    }));
  };

  const toggleIngredient = (ingredient: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredient)
        ? prev.ingredients.filter((i) => i !== ingredient)
        : [...prev.ingredients, ingredient],
    }));
  };

  const toggleCookingTime = (time: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      cookingTime: prev.cookingTime.includes(time)
        ? prev.cookingTime.filter((t) => t !== time)
        : [...prev.cookingTime, time],
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
          { paddingBottom: insets.bottom + 85 }, // 85 là chiều cao bottom tab
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
            data={searchResults as any}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
            isFavorite={isFavorite}
          />
        )}

        {/* Search Results - Suggested Section (only during active search when no direct name results) */}
        {isSearchActive &&
          searchResults.length === 0 &&
          suggestedMeals.length > 0 && (
            <SuggestedSection
              data={suggestedMeals as any}
              favorites={favorites}
              onMealPress={handleMealPress}
              onFavoritePress={handleFavoritePress}
              isFavorite={isFavorite}
            />
          )}

        {/* Default Popular Section - only when not searching */}
        {!isSearchActive && !isLoading && (
          <PopularSection
            data={popularMeals as any}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
            isFavorite={isFavorite}
          />
        )}

        {/* Default Suggested Section - only when not searching */}
        {!isSearchActive && !isLoading && (
          <SuggestedSection
            data={defaultSuggestedMeals as any}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
            isFavorite={isFavorite}
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
        toggleCookingTime={toggleCookingTime}
        setAppliedFilters={setAppliedFilters}
      />

      {/* Premium Modal - Chỉ hiển thị cho tài khoản Free */}
      {!isProUser() && (
        <PremiumModal
          visible={showPremiumModal}
          onClose={handleClosePremiumModal}
          onUpgrade={handleUpgrade}
        />
      )}
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
    borderBottomColor: "#E5E5E5",
    elevation: 2,
    shadowColor: "#000",
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
});

export default SearchScreen;
