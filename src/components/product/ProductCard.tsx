import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';
import QuantityControl from './QuantityControl';
import IngredientItem, { IngredientItemData } from './IngredientItem';

export interface ProductData {
  id: string;
  name: string;
  quantity: number;
  items: IngredientItemData[];
}

interface ProductCardProps {
  product: ProductData;
  onQuantityChange: (id: string, increment: boolean) => void;
  onItemToggle: (productId: string, itemIndex: number) => void;
  onMenuPress: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuantityChange,
  onItemToggle,
  onMenuPress,
}) => {
  return (
    <View style={styles.productContainer}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{product.name}</Text>
        <TouchableOpacity onPress={() => onMenuPress(product.id)}>
          <Entypo name="dots-three-vertical" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Số lượng */}
      <View style={styles.bottomHeader}>
        <QuantityControl
          quantity={product.quantity}
          onIncrement={() => onQuantityChange(product.id, true)}
          onDecrement={() => onQuantityChange(product.id, false)}
        />
      </View>

      {/* Danh sách nguyên liệu */}
      {product.items.map((item, index) => (
        <IngredientItem
          key={index}
          item={item}
          onToggle={() => onItemToggle(product.id, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    marginHorizontal: 0,
    marginBottom: SPACING.lg,
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: 0,
  },
  productHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.sm 
  },
  productName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: COLORS.text 
  },
  bottomHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: SPACING.sm 
  },
});

export default ProductCard;