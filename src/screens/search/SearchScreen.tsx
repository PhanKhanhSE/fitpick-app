import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { COLORS, SPACING, RADII } from "../../utils/theme";
import SearchBarNew from "../../components/SearchBarNew";
import {
  PopularSection,
  SuggestedSection,
  SearchHistory,
  FilterModal,
} from "../../components/search";
import SearchResultsGrid from "../../components/search/SearchResultsGrid";
import PremiumModal from "../../components/home/PremiumModal";
import { searchAPI, SearchFilters, MealData } from "../../services/searchAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertCategoryToVietnamese } from "../../utils/categoryMapping";
import { useFavorites } from "../../hooks/useFavorites";
import { useUser } from "../../hooks/useUser";
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
  const { userInfo } = useUser();
  
  // Simple check for Pro user from userInfo
  const isPro = userInfo?.accountType === 'PRO';
  
  const [searchText, setSearchText] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Favorites hook
  const { favorites, toggleFavorite, isFavorite, loadFavorites } = useFavorites();

  // Search states
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // UI meal data format (different from API MealData format)
  interface UIMealData {
    id: string;
    title: string;
    calories: string;
    time: string;
    image: { uri: string };
    tag: string;
    isLocked?: boolean;
    isFavorite?: boolean;
    description?: string;
    price?: number;
    dietType?: string;
    protein?: number;
    carbs?: number;
    fat?: number;
    instructions?: any[];
  }

  const [searchResults, setSearchResults] = useState<UIMealData[]>([]);
  const [popularMeals, setPopularMeals] = useState<UIMealData[]>([]);
  const [defaultPopularMeals, setDefaultPopularMeals] = useState<UIMealData[]>(
    []
  );
  const [suggestedMeals, setSuggestedMeals] = useState<UIMealData[]>([]);
  const [defaultSuggestedMeals, setDefaultSuggestedMeals] = useState<
    UIMealData[]
  >([]);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    nutritionGoal: false,
    mealType: [],
    ingredients: [],
    cookingTime: [],
  });

  // Debounce timer ref for auto-search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to store default suggested meals to avoid closure issues
  const defaultSuggestedMealsRef = useRef<UIMealData[]>([]);

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
  }, []); // Remove isPro from dependencies to avoid render errors

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Reload favorites when screen comes into focus (to sync with changes from other screens)
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

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

      // Load popular meals using the correct API - load more but display only 6 initially
      try {
        const popularResponse = await searchAPI.getPopularMeals(20);

        // Handle different response structures
        let dataArray: any[] = [];
        
        if (Array.isArray(popularResponse)) {
          // Response is directly an array
          dataArray = popularResponse;
        } else if (popularResponse && popularResponse.data) {
          // Response has data property
          dataArray = Array.isArray(popularResponse.data) ? popularResponse.data : [];
        } else if (popularResponse && popularResponse.success && popularResponse.data) {
          // Response has success and data
          dataArray = Array.isArray(popularResponse.data) ? popularResponse.data : [];
        }
        
        if (dataArray.length > 0) {
          const popularData = dataArray.map(
            (meal: any, index: number) => convertMealData(meal, index)
          );
          setPopularMeals(popularData);
          setDefaultPopularMeals(popularData);
        }
      } catch (popularError: any) {
        console.error('❌ Error loading popular meals:', popularError);
        console.error('❌ Error details:', popularError.response?.data || popularError.message);
        // Continue to load suggested meals even if popular fails
      }

      // Load suggested meals using the correct API - load more (50) but display only 6 initially
      try {
        const suggestedResponse = await searchAPI.getSuggestedMeals(50);

        if (suggestedResponse && (suggestedResponse.success || suggestedResponse.data)) {
          const responseData = suggestedResponse.data || suggestedResponse;
          const dataArray = Array.isArray(responseData) ? responseData : [];
          
          if (dataArray.length > 0) {
            const suggestedData = dataArray.map(
              (meal: MealData, index: number) => convertMealData(meal, index)
            );
            setSuggestedMeals(suggestedData);
            setDefaultSuggestedMeals(suggestedData);
            defaultSuggestedMealsRef.current = suggestedData; // Update ref
          }
        }
      } catch (suggestedError: any) {
        console.error('❌ Error loading suggested meals:', suggestedError);
        // Continue even if suggested fails
      }
    } catch (error: any) {
      console.error('❌ Error in loadInitialData:', error);
      Alert.alert("Lỗi", `Không thể tải dữ liệu: ${error.message || 'Vui lòng thử lại.'}`);
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
  const saveSearchHistory = useCallback(async (history: string[]) => {
    try {
      await AsyncStorage.setItem("searchHistory", JSON.stringify(history));
    } catch (error) {
      // Error saving search history
    }
  }, []);

  // Convert backend meal data to frontend format
  const convertMealData = useCallback((meal: any, index: number) => {
    // Handle different response structures
    const mealId = meal.mealid || meal.id || meal.Mealid;
    const mealName = meal.name || meal.Name || meal.title || "Unknown Meal";
    const mealCalories = meal.calories || meal.Calories || 0;
    const cookingTime = meal.cookingTime || meal.cookingtime || meal.Cookingtime || 15;
    const imageUrl = meal.imageUrl || meal.image_url || meal.ImageUrl;
    const categoryName = meal.categoryName || meal.category_name || meal.CategoryName;
    const isPremium = meal.isPremium || meal.is_premium || meal.IsPremium || false;
    const description = meal.description || meal.Description || "";
    const price = meal.price || meal.Price || 0;
    const dietType = meal.diettype || meal.diet_type || meal.Diettype || "";
    const protein = meal.protein || meal.Protein || 0;
    const carbs = meal.carbs || meal.Carbs || 0;
    const fat = meal.fat || meal.Fat || 0;
    const instructions = meal.instructions || meal.Instructions || [];

    // Create unique ID by combining mealid and index to avoid duplicates
    const uniqueId = mealId
      ? `${mealId}-${index}`
      : `temp-${index}-${Date.now()}`;

    return {
      id: uniqueId,
      title: mealName,
      calories: mealCalories ? `${mealCalories} kcal` : "0 kcal",
      time: cookingTime ? `${cookingTime} phút` : "15 phút",
      image: { uri: imageUrl || "https://via.placeholder.com/150" },
      tag: convertCategoryToVietnamese(categoryName || "Món ăn"),
      // Premium/Pro users can view all meals, only Free users are restricted
      isLocked: isPremium && !isPro,
      isFavorite: mealId ? isFavorite(mealId) : false,
      description: description,
      price: price,
      dietType: dietType,
      protein: protein,
      carbs: carbs,
      fat: fat,
      instructions: instructions,
    };
  }, [isFavorite, isPro]);

  // Handle search with text
  const handleSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setIsSearchActive(true);

      // Search for meals by name
      const searchResponse = await searchAPI.searchMeals({
        name: text.trim(),
      });

      // Check if search was successful
      if (!searchResponse.success) {
        // Search failed, show error message if not network error
        const isNetworkError = searchResponse.message?.includes('Network') || 
                              searchResponse.message?.includes('network');
        if (!isNetworkError) {
          Alert.alert('Lỗi', searchResponse.message || 'Không thể tìm kiếm món ăn');
        }
        setSearchResults([]);
        setSuggestedMeals([]);
        return;
      }

      // Handle different response structures
      let searchData: MealData[] = [];
      if (Array.isArray(searchResponse)) {
        // Response is directly an array
        searchData = searchResponse;
      } else if (searchResponse && searchResponse.data) {
        // Response has data property
        searchData = Array.isArray(searchResponse.data) ? searchResponse.data : [];
      } else if (searchResponse && searchResponse.success && searchResponse.data) {
        // Response has success and data
        searchData = Array.isArray(searchResponse.data) ? searchResponse.data : [];
      }

      if (searchData.length > 0) {

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

        // Set search results (converted UI shape)
        setSearchResults(convertedData);
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
    } catch (error: any) {
      console.error('❌ Search error:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      
      // Check if it's a network error
      const isNetworkError = error.message?.includes('Network Error') || 
                             error.message?.includes('network') ||
                             error.code === 'NETWORK_ERROR' ||
                             !error.response;
      
      if (isNetworkError) {
        // Don't show alert for network errors, just log and clear results
        console.error('Network error during search');
        setSearchResults([]);
        setSuggestedMeals([]);
      } else {
        // Show alert for other errors
        Alert.alert("Lỗi", `Không thể tìm kiếm: ${error.response?.data?.message || error.message || 'Vui lòng thử lại.'}`);
        setSearchResults([]);
        setSuggestedMeals([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isFavorite, convertMealData, searchHistory, saveSearchHistory]);

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
        // Convert MealData[] to UIMealData[] format
        const convertedData = searchData.map(
          (meal: MealData, index: number) => convertMealData(meal, index)
        );
        setSearchResults(convertedData);

        // Show success message
        Alert.alert(
          "Thành công",
          `Đã tìm thấy ${convertedData.length} món ăn phù hợp với bộ lọc của bạn!`,
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
        // Convert MealData[] to UIMealData[] format
        const convertedData = searchData.map(
          (meal: MealData, index: number) => convertMealData(meal, index)
        );
        setSearchResults(convertedData);

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

  const handleFilterPress = useCallback(() => {
    setShowFilterModal(true);
  }, []);

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

  const handleSearchFocus = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Auto reset when search text is empty
    if (text.trim() === "") {
      setSearchResults([]);
      // Use functional update with ref to avoid depending on defaultSuggestedMeals
      setSuggestedMeals(() => {
        // Restore from ref which always has the latest value
        return defaultSuggestedMealsRef.current.length > 0 
          ? [...defaultSuggestedMealsRef.current] 
          : [];
      });
      setIsSearchActive(false);
      return;
    }

    // Set search active when user starts typing
    setIsSearchActive(true);

    // Auto-search with debounce (500ms delay)
    searchTimeoutRef.current = setTimeout(() => {
      if (text.trim().length >= 2) {
        // Only search if text is at least 2 characters
        handleSearch(text.trim()).catch((err) => {
          console.error('❌ Auto-search error:', err);
        });
      }
    }, 500);
  }, [handleSearch]); // Remove defaultSuggestedMeals from dependencies

  const handleSearchCancel = useCallback(() => {
    setIsSearchActive(false);
    setSearchText("");
    setSearchResults([]);
    // Use ref to avoid depending on defaultSuggestedMeals
    setSuggestedMeals(() => [...defaultSuggestedMealsRef.current]); // Restore default suggested meals
  }, []); // No dependencies needed since we use ref

  const handleSearchHistoryPress = useCallback((text: string) => {
    handleSearchTextChange(text);
    handleSearch(text);
  }, [handleSearchTextChange, handleSearch]);

  const handleSearchSubmit = useCallback(() => {
    // Clear any pending auto-search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (searchText.trim()) {
      handleSearch(searchText.trim()).catch((err) => {
        console.error('❌ Submit search error:', err);
      });
    }
  }, [searchText, handleSearch]);

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

  // Refresh suggested meals only (pull to refresh)
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Only refresh suggested meals to get new recommendations
      const suggestedResponse = await searchAPI.getSuggestedMeals(50);

      if (suggestedResponse && (suggestedResponse.success || suggestedResponse.data)) {
        const responseData = suggestedResponse.data || suggestedResponse;
        const dataArray = Array.isArray(responseData) ? responseData : [];
        
        if (dataArray.length > 0) {
          const suggestedData = dataArray.map(
            (meal: MealData, index: number) => convertMealData(meal, index)
          );
          setSuggestedMeals(suggestedData);
          setDefaultSuggestedMeals(suggestedData);
          defaultSuggestedMealsRef.current = suggestedData; // Update ref
        }
      }
    } catch (error: any) {
      console.error('❌ Error refreshing suggested meals:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Search Bar */}
      <View style={styles.stickyHeader}>
        <SearchBarNew
          value={searchText}
          onChangeText={handleSearchTextChange}
          placeholder="Tìm kiếm món ăn..."
          onFilterPress={handleFilterPress}
          onFocus={handleSearchFocus}
          onSubmitEditing={handleSearchSubmit}
          onClear={() => {
            setSearchText("");
            setSearchResults([]);
            setIsSearchActive(false);
          }}
          showCancel={true}
          onCancel={() => {
            setSearchText("");
            setSearchResults([]);
            setIsSearchActive(false);
          }}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 85 }, // 85 là chiều cao bottom tab
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        {/* Search Results - Grid 2 columns - Only show when actively searching */}
        {isSearchActive && searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsTitle}>
              Tìm thấy {searchResults.length} món ăn
            </Text>
            <SearchResultsGrid
              data={searchResults as any}
              favorites={favorites}
              onMealPress={handleMealPress}
              onFavoritePress={handleFavoritePress}
              isFavorite={isFavorite}
            />
          </View>
        )}

        {/* No search results message - Only when actively searching */}
        {isSearchActive && searchResults.length === 0 && !isLoading && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Không tìm thấy món ăn nào phù hợp với "{searchText}"
            </Text>
          </View>
        )}

        {/* Default Popular Section - only when not searching */}
        {!isSearchActive && !isLoading && popularMeals.length > 0 && (
          <PopularSection
            data={popularMeals as any}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
            isFavorite={isFavorite}
            initialLimit={6}
            onViewMore={() => {
              // Simply show all loaded meals - no need to reload
              // The component will handle showing all meals internally
            }}
          />
        )}

        {/* Default Suggested Section - only when not searching */}
        {!isSearchActive && !isLoading && defaultSuggestedMeals.length > 0 && (
          <SuggestedSection
            data={defaultSuggestedMeals as any}
            favorites={favorites}
            onMealPress={handleMealPress}
            onFavoritePress={handleFavoritePress}
            isFavorite={isFavorite}
            initialLimit={6}
            onViewMore={() => {
              // Simply show all loaded meals - no need to reload
              // The component will handle showing all meals internally
            }}
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
      {!isPro && (
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
  noResultsContainer: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.textDim,
    textAlign: "center",
  },
  searchResultsContainer: {
    paddingVertical: SPACING.md,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
});

export default SearchScreen;
