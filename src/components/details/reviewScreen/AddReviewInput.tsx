import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../../utils/theme';

interface AddReviewInputProps {
  onPress: () => void;
}

const AddReviewInput: React.FC<AddReviewInputProps> = ({ onPress }) => {
  return (
    <View style={styles.bottomInputContainer}>
      <TouchableOpacity style={styles.inputField} onPress={onPress}>
        <Text style={styles.inputPlaceholder}>Thêm nhận xét</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sendIconContainer}>
        <Ionicons name="send" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputField: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  inputPlaceholder: {
    color: COLORS.muted,
    fontSize: 16,
  },
  sendIconContainer: {
    padding: SPACING.xs,
  },
});

export default AddReviewInput;