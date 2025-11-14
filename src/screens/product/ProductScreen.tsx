import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../utils/theme';
import {
  ProductHeader,
  ProductCard,
  ProductActionModal,
  ProductData,
} from '../../components/product';
import { useIngredients } from '../../hooks/useIngredients';
import { ProductMealData } from '../../services/ingredientsAPI';

const ProductScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { 
    userProducts, 
    loading, 
    toggleIngredient, 
    removeMealFromProducts,
    loadMealIngredients,
    markAllIngredients,
    loadUserProducts,
    saveMealQuantity,
    getMealQuantity
  } = useIngredients();
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

  // Convert ProductMealData từ API sang ProductData cho UI
  const convertToProductData = (mealData: ProductMealData, quantity: number = 1): ProductData => {
    return {
      id: mealData.mealId.toString(),
      name: mealData.mealName,
      quantity: quantity,
      items: mealData.ingredients.map(ingredient => ({
        name: ingredient.name,
        weight: `${(ingredient.quantity * quantity).toFixed(1)} ${ingredient.unit}`,
        checked: ingredient.hasIt, // Mặc định false từ API
      })),
    };
  };

  // Load products từ API khi component mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingIngredients(true);
      
      // Load từng product với số lượng đã lưu
      const convertedProducts = await Promise.all(
        userProducts.map(async (mealData) => {
          const savedQuantity = await getMealQuantity(mealData.mealId);
          return convertToProductData(mealData, savedQuantity);
        })
      );
      
      setProducts(convertedProducts);
      setIsLoadingIngredients(false);
    };

    loadProducts();
  }, [userProducts]);

  // Theo dõi thay đổi số lượng từ MealDetailScreen (đồng bộ 2 chiều)
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedProducts = await Promise.all(
        userProducts.map(async (mealData) => {
          const savedQuantity = await getMealQuantity(mealData.mealId);
          return convertToProductData(mealData, savedQuantity);
        })
      );
      
      setProducts(prev => {
        // Chỉ update nếu có thay đổi
        const hasChanges = prev.some((product, index) => 
          product.quantity !== updatedProducts[index]?.quantity
        );
        
        if (hasChanges) {
          return updatedProducts;
        }
        return prev;
      });
    }, 1000); // Check mỗi giây

    return () => clearInterval(interval);
  }, [userProducts]);

  const handleQuantityChange = async (id: string, increment: boolean) => {
    const mealId = parseInt(id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newQuantity = increment 
      ? product.quantity + 1 
      : Math.max(1, product.quantity - 1); // Minimum quantity is 1
    
    // Lưu số lượng mới
    await saveMealQuantity(mealId, newQuantity);
    
    setProducts(prev => 
      prev.map(p => {
        if (p.id === id) {
          // Tìm userProduct để lấy nguyên liệu gốc
          const userProduct = userProducts.find(up => up.mealId === mealId);
          if (userProduct) {
            // Tính lại nguyên liệu theo số lượng mới
            const updatedItems = userProduct.ingredients.map(ingredient => ({
              name: ingredient.name,
              weight: `${(ingredient.quantity * newQuantity).toFixed(1)} ${ingredient.unit}`,
              checked: ingredient.hasIt,
            }));
            
            return { ...p, quantity: newQuantity, items: updatedItems };
          }
        }
        return p;
      })
    );
  };

  const handleItemToggle = async (productId: string, itemIndex: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const ingredient = product.items[itemIndex];
    const newCheckedState = !ingredient.checked;
    
    // Cập nhật local state ngay lập tức để UI responsive
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newItems = [...p.items];
          newItems[itemIndex] = { 
            ...newItems[itemIndex], 
            checked: newCheckedState 
          };
          return { ...p, items: newItems };
        }
        return p;
      })
    );

    // Gọi API để cập nhật backend
    const mealId = parseInt(productId);
    // Lấy ingredientId từ userProducts data thật
    const userProduct = userProducts.find(up => up.mealId === mealId);
    const realIngredient = userProduct?.ingredients[itemIndex];
    const ingredientId = realIngredient?.ingredientId || itemIndex + 1;
    
    const success = await toggleIngredient(mealId, ingredientId, newCheckedState);
    
    if (!success) {
      // Revert local state nếu API call thất bại
      setProducts(prev =>
        prev.map(p => {
          if (p.id === productId) {
            const newItems = [...p.items];
            newItems[itemIndex] = { 
              ...newItems[itemIndex], 
              checked: !newCheckedState 
            };
            return { ...p, items: newItems };
          }
          return p;
        })
      );
      
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái nguyên liệu. Vui lòng thử lại.');
    }
  };

  const handleMarkAllChecked = async () => {
    // Check if all items are checked
    const allItemsChecked = products.every(p => 
      p.items.every(item => item.checked)
    );
    
    const newCheckedState = !allItemsChecked;
    
    // Mark all ingredients for all products
    const promises = products.map(product => 
      markAllIngredients(parseInt(product.id), newCheckedState)
    );
    
    const results = await Promise.all(promises);
    const allSuccessful = results.every(result => result);
    
    if (allSuccessful) {
      // Update local state
      setProducts(prev =>
        prev.map(p => ({
          ...p,
          items: p.items.map(item => ({ ...item, checked: newCheckedState }))
        }))
      );
      
      Alert.alert('Thành công', newCheckedState ? 'Đã đánh dấu tất cả nguyên liệu là có' : 'Đã đánh dấu tất cả nguyên liệu là chưa có');
    } else {
      Alert.alert('Lỗi', 'Có lỗi khi cập nhật một số nguyên liệu. Vui lòng thử lại.');
    }
  };

  const handleMarkAllCheckedProduct = async (id: string) => {
    const mealId = parseInt(id);
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    const allChecked = product.items.every(item => item.checked);
    const newCheckedState = !allChecked;
    
    // Call API to mark all ingredients
    const success = await markAllIngredients(mealId, newCheckedState);
    
    if (success) {
      // Update local state
      setProducts(prev =>
        prev.map(p => {
          if (p.id === id) {
            return { ...p, items: p.items.map(item => ({ ...item, checked: newCheckedState })) };
          }
          return p;
        })
      );
      
      Alert.alert('Thành công', newCheckedState ? 'Đã đánh dấu tất cả nguyên liệu là có' : 'Đã đánh dấu tất cả nguyên liệu là chưa có');
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái nguyên liệu. Vui lòng thử lại.');
    }
  };

  const handleRemoveProduct = async (id: string) => {
    const mealId = parseInt(id);
    const success = await removeMealFromProducts(mealId);
    
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setSelectedProduct(null);
    } else {
      Alert.alert('Lỗi', 'Không thể xóa món ăn khỏi danh sách sản phẩm. Vui lòng thử lại.');
    }
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

  // Show loading state
  if (loading || isLoadingIngredients) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: -SPACING.lg }}>
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
