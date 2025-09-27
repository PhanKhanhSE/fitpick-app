import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealItem from './MealItem';

interface MealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
}

interface MealSectionProps {
  title: string;
  totalCalories: string;
  meals: MealData[];
  selectedMeals: string[];
  showDivider?: boolean; // Để hiển thị đường kẻ phân cách sau section này
  onMealPress: (meal: MealData) => void;
  onToggleSelect: (id: string) => void;
  onOptionsPress: (meal: MealData) => void;
}

const MealSection: React.FC<MealSectionProps> = ({
  title,
  totalCalories,
  meals,
  selectedMeals,
  showDivider = false,
  onMealPress,
  onToggleSelect,
  onOptionsPress,
}) => {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.calories}>{totalCalories}</Text>
        </View>
        
        <View style={styles.mealsList}>
          {meals.map((meal) => (
            <MealItem
              key={meal.id}
              id={meal.id}
              title={meal.title}
              calories={meal.calories}
              time={meal.time}
              image={meal.image}
              isSelected={selectedMeals.includes(meal.id)}
              onPress={() => onMealPress(meal)}
              onToggleSelect={() => onToggleSelect(meal.id)}
              onOptionsPress={() => onOptionsPress(meal)}
            />
          ))}
        </View>
      </View>
      
      {/* Đường kẻ phân cách giữa các buổi ăn */}
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  calories: {
    fontSize: 14,
    color: COLORS.muted,
  },
  mealsList: {
    backgroundColor: 'white',
    marginHorizontal: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.lg,
  },
});

export default MealSection;