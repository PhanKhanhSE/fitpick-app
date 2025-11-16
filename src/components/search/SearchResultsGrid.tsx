import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealCardHorizontal from '../MealCardHorizontal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
  isLocked?: boolean;
  isFavorite?: boolean;
}

interface SearchResultsGridProps {
  data: MealData[];
  favorites: string[];
  onMealPress: (meal: MealData) => void;
  onFavoritePress: (id: string) => void;
  isFavorite?: (mealId: number) => boolean;
}

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  data,
  favorites,
  onMealPress,
  onFavoritePress,
  isFavorite,
}) => {
  const renderMealItem = ({ item }: { item: MealData }) => {
    // Calculate card width for 2 columns with spacing
    const screenPadding = SPACING.md * 2; // Left + Right padding
    const columnGap = SPACING.sm;
    const availableWidth = SCREEN_WIDTH - screenPadding;
    const cardWidth = (availableWidth - columnGap) / 2;
    
    return (
      <View style={styles.cardContainer}>
        <MealCardHorizontal
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
          width={cardWidth}
          height={200}
        />
      </View>
    );
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Disable scroll since parent ScrollView handles it
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  cardContainer: {
    flex: 1,
    minWidth: 0, // Important for flex to work with numColumns
  },
});

export default SearchResultsGrid;

