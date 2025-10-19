import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { favoritesAPI, FavoriteMealWithDetails } from '../../services/favoritesAPI';
import { convertCategoryToVietnamese } from '../../utils/categoryMapping';
import { useFavorites } from '../../hooks/useFavorites';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
import {
  FavoriteCard,
  FavoriteActionModal,
  FavoriteBottomBar,
  MealPlannerModal,
  FoodItem,
} from "../../components/fav";

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  
  // Use favorites hook for global state management
  const { removeFavorite, removeMultipleFavorites } = useFavorites();
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [actionItem, setActionItem] = useState<FoodItem | null>(null);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  
  // State for API data
  const [favoriteItems, setFavoriteItems] = useState<FoodItem[]>([]);
  const [favoriteDetails, setFavoriteDetails] = useState<FavoriteMealWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load favorites from API
  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await favoritesAPI.getFavoritesWithDetails();
      
      if (response.success && response.data) {
        // Store detailed data
        setFavoriteDetails(response.data);
        
        // Convert API data to FoodItem format with full details
        const convertedItems: FoodItem[] = response.data.map((fav: FavoriteMealWithDetails) => ({
          id: fav.mealId.toString(),
          name: fav.name,
          calories: fav.calories || 0,
          weight: fav.cookingTime || 0, // Use cooking time as weight for display
          image: {
            uri: fav.imageUrl || 'https://via.placeholder.com/200x150',
          },
        }));
        setFavoriteItems(convertedItems);
      } else {
        // Fallback to empty array if no favorites
        setFavoriteItems([]);
        setFavoriteDetails([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách yêu thích. Vui lòng thử lại.');
      setFavoriteItems([]);
      setFavoriteDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh favorites
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  // Load favorites on component mount and when screen comes into focus
  useEffect(() => {
    loadFavorites();
  }, []);

  // Auto reload when screen comes into focus (when user returns from other screens)
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Convert FoodItem to meal format for MealDetailScreen
  const convertFoodItemToMeal = (item: FoodItem) => {
    // Find the original detailed data for this item
    const detailedData = favoriteDetails.find(fav => fav.mealId.toString() === item.id);
    
    return {
      id: item.id,
      title: item.name,
      calories: `${item.calories} kcal`,
      price: detailedData?.price ? `${detailedData.price} VND` : "0 VND",
      image: item.image,
      cookingTime: `${item.weight} phút`,
      ingredients: detailedData?.description ? [
        { name: "Mô tả", amount: detailedData.description },
      ] : [
        { name: "Thành phần chính", amount: `${item.weight}g` },
      ],
      instructions: [
        "Hướng dẫn sẽ được cập nhật sau.",
      ],
      // Add additional details if available
      carbs: detailedData?.carbs ? `${detailedData.carbs}g` : undefined,
      protein: detailedData?.protein ? `${detailedData.protein}g` : undefined,
      fat: detailedData?.fat ? `${detailedData.fat}g` : undefined,
      dietType: detailedData?.dietType,
      categoryName: detailedData?.categoryName,
    };
  };

  const handleNavigateToDetail = (item: FoodItem) => {
    const meal = convertFoodItemToMeal(item);
    navigation.navigate('MealDetail', { meal });
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleMealPlannerSave = (selectedDays: string[], mealType: string) => {
    // Xử lý lưu vào meal planner
    console.log("Saving to meal planner:", {
      selectedDays,
      mealType,
      item: actionItem,
    });
  };

  // Delete single item
  const handleDeleteSingle = async () => {
    if (actionItem) {
      try {
        const mealId = parseInt(actionItem.id);
        if (!isNaN(mealId)) {
          const success = await removeFavorite(mealId);
          if (success) {
            // Remove from local state
            setFavoriteItems(prev => prev.filter(item => item.id !== actionItem.id));
            setFavoriteDetails(prev => prev.filter(fav => fav.mealId !== mealId));
            setActionItem(null);
            setShowActionModal(false);
            Alert.alert('Thành công', 'Đã xóa món ăn khỏi danh sách yêu thích');
          } else {
            Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại.');
          }
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại.');
      }
    }
  };

  // Delete multiple items
  const handleDeleteMultiple = async () => {
    if (selectedItems.length === 0) return;

    try {
      // Convert selected item IDs to meal IDs
      const mealIds = selectedItems.map(id => parseInt(id)).filter(id => !isNaN(id));
      
      if (mealIds.length === 0) {
        Alert.alert('Lỗi', 'Không có món ăn hợp lệ để xóa');
        return;
      }

      const success = await removeMultipleFavorites(mealIds);
      
      if (success) {
        // Remove from local state
        setFavoriteItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setFavoriteDetails(prev => prev.filter(fav => !selectedItems.includes(fav.mealId.toString())));
        setSelectedItems([]);
        setMultiSelect(false);
        Alert.alert('Thành công', `Đã xóa ${mealIds.length} món ăn khỏi danh sách yêu thích`);
      } else {
        Alert.alert('Lỗi', 'Một số món ăn không thể xóa. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error removing multiple favorites:', error);
      Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại.');
    }
  };

  const renderFoodCard = ({ item }: { item: FoodItem }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <FavoriteCard
        item={item}
        multiSelect={multiSelect}
        isSelected={isSelected}
        onPress={() =>
          multiSelect
            ? toggleSelect(item.id)
            : handleNavigateToDetail(item)
        }
        onMorePress={() => setActionItem(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Yêu thích</Text>
      </View>

      {/* Grid danh sách với nút action */}
      <FlatList
        data={favoriteItems}
        renderItem={renderFoodCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 85 } // 85 là chiều cao bottom tab
        ]}
        columnWrapperStyle={styles.row}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>Chưa có món yêu thích</Text>
              <Text style={styles.emptySubtitle}>
                Hãy thêm những món ăn bạn yêu thích vào danh sách này
              </Text>
            </View>
          )
        }
        ListHeaderComponent={
          !isLoading && favoriteItems.length > 0 ? (
            <TouchableOpacity onPress={() => setMultiSelect(!multiSelect)}>
              <Text style={styles.actionText}>
                {multiSelect ? "Bỏ chọn tất cả" : "Chọn nhiều món"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Components */}
      <FavoriteBottomBar
        visible={multiSelect}
        selectedCount={selectedItems.length}
        onAddToProductList={() => console.log("Add to product list")}
        onDelete={handleDeleteMultiple}
      />

      <FavoriteActionModal
        visible={!!actionItem}
        item={actionItem}
        onClose={() => setActionItem(null)}
        onAddToMealPlan={() => {
          setActionItem(null);
          setShowMealPlanner(true);
        }}
        onAddToProductList={() => {
          console.log("Add to product list");
          setActionItem(null);
        }}
        onDelete={handleDeleteSingle}
      />

      <MealPlannerModal
        visible={showMealPlanner}
        item={actionItem}
        onClose={() => setShowMealPlanner(false)}
        onSave={handleMealPlannerSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: "right",
    marginBottom: SPACING.md,
    marginRight: SPACING.sm,
    textDecorationLine: "underline",
  },
  list: {
    paddingHorizontal: SPACING.md,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FavoritesScreen;
