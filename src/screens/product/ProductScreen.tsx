import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { COLORS } from '../../utils/theme'; // Nếu bạn dùng theme chung

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24 };

// Sample data
const sampleProducts = [
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
];

const ProductScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [products, setProducts] = useState(sampleProducts);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const incrementQuantity = (id: string) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));
  };

  const decrementQuantity = (id: string) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p)));
  };

  const toggleItemChecked = (productId: string, index: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newItems = [...p.items];
          newItems[index] = { ...newItems[index], checked: !newItems[index].checked };
          return { ...p, items: newItems };
        }
        return p;
      })
    );
  };

  const markAllChecked = () => {
    setProducts(prev =>
      prev.map(p => ({ ...p, items: p.items.map(item => ({ ...item, checked: true })) }))
    );
  };

  const markAllCheckedProduct = (id: string) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, items: p.items.map(item => ({ ...item, checked: true })) } : p)
    );
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedProductId(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sản phẩm</Text>
            <TouchableOpacity onPress={markAllChecked}>
              <Text style={styles.markAllText}>Đánh dấu tất cả</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Đánh dấu các nguyên liệu bạn đã có.</Text>
        </View>

        {/* Danh sách sản phẩm */}
        {products.map(product => (
          <View key={product.id} style={styles.productContainer}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.name}</Text>
              <TouchableOpacity onPress={() => setSelectedProductId(product.id)}>
                <Entypo name="dots-three-vertical" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {/* Số lượng */}
            <View style={styles.bottomHeader}>
              <View style={styles.quantityControl}>
                <TouchableOpacity onPress={() => decrementQuantity(product.id)} style={styles.qtyButton}>
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{product.quantity}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(product.id)} style={styles.qtyButton}>
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Danh sách nguyên liệu */}
            {product.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemWeight}>{item.weight}</Text>
                </View>
                <Ionicons
                  name={item.checked ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  onPress={() => toggleItemChecked(product.id, index)}
                  color={COLORS.primary}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Modal menu bottom */}
      <Modal
        visible={!!selectedProductId}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProductId(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setSelectedProductId(null)}
        >
          <View style={styles.modalContent}>
            {/* Xem công thức */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedProductId) {
                  const product = products.find(p => p.id === selectedProductId);
                  if (product && navigation) {
                    navigation.navigate('MealDetail', {
                      meal: {
                        id: product.id,
                        title: product.name,
                        price: '0',
                        image: null, // thêm ảnh nếu có
                        ingredients: product.items.map(item => ({
                          name: item.name,
                          amount: item.weight,
                        })),
                      },
                    });
                  }
                }
                setSelectedProductId(null);
              }}
            >
              <Text style={styles.menuText}>Xem công thức</Text>
            </TouchableOpacity>

            {/* Đánh dấu tất cả */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedProductId) markAllCheckedProduct(selectedProductId);
                setSelectedProductId(null);
              }}
            >
              <Text style={styles.menuText}>Đánh dấu tất cả</Text>
            </TouchableOpacity>

            {/* Xoá sản phẩm */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedProductId) removeProduct(selectedProductId);
              }}
            >
              <Text style={styles.menuTextDelete}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  backButton: { marginRight: SPACING.sm },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  markAllText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  headerSubtitle: { fontSize: 14, color: COLORS.muted, marginTop: SPACING.xs },

  // Product container (full width)
  productContainer: {
    marginHorizontal: 0,
    marginBottom: SPACING.lg,
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: 0,
  },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  productName: { fontSize: 16, fontWeight: '600', color: COLORS.text },

  // Số lượng
  bottomHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { fontSize: 16, color: COLORS.primary },
  quantityText: { marginHorizontal: 8, fontSize: 16, fontWeight: '600', color: COLORS.text },

  // Item row
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: { fontSize: 14, color: COLORS.text },
  itemWeight: { fontSize: 12, color: COLORS.muted },

  // Modal menu
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm, // cách viền modal
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuItem: { 
    paddingVertical: SPACING.sm * 1.5,
    paddingHorizontal: SPACING.sm,
    alignItems: 'flex-start',
  },
  menuText: { fontSize: 16, color: COLORS.text, letterSpacing: 0 },
  menuTextDelete: { fontSize: 16, color: 'red', fontWeight: '600', letterSpacing: 0 },
});

export default ProductScreen;
