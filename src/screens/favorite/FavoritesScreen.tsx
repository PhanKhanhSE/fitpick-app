import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { useIngredients } from '../../hooks/useIngredients';
import { useMealPlans } from '../../hooks/useMealPlans';
import { useUser } from '../../hooks/useUser';
import { useProUser } from '../../hooks/useProUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const { removeFavorite, removeMultipleFavorites } = useFavorites();
  const { addMealToProducts, addMultipleMealsToProducts, loadUserProducts, isMealInProductList } = useIngredients();
  const { isMealInPlan, addMealToMenu, loadTodayMealPlan } = useMealPlans();
  const { isProUser: checkIsProUser, permissions } = useProUser();
  
  // Get Pro status as a value using useMemo to avoid calling class as function
  const isPro = useMemo(() => {
    if (checkIsProUser && typeof checkIsProUser === 'function') {
      return checkIsProUser();
    }
    return permissions?.isProUser || false;
  }, [checkIsProUser, permissions]);
  
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [actionItem, setActionItem] = useState<FoodItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  
  // State for API data
  const [favoriteItems, setFavoriteItems] = useState<FoodItem[]>([]);
  const [favoriteDetails, setFavoriteDetails] = useState<FavoriteMealWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Ref để tránh reload không cần thiết
  const isReloadingRef = useRef(false);
  const lastLoadTimeRef = useRef(0);
  const CACHE_DURATION = 2000; // Cache 2 giây

  // Load favorites from API - wrap trong useCallback để tránh infinite loop
  const loadFavorites = useCallback(async () => {
    // Tránh reload quá nhanh (ít nhất 2 giây giữa các lần reload)
    const now = Date.now();
    if (isReloadingRef.current || (now - lastLoadTimeRef.current < CACHE_DURATION)) {
      return;
    }
    
    isReloadingRef.current = true;
    lastLoadTimeRef.current = now;
    
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

      Alert.alert('Lỗi', 'Không thể tải danh sách yêu thích. Vui lòng thử lại.');
      setFavoriteItems([]);
      setFavoriteDetails([]);
    } finally {
      setIsLoading(false);
      // Reset flag sau một chút
      setTimeout(() => {
        isReloadingRef.current = false;
      }, CACHE_DURATION);
    }
  }, []); // Empty dependency array vì không phụ thuộc vào state nào

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

  // Auto reload when screen comes into focus (chỉ reload khi cần thiết)
  useFocusEffect(
    React.useCallback(() => {
      // Chỉ reload favorites và products để đồng bộ state (ẩn nút nếu đã thêm)
      // loadFavorites đã có cache 2 giây, không reload quá nhanh
      loadFavorites();
      // loadUserProducts đã có cache trong hook, không cần force reload mỗi lần
      loadUserProducts(false); // Không force reload, dùng cache nếu có
      // Không cần reload meal plans ở đây vì isMealInPlan sẽ check từ todayMealPlans state
      // Meal plans sẽ được reload tự động khi MenuScreen focus
    }, [loadFavorites, loadUserProducts])
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

  const handleMealPlannerSave = async (selectedDays: string[], mealType: string) => {
    if (!actionItem || selectedDays.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một ngày');
      return;
    }

    try {
      const mealId = parseInt(actionItem.id);
      if (isNaN(mealId)) {
        Alert.alert('Lỗi', 'ID món ăn không hợp lệ');
        return;
      }

      // Map mealType từ tiếng Việt sang tiếng Anh cho backend
      const mealTypeMap: { [key: string]: string } = {
        'Bữa sáng': 'breakfast',
        'Bữa trưa': 'lunch',
        'Bữa tối': 'dinner',
        'Bữa phụ': 'snack'
      };
      const backendMealTime = mealTypeMap[mealType] || 'breakfast';

      // Parse selectedDays (dayKey là date string từ toDateString(), ví dụ: "Mon Jan 01 2024")
      const datesToAdd: Date[] = [];
      selectedDays.forEach(dayKey => {
        try {
          // dayKey là output của toDateString(), parse lại thành Date
          const date = new Date(dayKey);
          if (!isNaN(date.getTime())) {
            // Đảm bảo time là 00:00:00 để tránh timezone issues
            date.setHours(0, 0, 0, 0);
            datesToAdd.push(date);
          } else {
            console.error('Invalid date string:', dayKey);
          }
        } catch (error) {
          console.error('Error parsing date:', dayKey, error);
        }
      });

      if (datesToAdd.length === 0) {
        Alert.alert('Lỗi', 'Không thể parse ngày đã chọn');
        return;
      }

      // Thêm món vào thực đơn cho từng ngày
      const addPromises = datesToAdd.map(date => 
        addMealToMenu(mealId, date, backendMealTime)
      );

      const results = await Promise.all(addPromises);
      const successCount = results.filter(r => r).length;
      const failedCount = results.length - successCount;

      if (successCount > 0) {
        // Đảm bảo timestamp được lưu trước khi navigate
        try {
          await AsyncStorage.setItem('lastMealAddedTimestamp', Date.now().toString());
        } catch (error) {
          console.error('Error saving meal added timestamp:', error);
        }
        
        Alert.alert(
          'Thành công', 
          failedCount > 0 
            ? `Đã thêm món vào ${successCount}/${datesToAdd.length} ngày trong thực đơn`
            : `Đã thêm món vào ${successCount} ngày trong thực đơn`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to MenuScreen để xem món mới được thêm
                // Đợi một chút để đảm bảo timestamp được lưu
                setTimeout(() => {
                  navigation.navigate('MainTabs' as any, { screen: 'Menu' });
                }, 100);
              }
            }
          ]
        );
        setShowMealPlanner(false);
        setActionItem(null);
      } else {
        Alert.alert('Lỗi', 'Không thể thêm món vào thực đơn. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Error adding meal to menu:', error);
      Alert.alert('Lỗi', error?.message || 'Không thể thêm món vào thực đơn. Vui lòng thử lại.');
    }
  };

  const handleGenerateWeeklyPlan = async () => {
    try {
      // Tính thứ 2 của tuần hiện tại
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      
      // TODO: Gọi API để sinh thực đơn cả tuần
      
      Alert.alert(
        'AI Sinh thực đơn', 
        'AI đang phân tích sở thích và tạo thực đơn cá nhân hóa cho cả tuần. Tính năng này sẽ sớm có mặt!',
        [{ text: 'OK' }]
      );
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể sinh thực đơn cả tuần');
    }
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
        onMorePress={() => {
          setActionItem(item);
          setShowActionModal(true);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Yêu thích</Text>
      </View>

      {/* Button chọn nhiều món - chỉ hiển thị khi có 2 món trở lên */}
      {!isLoading && favoriteItems.length >= 2 && (
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity onPress={() => setMultiSelect(!multiSelect)}>
            <Text style={styles.actionText}>
              {multiSelect ? "Bỏ chọn tất cả" : "Chọn nhiều món"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Grid danh sách */}
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
        extraData={favoriteItems.length} // Force re-render when favoriteItems changes
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={64} color={COLORS.muted} />
              <Text style={styles.emptyTitle}>Chưa có món yêu thích</Text>
              <Text style={styles.emptySubtitle}>
                Hãy thêm những món ăn bạn yêu thích vào danh sách này
              </Text>
            </View>
          )
        }
      />

      {/* Components */}
      <FavoriteBottomBar
        visible={multiSelect}
        selectedCount={selectedItems.length}
        onAddToProductList={async () => {
          if (selectedItems.length === 0) {
            Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một món ăn');
            return;
          }

          try {
            // Lấy tất cả mealIds hợp lệ
            const mealIds: number[] = [];
            const mealIdToName: { [key: number]: string } = {};
            
            selectedItems.forEach((itemId) => {
              const item = favoriteItems.find(fav => fav.id === itemId);
              if (item) {
                const mealId = parseInt(item.id);
                if (!isNaN(mealId)) {
                  mealIds.push(mealId);
                  mealIdToName[mealId] = item.name;
                } else {
                  console.error('❌ Invalid meal ID:', item.id);
                }
              }
            });
            
            if (mealIds.length === 0) {
              Alert.alert('Lỗi', 'Không có món ăn hợp lệ để thêm');
              return;
            }
            
            console.log(`🔄 Đang thêm ${mealIds.length} món vào danh sách sản phẩm...`);
            
            // Sử dụng hàm thêm nhiều món cùng lúc để tránh race condition
            const result = await addMultipleMealsToProducts(mealIds, true);
            
            // Reload một lần duy nhất sau khi tất cả món đã được thêm
            if (result.success && result.addedCount > 0) {
              // Reload user products để cập nhật state (ẩn nút nếu đã thêm)
              await loadUserProducts(true); // Force reload
              
              const message = result.addedCount === mealIds.length 
                ? `Đã thêm ${result.addedCount} món vào danh sách sản phẩm`
                : `Đã thêm ${result.addedCount}/${mealIds.length} món vào danh sách sản phẩm`;
              
              Alert.alert('Thành công', message);
              // Clear selection sau khi thêm thành công
              setSelectedItems([]);
              setMultiSelect(false);
              // Navigate to ProductScreen (Profile tab in MainTabs)
              navigation.navigate('MainTabs' as any, { screen: 'Profile' });
            } else {
              Alert.alert('Lỗi', 'Không thể thêm vào danh sách sản phẩm. Vui lòng kiểm tra kết nối và thử lại.');
            }
          } catch (error: any) {
            console.error('Error adding meals to product list:', error);
            Alert.alert('Lỗi', error?.message || 'Không thể thêm vào danh sách sản phẩm. Vui lòng thử lại.');
          } finally {
            // Clear selection
            setSelectedItems([]);
            setMultiSelect(false);
          }
        }}
        onDelete={handleDeleteMultiple}
      />

      <FavoriteActionModal
        visible={showActionModal}
        item={actionItem}
        onClose={() => {
          setActionItem(null);
          setShowActionModal(false);
        }}
        onAddToMealPlan={async () => {
          if (!actionItem) return;
          
          const mealId = parseInt(actionItem.id);
          if (isNaN(mealId)) {
            Alert.alert('Lỗi', 'ID món ăn không hợp lệ');
            setActionItem(null);
            setShowActionModal(false);
            return;
          }

          // Nếu là user free, tự động thêm vào hôm nay với bữa sáng (giống MealDetailScreen)
          if (!isPro) {
            try {
              // Giống MealDetailScreen - không setHours để tránh timezone issues
              const today = new Date();
              
              // Gọi addMealToMenu giống như MealDetailScreen
              const success = await addMealToMenu(mealId, today, 'breakfast');
              
              if (success) {
                // Timestamp đã được lưu trong useMealPlans, không cần lưu lại
                
                Alert.alert(
                  'Thành công', 
                  `Đã thêm "${actionItem.name}" vào Bữa sáng`,
                  [
                    {
                      text: 'Xem thực đơn',
                      onPress: () => {
                        navigation.navigate('MainTabs' as any, { screen: 'Menu' });
                      }
                    },
                    {
                      text: 'OK',
                      style: 'default'
                    }
                  ]
                );
              } else {
                console.error('❌ [FavoritesScreen] Thêm món thất bại, success = false');
                Alert.alert('Lỗi', 'Không thể thêm món vào thực đơn. Vui lòng thử lại.');
              }
            } catch (error: any) {
              console.error('❌ [FavoritesScreen] Error adding meal to menu:', error);
              console.error('❌ [FavoritesScreen] Error details:', error?.response?.data || error?.message);
              Alert.alert('Lỗi', error?.message || 'Không thể thêm món vào thực đơn. Vui lòng thử lại.');
            } finally {
              setActionItem(null);
              setShowActionModal(false);
            }
          } else {
            // Nếu là user Pro, mở modal để chọn ngày và bữa ăn
            setShowActionModal(false);
            setShowMealPlanner(true);
          }
        }}
        onAddToProductList={async () => {
          if (!actionItem) return;
          
          try {
            const mealId = parseInt(actionItem.id);
            if (isNaN(mealId)) {
              Alert.alert('Lỗi', 'ID món ăn không hợp lệ');
              setActionItem(null);
              setShowActionModal(false);
              return;
            }
            
            const success = await addMealToProducts(mealId, actionItem.name, actionItem.image?.uri);
            
            if (success) {
              // Reload user products để cập nhật state (ẩn nút nếu đã thêm)
              await loadUserProducts(true); // Force reload
              
              Alert.alert(
                'Thành công', 
                `Đã thêm "${actionItem.name}" vào danh sách sản phẩm`,
                [
                  {
                    text: 'Xem danh sách',
                    onPress: () => {
                      navigation.navigate('MainTabs' as any, { screen: 'Profile' });
                    }
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      // Đóng modal sau khi thêm thành công
                      setActionItem(null);
                      setShowActionModal(false);
                    }
                  }
                ]
              );
            } else {
              Alert.alert('Lỗi', 'Không thể thêm vào danh sách sản phẩm. Vui lòng kiểm tra kết nối và thử lại.');
              setActionItem(null);
              setShowActionModal(false);
            }
          } catch (error: any) {
            console.error('Error adding meal to product list:', error);
            Alert.alert('Lỗi', error?.message || 'Không thể thêm vào danh sách sản phẩm. Vui lòng thử lại.');
            setActionItem(null);
            setShowActionModal(false);
          }
        }}
        onDelete={handleDeleteSingle}
        isInMealPlan={actionItem ? isMealInPlan(parseInt(actionItem.id), new Date()) : false}
        isInProductList={actionItem ? isMealInProductList(parseInt(actionItem.id)) : false}
      />

      <MealPlannerModal
        visible={showMealPlanner}
        item={actionItem}
        onClose={() => setShowMealPlanner(false)}
        onSave={handleMealPlannerSave}
        isProUser={isPro}
        onGenerateWeeklyPlan={handleGenerateWeeklyPlan}
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
  actionButtonContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    alignItems: 'flex-end',
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: "right",
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
    color: COLORS.muted,
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
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FavoritesScreen;
