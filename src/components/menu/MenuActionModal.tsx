import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';

interface MenuActionModalProps {
  visible: boolean;
  onClose: () => void;
  onShowDailyView: () => void;
  onShowWeeklyView: () => void;
}

const MenuActionModal: React.FC<MenuActionModalProps> = ({
  visible,
  onClose,
  onShowDailyView,
  onShowWeeklyView,
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
          <TouchableOpacity
            style={styles.modalItem}
            onPress={onShowDailyView}
          >
            <Text style={styles.modalItemText}>Hiển thị thực đơn theo ngày</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalItem, styles.lastModalItem]}
            onPress={onShowWeeklyView}
          >
            <Text style={styles.modalItemText}>Hiển thị thực đơn theo tuần</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
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
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastModalItem: {
    borderBottomWidth: 0,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '400',
    flex: 1,
  },
  proBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADII.sm,
    marginLeft: SPACING.sm,
  },
  proText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default MenuActionModal;