import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import MealCard from '../MealCard';

const { width } = Dimensions.get('window');

interface MealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
}

interface SuggestedSectionProps {
  mealData: MealData[];
  onMealPress: (meal: MealData) => void;
}

const SuggestedSection: React.FC<SuggestedSectionProps> = ({ mealData, onMealPress }) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
        <TouchableOpacity>
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
            <MealCard
              id={meal.id}
              title={meal.title}
              calories={meal.calories}
              time={meal.time}
              image={meal.image}
              tag={meal.tag}
              onPress={() => onMealPress(meal)}
              width={(width - SPACING.md * 3.5) / 2}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.noMoreSuggestions}>
        <Text style={styles.noMoreText}>Chưa thấy món ưng ý? </Text>
        <TouchableOpacity>
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
    marginRight: SPACING.umd,
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