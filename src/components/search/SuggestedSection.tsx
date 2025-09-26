import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import MealCardOverlay from '../MealCardOverlay';

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
  const renderSuggestedItem = ({ item, index }: { item: MealData; index: number }) => (
    <View style={[
      styles.suggestedItem,
      index % 2 === 0 ? styles.suggestedItemLeft : styles.suggestedItemRight
    ]}>
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
        width={158}
        height={193}
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
    marginBottom: SPACING.umd,
    paddingHorizontal: SPACING.md,
  },
  gridList: {
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-between',
  },
  suggestedItem: {
    flex: 1,
    marginBottom: SPACING.sm,
  },
  suggestedItemLeft: {
    marginRight: SPACING.sm / 2,
  },
  suggestedItemRight: {
    marginLeft: SPACING.sm / 2,
  },
});

export default SuggestedSection;