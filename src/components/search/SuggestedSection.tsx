import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealCardOverlay from '../MealCardOverlay';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

interface MealData {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: { uri: string };
  tag: string;
  isLocked: boolean;
}

interface SuggestedSectionProps {
  data: MealData[];
  favorites: string[];
  onMealPress: (meal: MealData) => void;
  onFavoritePress: (id: string) => void;
  isFavorite?: (mealId: number) => boolean;
  initialLimit?: number;
  onViewMore?: () => void;
}

const SuggestedSection: React.FC<SuggestedSectionProps> = ({
  data,
  favorites,
  onMealPress,
  onFavoritePress,
  isFavorite,
  initialLimit = 6,
  onViewMore,
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Calculate display data based on showAll state
  const displayData = useMemo(() => {
    return showAll ? data : data.slice(0, initialLimit);
  }, [showAll, data, initialLimit]);
  
  const hasMore = data.length > initialLimit;

  // Reset showAll when data changes (if data becomes less than limit)
  useEffect(() => {
    if (data.length <= initialLimit) {
      setShowAll(false);
    }
  }, [data.length, initialLimit]);

  const renderSuggestedItem = ({ item }: { item: MealData }) => (
    <View style={styles.suggestedItem}>
      <MealCardOverlay
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
        layout="vertical"
        width={CARD_WIDTH}
        height={CARD_WIDTH * 1.2}
      />
    </View>
  );

  const handleViewMore = () => {
    // Always set showAll to true first to show all loaded meals
    setShowAll(true);
    
    // If there's an onViewMore callback, call it (for loading more data if needed)
    if (onViewMore) {
      onViewMore();
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
        {hasMore && !showAll && (
          <TouchableOpacity onPress={handleViewMore} style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>Xem thêm</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={displayData}
        renderItem={renderSuggestedItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.gridList}
        columnWrapperStyle={styles.row}
        key={`suggested-${showAll}-${displayData.length}`}
        extraData={displayData.length}
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
  gridList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  suggestedItem: {
    width: CARD_WIDTH,
    marginBottom: SPACING.xs,
    marginHorizontal: SPACING.xs,
  },
});

export default SuggestedSection;