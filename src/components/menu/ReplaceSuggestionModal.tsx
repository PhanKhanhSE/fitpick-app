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

interface ReplaceSuggestionModalProps {
  visible: boolean;
  onClose: () => void;
  onReplaceByGoal: () => void;
  onReplaceByFavorites: () => void;
}

const ReplaceSuggestionModal: React.FC<ReplaceSuggestionModalProps> = ({
  visible,
  onClose,
  onReplaceByGoal,
  onReplaceByFavorites,
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
          <TouchableOpacity
            style={styles.modalItem}
            onPress={onReplaceByGoal}
          >
            <Text style={styles.modalItemText}>Thay đổi theo gợi ý</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalItem, styles.lastModalItem]}
            onPress={onReplaceByFavorites}
          >
            <Text style={styles.modalItemText}>Thay đổi theo danh sách yêu thích</Text>
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
  },
  lastModalItem: {
    borderBottomWidth: 0,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
});

export default ReplaceSuggestionModal;