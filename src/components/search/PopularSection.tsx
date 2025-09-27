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
}

const PopularSection: React.FC<PopularSectionProps> = ({
  data,
  favorites,
  onMealPress,
  onFavoritePress,
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
        isFavorite={favorites.includes(item.id)}
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
    marginTop: SPACING.umd,
    paddingHorizontal: SPACING.md,
  },
  horizontalList: {
    paddingHorizontal: SPACING.md,
  },
  popularItem: {
    marginRight: SPACING.sm,
  },
});

export default PopularSection;