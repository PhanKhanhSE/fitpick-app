import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealCard from '../MealCard';

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
      <MealCard
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
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  gridList: {
    paddingHorizontal: SPACING.md,
  },
  suggestedItem: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
});

export default SuggestedSection;