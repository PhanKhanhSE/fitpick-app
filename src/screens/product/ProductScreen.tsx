import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../utils/theme';
import {
  ProductHeader,
  ProductCard,
  ProductActionModal,
  ProductData,
} from '../../components/product';

// Sample data
const sampleProducts: ProductData[] = [
  {
    id: '1',
    name: 'Cá hồi sốt tiêu kèm bơ xanh',
    quantity: 1,
    items: Array.from({ length: 5 }, (_, i) => ({
      name: `Nguyên liệu ${i + 1}`,
      weight: `${i + 50} g`,
      checked: false,
    })),
  },
  {
    id: '2',
    name: 'Gà nướng mật ong',
    quantity: 1,
    items: Array.from({ length: 4 }, (_, i) => ({
      name: `Nguyên liệu ${i + 1}`,
      weight: `${i + 30} g`,
      checked: false,
    })),
  },
  {
    id: '3',
    name: 'Gà nướng mật ong',
    quantity: 1,
    items: Array.from({ length: 4 }, (_, i) => ({
      name: `Nguyên liệu ${i + 1}`,
      weight: `${i + 30} g`,
      checked: false,
    })),
  },
  {
    id: '4',
    name: 'Gà nướng mật ong',
    quantity: 1,
    items: Array.from({ length: 4 }, (_, i) => ({
      name: `Nguyên liệu ${i + 1}`,
      weight: `${i + 30} g`,
      checked: false,
    })),
  },
];

const ProductScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [products, setProducts] = useState(sampleProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  const handleQuantityChange = (id: string, increment: boolean) => {
    setProducts(prev => 
      prev.map(p => {
        if (p.id === id) {
          const newQuantity = increment 
            ? p.quantity + 1 
            : Math.max(0, p.quantity - 1);
          return { ...p, quantity: newQuantity };
        }
        return p;
      })
    );
  };

  const handleItemToggle = (productId: string, itemIndex: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newItems = [...p.items];
          newItems[itemIndex] = { 
            ...newItems[itemIndex], 
            checked: !newItems[itemIndex].checked 
          };
          return { ...p, items: newItems };
        }
        return p;
      })
    );
  };

  const handleMarkAllChecked = () => {
    // Check if all items are checked
    const allItemsChecked = products.every(p => 
      p.items.every(item => item.checked)
    );

    setProducts(prev =>
      prev.map(p => ({
        ...p,
        items: p.items.map(item => ({ ...item, checked: !allItemsChecked }))
      }))
    );
  };

  const handleMarkAllCheckedProduct = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const allChecked = p.items.every(item => item.checked);
          return { ...p, items: p.items.map(item => ({ ...item, checked: !allChecked })) };
        }
        return p;
      })
    );
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedProduct(null);
  };

  const handleViewRecipe = (product: ProductData) => {
    if (navigation) {
      navigation.navigate('MealDetail', {
        meal: {
          id: product.id,
          title: product.name,
          calories: '0 kcal',
          price: '0 VND',
          image: { uri: 'https://via.placeholder.com/300' },
          ingredients: product.items.map(item => ({
            name: item.name,
            amount: item.weight,
          })),
          instructions: ['Hướng dẫn sẽ được cập nhật sau.'],
        },
      });
    }
  };

  const handleMenuPress = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  // Check if all items are checked
  const allItemsChecked = products.every(p => 
    p.items.every(item => item.checked)
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container}
        stickyHeaderIndices={[0]}
      >
        <ProductHeader
          onBack={() => navigation?.goBack?.()}
          onMarkAll={handleMarkAllChecked}
          allItemsChecked={allItemsChecked}
        />
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onQuantityChange={handleQuantityChange}
            onItemToggle={handleItemToggle}
            onMenuPress={handleMenuPress}
          />
        ))}
      </ScrollView>

      <ProductActionModal
        visible={!!selectedProduct}
        selectedProduct={selectedProduct}
        allItemsChecked={selectedProduct ? selectedProduct.items.every(item => item.checked) : false}
        onClose={() => setSelectedProduct(null)}
        onViewRecipe={handleViewRecipe}
        onMarkAllChecked={handleMarkAllCheckedProduct}
        onRemoveProduct={handleRemoveProduct}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
});

export default ProductScreen;
