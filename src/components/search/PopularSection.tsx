import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealCardVertical from '../MealCardHorizontal';

interface MealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
  isLocked: boolean;
}

interface PopularSectionProps {
  data: MealData[];
  favorites: string[];
  onMealPress: (meal: MealData) => void;
  onFavoritePress: (id: string) => void;
  isFavorite?: (mealId: number) => boolean;
}

const PopularSection: React.FC<PopularSectionProps> = ({
  data,
  favorites,
  onMealPress,
  onFavoritePress,
  isFavorite,
}) => {
  const renderPopularItem = ({ item }: { item: MealData }) => (
    <View style={styles.popularItem}>
      <MealCardVertical
        id={item.id}
        title={item.title}
        calories={item.calories}
        time={item.time}
        image={item.image}
        tag={item.tag}
        isLocked={item.isLocked}
        isFavorite={isFavorite ? isFavorite(parseInt(item.id)) : favorites.includes(item.id)}
        onPress={() => onMealPress(item)}
        onFavoritePress={() => onFavoritePress(item.id)}
        width={158}
        height={175}
      />
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Phổ biến</Text>
      <FlatList
        data={data}
        renderItem={renderPopularItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.umd,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  horizontalList: {
    paddingHorizontal: 18,
  },
  popularItem: {
    marginRight: SPACING.sm,
  },
});

export default PopularSection;