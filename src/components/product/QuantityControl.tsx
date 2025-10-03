import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADII } from '../../utils/theme';

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <View style={styles.quantityControl}>
      <TouchableOpacity onPress={onDecrement} style={styles.qtyButton}>
        <Text style={styles.qtyButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrement} style={styles.qtyButton}>
        <Text style={styles.qtyButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityControl: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  qtyButton: {
    width: 28,
    height: 28  ,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { 
    fontSize: 16, 
    color: COLORS.primary 
  },
  quantityText: { 
    marginHorizontal: 8, 
    fontSize: 16, 
    fontWeight: '400', 
    color: COLORS.text 
  },
});

export default QuantityControl;