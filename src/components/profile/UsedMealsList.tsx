import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/theme';
import { useMealHistory} from '../../hooks/useMealHistory';
import { MealHistoryDto } from '../../services/mealHistoryAPI';
import { searchAPI } from '../../services/searchAPI';

interface UsedMealsListProps {
  selectedDate: string;
  onMealPress?: (meal: any) => void;
}

const UsedMealsList: React.FC<UsedMealsListProps> = ({
  selectedDate,
  onMealPress,
}) => {
  const { 
    mealHistory, 
    loading, 
    deleteMealHistory, 
    loadMealHistoryByDate,
    getDetailedDailyStats 
  } = useMealHistory();
  
  const [dayMeals, setDayMeals] = useState<MealHistoryDto[]>([]);
  const [mealImages, setMealImages] = useState<Record<number, string>>({});

  useEffect(() => {
    loadDayMeals();
  }, [selectedDate]);

  const loadDayMeals = async () => {
    try {
      const meals = await loadMealHistoryByDate(selectedDate);
      setDayMeals(meals);
      
      // Load images for meals
      const imagesMap: Record<number, string> = {};
      
      // First, use imageUrl from API response if available
      meals.forEach((meal) => {
        const mealImageUrl = (meal.meal as any)?.imageUrl || meal.meal?.imageUrl;
        if (mealImageUrl && meal.mealid) {
          imagesMap[meal.mealid] = mealImageUrl;
        }
      });
      
      // Then, fetch missing images from meal detail API
      const mealsNeedingImages = meals.filter(meal => !imagesMap[meal.mealid] && meal.mealid);
      
      const missingImagePromises = mealsNeedingImages.map(async (meal) => {
        try {
          const mealDetail = await searchAPI.getMealDetail(meal.mealid!);
          if (mealDetail.success && mealDetail.data?.imageUrl) {
            return { mealId: meal.mealid!, imageUrl: mealDetail.data.imageUrl };
          }
        } catch (error) {
          console.error(`Error fetching image for meal ${meal.mealid}:`, error);
        }
        return null;
      });
      
      const fetchedImages = await Promise.all(missingImagePromises);
      fetchedImages.forEach((result) => {
        if (result) {
          imagesMap[result.mealId] = result.imageUrl;
        }
      });
      
      setMealImages(imagesMap);
    } catch (error) {
      console.error('Error loading day meals:', error);
    }
  };


  const handleDeleteMeal = (historyId: number, mealName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa "${mealName}" khỏi danh sách đã ăn?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteMealHistory(historyId);
            if (success) {
              await loadDayMeals();
            }
          },
        },
      ]
    );
  };

  const handleMealPress = (meal: MealHistoryDto) => {
    if (onMealPress) {
      // Get imageUrl from cache first, then from meal object, then placeholder
      const imageUrl = mealImages[meal.mealid] || 
                       (meal.meal as any)?.imageUrl || 
                       meal.meal?.imageUrl || 
                       'https://via.placeholder.com/150';
      onMealPress({
        id: meal.mealid.toString(),
        title: meal.meal?.name || 'Unknown Meal',
        calories: meal.calories.toString(),
        time: meal.mealtime?.name || 'Unknown Time',
        image: { uri: imageUrl },
        tag: meal.mealtime?.name || 'meal',
        isLocked: false,
      });
    }
  };

  const renderMealItem = ({ item }: { item: MealHistoryDto }) => {
    // Get imageUrl from cache first, then from meal object, then placeholder
    const imageUrl = mealImages[item.mealid] || 
                     (item.meal as any)?.imageUrl || 
                     item.meal?.imageUrl || 
                     'https://via.placeholder.com/80';
    
    return (
      <TouchableOpacity
        style={styles.mealItem}
        onPress={() => handleMealPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.mealContent}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.mealImage}
            resizeMode="cover"
            onError={() => {
              // Fallback to placeholder if image fails to load
              setMealImages(prev => ({
                ...prev,
                [item.mealid]: 'https://via.placeholder.com/80'
              }));
            }}
          />
        
        <View style={styles.mealInfo}>
          <Text style={styles.mealName} numberOfLines={2}>
            {item.meal?.name || 'Unknown Meal'}
          </Text>
          
          <View style={styles.mealDetails}>
            <Text style={styles.mealTime}>
              {item.mealtime?.name || 'Unknown Time'}
            </Text>
            <Text style={styles.mealCalories}>
              {item.calories} cal
            </Text>
          </View>
          
          <View style={styles.quantityInfo}>
            <Text style={styles.quantity}>
              Số lượng: {item.quantity} {item.unit}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMeal(item.historyid, item.meal?.name || 'Unknown')}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyText}>
        Chưa có món ăn nào được đánh dấu đã ăn
      </Text>
      <Text style={styles.emptySubText}>
        Hãy đánh dấu các món ăn bạn đã ăn để theo dõi dinh dưỡng
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Món ăn đã dùng ({dayMeals.length})
        </Text>
        <Text style={styles.headerSubtitle}>
          {new Date(selectedDate).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.listContainer}>
        {dayMeals.length === 0 ? (
          renderEmptyState()
        ) : (
          dayMeals.map((item) => (
            <View key={item.historyid.toString()}>
              {renderMealItem({ item })}
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  listContainer: {
    padding: 16,
  },
  mealItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    color: COLORS.gray,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  quantityInfo: {
    marginTop: 4,
  },
  quantity: {
    fontSize: 12,
    color: COLORS.gray,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default UsedMealsList;
