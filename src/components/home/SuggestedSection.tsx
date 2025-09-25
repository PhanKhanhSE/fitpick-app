import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';

const { width } = Dimensions.get('window');

interface MealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
}

interface MealCardProps {
  title: string;
  calories: string;
  time: string;
  image: any;
  tag?: string;
  onPress: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ title, calories, time, image, tag, onPress }) => (
  <TouchableOpacity style={styles.mealCard} onPress={onPress}>
    <Image source={image} style={styles.mealImage} />
    {tag && (
      <View style={styles.mealTag}>
        <Text style={styles.mealTagText}>{tag}</Text>
      </View>
    )}
    <TouchableOpacity style={styles.heartIcon}>
      <Ionicons name="heart-outline" size={20} color={COLORS.primary} />
    </TouchableOpacity>
    <View style={styles.mealInfo}>
      <Text style={styles.mealTitle}>{title}</Text>
      <Text style={styles.mealDetails}>{calories} • {time}</Text>
    </View>
  </TouchableOpacity>
);

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
          <MealCard
            key={meal.id}
            title={meal.title}
            calories={meal.calories}
            time={meal.time}
            image={meal.image}
            tag={meal.tag}
            onPress={() => onMealPress(meal)}
          />
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
  mealCard: {
    width: (width - SPACING.md * 3.5) / 2,
    marginRight: SPACING.sm,
    backgroundColor: 'white',
    borderRadius: RADII.sm,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: SPACING.xs,
    gap: -SPACING.xs,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  mealImage: {
    width: '100%',
    height: 105,
    backgroundColor: COLORS.border,
  },
  mealTag: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: RADII.umd,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  mealTagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  heartIcon: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: SPACING.xs,
  },
  mealInfo: {
    padding: SPACING.md,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  mealDetails: {
    fontSize: 12,
    color: COLORS.muted,
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