import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADII } from '../../../utils/theme';
import MealCardVertical from '../../MealCardHorizontal';
import { Ionicons } from '@expo/vector-icons';
import { mealPlanAPI } from '../../../services/mealPlanAPI';

const { width } = Dimensions.get('window');

interface MealData {
  id: string;
  // A stable unique key for React lists; can differ from id to avoid duplicates
  uniqueKey?: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
  isLocked?: boolean;
}

interface MyMenuSectionProps {
  mealData: MealData[];
  onMealPress: (meal: MealData) => void;
  onSeeMore?: () => void;
  isFavorite?: (mealId: number) => boolean;
  onFavoritePress?: (mealId: number) => void;
  onAutoSuggest?: () => void;
  navigation?: any;
}

const MyMenuSection: React.FC<MyMenuSectionProps> = ({ 
  mealData, 
  onMealPress, 
  onSeeMore, 
  isFavorite, 
  onFavoritePress,
  onAutoSuggest,
  navigation
}) => {
  const [isAutoSuggesting, setIsAutoSuggesting] = useState(false);

  const handleAutoSuggest = async () => {
    if (onAutoSuggest) {
      await onAutoSuggest();
      return;
    }

    // Default implementation: generate meal plan for today
    try {
      setIsAutoSuggesting(true);
      const today = new Date();
      const response = await mealPlanAPI.generateMealPlan(today);
      
      if (response.success) {
        Alert.alert(
          'Thành công',
          'Đã tự động chọn món phù hợp với profile của bạn!',
          [
            {
              text: 'Xem thực đơn',
              onPress: () => {
                // Navigate to Menu tab to see the generated meal plan
                if (navigation) {
                  (navigation as any).jumpTo('Menu');
                }
              }
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể tự động chọn món');
      }
    } catch (error) {
      console.error('Error auto-suggesting meals:', error);
      Alert.alert('Lỗi', 'Không thể tự động chọn món. Vui lòng thử lại.');
    } finally {
      setIsAutoSuggesting(false);
    }
  };

  const handleNavigateToMenu = () => {
    if (navigation) {
      (navigation as any).jumpTo('Menu');
    } else if (onSeeMore) {
      onSeeMore();
    }
  };

  return (
    <View style={styles.myMenuSection}>
      <View style={[styles.sectionHeader, styles.myMenuSectionHeader]}>
        <Text style={[styles.sectionTitle, styles.myMenuTitle]}>Thực đơn của tôi</Text>
        <TouchableOpacity onPress={handleNavigateToMenu}>
          <Text style={[styles.seeMore, styles.myMenuSeeMore]}>xem thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Auto Suggest Button */}
      <View style={styles.autoSuggestContainer}>
        <TouchableOpacity 
          style={styles.autoSuggestButton}
          onPress={handleAutoSuggest}
          disabled={isAutoSuggesting}
        >
          {isAutoSuggesting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="sparkles" size={20} color="#FFF" />
          )}
          <Text style={styles.autoSuggestText}>
            {isAutoSuggesting ? 'Đang chọn món...' : 'Tự động chọn món cho tôi'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.mealScrollView}
        contentContainerStyle={styles.mealScrollContent}
      >
        {mealData.map((meal) => (
          <View key={meal.uniqueKey || meal.id} style={styles.mealCardWrapper}>
            <MealCardVertical
              id={meal.id}
              title={meal.title}
              calories={meal.calories}
              time={meal.time}
              image={meal.image}
              tag={meal.tag}
              isLocked={meal.isLocked}
              isFavorite={isFavorite ? isFavorite(parseInt(meal.id)) : false}
              onFavoritePress={() => onFavoritePress ? onFavoritePress(parseInt(meal.id)) : undefined}
              onPress={() => onMealPress(meal)}
              width={158}
              height={175}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeMore: {
    fontSize: 14,
    color: COLORS.primary,
    paddingEnd: 3,
    paddingTop: 2,
    textDecorationLine: 'underline',
  },
  mealScrollView: {
    marginBottom: SPACING.lg,
  },
  mealScrollContent: {
    paddingHorizontal: SPACING.md,
  },
  mealCardWrapper: {
    marginRight: SPACING.sm,
  },
  myMenuSection: {
    backgroundColor: COLORS.primary,
    paddingTop: -SPACING.md,
  },
  myMenuTitle: {
    color: 'white',
    marginTop: SPACING.sm,
    marginBottom: -SPACING.xs,
  },
  myMenuSeeMore: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  myMenuSectionHeader: {
    marginTop: 0,
    marginBottom: SPACING.md,
  },
  autoSuggestContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  autoSuggestButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADII.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  autoSuggestText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});

export default MyMenuSection;