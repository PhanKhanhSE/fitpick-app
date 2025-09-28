import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';

interface MealTitleQuantityProps {
  title: string;
  quantity: number;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
}

const MealTitleQuantity: React.FC<MealTitleQuantityProps> = ({
  title,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
  return (
    <View style={styles.titleQuantityContainer}>
      <Text style={styles.mealTitle} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[styles.qtyButton, quantity === 1 && { opacity: 0.4 }]}
          onPress={onDecreaseQuantity}
          disabled={quantity === 1}
        >
          <Text style={styles.qtyButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyText}>{quantity}</Text>

        <TouchableOpacity style={styles.qtyButton} onPress={onIncreaseQuantity}>
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingRight: SPACING.md,
    marginLeft: -SPACING.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -SPACING.md,
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  qtyText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default MealTitleQuantity;