import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { ProductData } from './ProductCard';

interface ProductActionModalProps {
  visible: boolean;
  selectedProduct: ProductData | null;
  allItemsChecked: boolean;
  onClose: () => void;
  onViewRecipe: (product: ProductData) => void;
  onMarkAllChecked: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
}

const ProductActionModal: React.FC<ProductActionModalProps> = ({
  visible,
  selectedProduct,
  allItemsChecked,
  onClose,
  onViewRecipe,
  onMarkAllChecked,
  onRemoveProduct,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={[styles.modalOverlay, { paddingTop: insets.top }]}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + SPACING.md }]}>
          {/* Xem công thức */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (selectedProduct) {
                onViewRecipe(selectedProduct);
              }
              onClose();
            }}
          >
            <Text style={styles.menuText}>Xem công thức</Text>
          </TouchableOpacity>

          {/* Đánh dấu tất cả / Bỏ tất cả */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (selectedProduct) {
                onMarkAllChecked(selectedProduct.id);
              }
              onClose();
            }}
          >
            <Text style={styles.menuText}>{allItemsChecked ? 'Bỏ tất cả' : 'Đánh dấu tất cả'}</Text>
          </TouchableOpacity>

          {/* Xoá sản phẩm */}
          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={() => {
              if (selectedProduct) {
                onRemoveProduct(selectedProduct.id);
              }
            }}
          >
            <Text style={styles.menuTextDelete}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: -SPACING.lg,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: SPACING.md,
    borderTopLeftRadius: RADII.md,
    borderTopRightRadius: RADII.md,
  },
  menuItem: { 
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: { 
    fontSize: 16, 
    color: COLORS.text, 
    fontWeight: '400'
  },
  menuTextDelete: { 
    fontSize: 16, 
    color: 'red', 
    fontWeight: '600'
  },
});

export default ProductActionModal;