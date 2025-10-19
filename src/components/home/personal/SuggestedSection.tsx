import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { COLORS, SPACING, RADII } from '../../../utils/theme';
import MealCardOverlay from '../../MealCardOverlay';

interface MealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
  isLocked?: boolean;
}

interface SuggestedSectionProps {
  mealData: MealData[];
  onMealPress: (meal: MealData) => void;
  onSeeMore?: () => void;
  onExploreMore?: () => void;
  isFavorite?: (mealId: number) => boolean;
  onFavoritePress?: (mealId: number) => void;
}

const SuggestedSection: React.FC<SuggestedSectionProps> = ({ 
  mealData, 
  onMealPress, 
  onSeeMore, 
  onExploreMore,
  isFavorite,
  onFavoritePress
}) => {

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
        <TouchableOpacity onPress={onSeeMore}>
          <Text style={styles.seeMore}>xem thêm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.mealScrollView}
        contentContainerStyle={styles.mealScrollContent}
      >
        {mealData.map((meal) => (
          <View key={meal.id} style={styles.mealCardWrapper}>
            <MealCardOverlay
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
              width={180}
              height={220}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.noMoreSuggestions}>
        <Text style={styles.noMoreText}>Chưa thấy món ưng ý? </Text>
        <TouchableOpacity onPress={onExploreMore || onSeeMore}>
          <Text style={styles.exploreMore}>Khám phá thêm</Text>
        </TouchableOpacity>
      </View>
    </>
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
  noMoreSuggestions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  noMoreText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: -SPACING.md,
  },
  exploreMore: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: -SPACING.md,
  },
});

export default SuggestedSection;