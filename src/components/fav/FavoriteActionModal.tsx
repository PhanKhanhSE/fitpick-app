import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { FoodItem } from './FavoriteCard';

interface FavoriteActionModalProps {
  visible: boolean;
  item: FoodItem | null;
  onClose: () => void;
  onAddToMealPlan: () => void;
  onAddToProductList: () => void;
  onDelete: () => void;
}

const FavoriteActionModal: React.FC<FavoriteActionModalProps> = ({
  visible,
  item,
  onClose,
  onAddToMealPlan,
  onAddToProductList,
  onDelete,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.modalItem}
          onPress={onAddToMealPlan}
        >
          <Text style={styles.modalItemText}>Thêm vào thực đơn của tôi</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.modalItem}
          onPress={onAddToProductList}
        >
          <Text style={styles.modalItemText}>Thêm vào danh sách sản phẩm</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.lastModalItem, styles.deleteItem]}
          onPress={onDelete}
        >
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: SPACING.md,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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