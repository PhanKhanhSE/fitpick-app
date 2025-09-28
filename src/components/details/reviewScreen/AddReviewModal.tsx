import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../../utils/theme';

interface AddReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string) => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn số sao đánh giá');
      return;
    }

    if (reviewText.trim().length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung nhận xét');
      return;
    }

    onSubmit(rating, reviewText);
    setRating(0);
    setReviewText('');
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[0, 1, 2, 3, 4].map((index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleStarPress(index)}
            style={styles.starButton}
          >
            <Ionicons
              name="star"
              size={36}
              color={index < rating ? COLORS.primary : COLORS.muted}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Thêm nhận xét</Text>
            <View style={styles.modalPlaceholder} />
          </View>

          {/* Star Rating */}
          {renderStars()}

          {/* Review Input */}
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Nhập nhận xét của bạn..."
              placeholderTextColor={COLORS.muted}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.modalSubmitButton,
              { backgroundColor: rating > 0 && reviewText.trim() ? COLORS.primary : COLORS.muted }
            ]}
            onPress={handleSubmit}
            disabled={rating === 0 || reviewText.trim().length === 0}
          >
            <Text style={styles.modalSubmitButtonText}>Gửi nhận xét</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalCloseButton: {
    padding: SPACING.xs,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginRight: 40,
  },
  modalPlaceholder: {
    width: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  starButton: {
    marginHorizontal: SPACING.xs,
  },
  modalInputContainer: {
    marginBottom: SPACING.xl,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 120,
    backgroundColor: '#FFFFFF',
  },
  modalSubmitButton: {
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddReviewModal;