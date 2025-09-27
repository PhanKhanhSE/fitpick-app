import React from 'react';
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADII } from '../../utils/theme';
import MealCardOverlay from '../MealCardOverlay';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  weight: number;
  image: any;
}

interface FavoriteCardProps {
  item: FoodItem;
  multiSelect: boolean;
  isSelected: boolean;
  onPress: () => void;
  onMorePress: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  item,
  multiSelect,
  isSelected,
  onPress,
  onMorePress,
}) => {
  return (
    <View style={styles.container}>
      <MealCardOverlay
        id={item.id}
        title={item.name}
        calories={`${item.calories} kcal`}
        time={`${item.weight}g`}
        image={item.image}
        onPress={onPress}
        width={CARD_WIDTH}
        height={CARD_WIDTH * 1.2}
        isFavorite={true}
      />
      
      {/* Multi-select checkbox */}
      {multiSelect && (
        <TouchableOpacity
          style={[
            styles.checkbox,
            { backgroundColor: isSelected ? 'rgba(255, 0, 100, 0.8)' : 'rgba(0, 0, 0, 0.3)' }
          ]}
          onPress={onPress}
        >
          {isSelected && <Ionicons name="checkmark" size={20} color="white" />}
        </TouchableOpacity>
      )}
      
      {/* More button when not in multi-select mode */}
      {!multiSelect && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={onMorePress}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: SPACING.xs,
    marginHorizontal: SPACING.xs,
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: RADII.sm,
  },
});

export default FavoriteCard;