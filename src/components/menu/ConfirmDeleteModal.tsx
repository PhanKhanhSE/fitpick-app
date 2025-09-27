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

interface ConfirmDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Bạn có chắc chắn muốn xóa món?',
  message,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={[styles.modalContent, { marginBottom: insets.bottom + SPACING.xl }]}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>Xóa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
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
    borderRadius: 12,
    width : 327,
    height: 198,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: SPACING.sm,
  },
  button: {
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ConfirmDeleteModal;