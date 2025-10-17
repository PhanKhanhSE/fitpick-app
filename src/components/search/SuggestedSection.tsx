import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealCardOverlay from '../MealCardOverlay';

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
}

const SuggestedSection: React.FC<SuggestedSectionProps> = ({
  data,
  favorites,
  onMealPress,
  onFavoritePress,
}) => {
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
        isFavorite={favorites.includes(item.id)}
        onPress={() => onMealPress(item)}
        onFavoritePress={() => onFavoritePress(item.id)}
        layout="vertical"
        width={CARD_WIDTH}
        height={CARD_WIDTH * 1.2}
      />
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
      <FlatList
        data={data}
        renderItem={renderSuggestedItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.gridList}
        columnWrapperStyle={styles.row}
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
    paddingHorizontal: SPACING.md,
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