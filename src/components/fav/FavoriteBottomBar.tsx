import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, RADII } from '../../utils/theme';

interface FavoriteBottomBarProps {
  visible: boolean;
  selectedCount: number;
  onAddToProductList: () => void;
  onDelete: () => void;
}

const FavoriteBottomBar: React.FC<FavoriteBottomBarProps> = ({
  visible,
  selectedCount,
  onAddToProductList,
  onDelete,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.bottomBar}>
      <Text style={styles.selectedText}>
        Đã chọn {selectedCount} món
      </Text>
      
      <TouchableOpacity 
        style={styles.bottomButton}
        onPress={onAddToProductList}
      >
        <Text style={styles.bottomButtonText}>
          Thêm vào danh sách sản phẩm
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.lastBottomButton, styles.deleteButton]}
        onPress={onDelete}
      >
        <Text style={[styles.bottomButtonText, styles.deleteButtonText]}>
          Xóa
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  bottomButton: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    marginBottom: SPACING.sm,
  },
  lastBottomButton: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    marginBottom: 0,
  },
  bottomButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  deleteButtonText: {
    color: COLORS.primary,
  },
});

export default FavoriteBottomBar;