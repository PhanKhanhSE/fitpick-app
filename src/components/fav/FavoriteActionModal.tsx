import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { FoodItem } from './FavoriteCard';

interface FavoriteActionModalProps {
  visible: boolean;
  item: FoodItem | null;
  onClose: () => void;
  onAddToMealPlan: () => void;
  onAddToProductList: () => void;
  onDelete: () => void;
  isInMealPlan?: boolean; // Thêm prop để kiểm tra đã có trong meal plan chưa
  isInProductList?: boolean; // Thêm prop để kiểm tra đã có trong product list chưa
}

const FavoriteActionModal: React.FC<FavoriteActionModalProps> = ({
  visible,
  item,
  onClose,
  onAddToMealPlan,
  onAddToProductList,
  onDelete,
  isInMealPlan = false,
  isInProductList = false,
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
          style={styles.modalOverlay}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + SPACING.md }]}>
        {/* Chỉ hiện button "Thêm vào thực đơn của tôi" khi chưa có trong meal plan */}
        {!isInMealPlan && (
          <TouchableOpacity
            style={styles.modalItem}
            onPress={onAddToMealPlan}
          >
            <Text style={styles.modalItemText}>Thêm vào thực đơn của tôi</Text>
          </TouchableOpacity>
        )}
        
        {/* Chỉ hiện button "Thêm vào danh sách sản phẩm" khi chưa có trong product list */}
        {!isInProductList && (
          <TouchableOpacity 
            style={styles.modalItem}
            onPress={onAddToProductList}
          >
            <Text style={styles.modalItemText}>Thêm vào danh sách sản phẩm</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.lastModalItem, styles.deleteItem]}
          onPress={onDelete}
        >
          <Text style={styles.deleteText}>Xóa</Text>
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
  modalItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastModalItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 0,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  deleteItem: {
    backgroundColor: '#fee',
  },
  deleteText: {
    fontSize: 16,
    color: 'red',
  },
});

export default FavoriteActionModal;