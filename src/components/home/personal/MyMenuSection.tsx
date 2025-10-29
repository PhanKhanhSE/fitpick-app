import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, RADII } from '../../../utils/theme';
import MealCardVertical from '../../MealCardHorizontal';

const { width } = Dimensions.get('window');

interface MealData {
  id: string;
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
}

const MyMenuSection: React.FC<MyMenuSectionProps> = ({ 
  mealData, 
  onMealPress, 
  onSeeMore, 
  isFavorite, 
  onFavoritePress 
}) => {

  return (
    <View style={styles.myMenuSection}>
      <View style={[styles.sectionHeader, styles.myMenuSectionHeader]}>
        <Text style={[styles.sectionTitle, styles.myMenuTitle]}>Thực đơn của tôi</Text>
        <TouchableOpacity onPress={onSeeMore}>
          <Text style={[styles.seeMore, styles.myMenuSeeMore]}>xem thêm</Text>
        </TouchableOpacity>
      </View>

      {mealData.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mealScrollView}
          contentContainerStyle={styles.mealScrollContent}
        >
          {mealData.map((meal, index) => (
            <View key={meal.id || `meal-${index}`} style={styles.mealCardWrapper}>
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
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Chưa có thực đơn cho hôm nay</Text>
          <Text style={styles.emptyStateSubtext}>Hãy tạo thực đơn mới hoặc xem gợi ý bên dưới</Text>
        </View>
      )}
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
  emptyState: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default MyMenuSection;