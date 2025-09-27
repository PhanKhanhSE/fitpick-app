import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, RADII, COLORS } from '../../utils/theme';
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
  const [showCheckbox, setShowCheckbox] = useState(false);

  const handleCardPress = () => {
    if (multiSelect) {
      setShowCheckbox(true);
    }
    onPress();
  };

  return (
    <View style={styles.container}>
      <MealCardOverlay
        id={item.id}
        title={item.name}
        calories={`${item.calories} kcal`}
        time={`${item.weight}g`}
        image={item.image}
        onPress={handleCardPress}
        width={CARD_WIDTH}
        height={CARD_WIDTH * 1.2}
        showFavoriteButton={false}
      />
      
      {/* Multi-select checkbox - chỉ hiện khi ấn */}
      {multiSelect && showCheckbox && (
        <TouchableOpacity
          style={[
            styles.checkbox,
            { backgroundColor: isSelected ? COLORS.primary : 'transparent' },
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
    top: '50%',
    left: '50%',
    width: 42,
    height: 42,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -21 }, { translateY: -21 }],
  },
  moreButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});

export default FavoriteCard;