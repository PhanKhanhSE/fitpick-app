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

interface MyMenuSectionProps {
  mealData: MealData[];
  onMealPress: (meal: MealData) => void;
}

const MyMenuSection: React.FC<MyMenuSectionProps> = ({ mealData, onMealPress }) => {
  return (
    <View style={styles.myMenuSection}>
      <View style={[styles.sectionHeader, styles.myMenuSectionHeader]}>
        <Text style={[styles.sectionTitle, styles.myMenuTitle]}>Thực đơn của tôi</Text>
        <TouchableOpacity>
          <Text style={[styles.seeMore, styles.myMenuSeeMore]}>xem thêm</Text>
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
    marginRight: SPACING.umd,
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
});

export default MyMenuSection;