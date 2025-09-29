import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING } from '../../../utils/theme';
import MealCardOverlay from '../../MealCardOverlay';
import MealCardVertical from '../../MealCardHorizontal';

interface Meal {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
  isLocked: boolean;
}

interface UsedMealsProps {
  meals: Meal[];
  onMealPress: (meal: Meal) => void;
}

const UsedMeals: React.FC<UsedMealsProps> = ({
  meals,
  onMealPress,
}) => {
  return (
    <View style={styles.usedMealsContainer}>
      <Text style={styles.sectionTitle}>Món đã dùng</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.mealsScrollView}
        contentContainerStyle={styles.mealsScrollContent}
      >
        {meals.map((meal) => (
          <View key={meal.id} style={styles.mealCardWrapper}>
            <MealCardVertical
              id={meal.id}
              title={meal.title}
              calories={meal.calories}
              time={meal.time}
              image={meal.image}
              tag={meal.tag}
              isLocked={meal.isLocked}
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
  usedMealsContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  mealsScrollView: {
    marginHorizontal: -SPACING.xs,
  },
  mealsScrollContent: {
    paddingHorizontal: SPACING.xs,
  },
  mealCardWrapper: {
    marginHorizontal: SPACING.xs,
  },
});

export default UsedMeals;