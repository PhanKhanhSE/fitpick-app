import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealCardVertical from '../MealCardHorizontal';
import { Ionicons } from '@expo/vector-icons';

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
  initialLimit?: number;
  onViewMore?: () => void;
}

const PopularSection: React.FC<PopularSectionProps> = ({
  data,
  favorites,
  onMealPress,
  onFavoritePress,
  isFavorite,
  initialLimit = 6,
  onViewMore,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, initialLimit);
  const hasMore = data.length > initialLimit;

  const renderPopularItem = ({ item }: { item: MealData }) => {
    return (
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
  };

  const handleViewMore = () => {
    // Show all loaded meals
    setShowAll(true);
    
    // If there's an onViewMore callback, call it (for loading more data if needed)
    if (onViewMore) {
      onViewMore();
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Phổ biến</Text>
        {hasMore && !showAll && (
          <TouchableOpacity onPress={handleViewMore} style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>Xem thêm</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={displayData}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.umd,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 18,
  },
  popularItem: {
    marginRight: SPACING.sm,
  },
});

export default PopularSection;