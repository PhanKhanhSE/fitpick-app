import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { COLORS, RADII, SPACING } from '../../utils/theme';
import AppButton from '../AppButton';

interface MealDetailActionsProps {
  onAddToPlan: () => void;
  onAddToProductList?: () => void;
  onMarkAsEaten?: () => void; // Thêm callback để đánh dấu đã ăn
  onUnmarkAsEaten?: () => void; // Thêm callback để bỏ đánh dấu đã ăn
  isInProductList?: boolean;
  isInMealPlan?: boolean; // Thêm prop để kiểm tra đã có trong meal plan chưa
  isEaten?: boolean; // Thêm prop để kiểm tra đã ăn chưa
}

const MealDetailActions: React.FC<MealDetailActionsProps> = ({
  onAddToPlan,
  onAddToProductList,
  onMarkAsEaten,
  onUnmarkAsEaten,
  isInProductList = false,
  isInMealPlan = false,
  isEaten = false,
}) => {
  return (
    <View style={styles.bottomButtons}>
      {/* Button "Đánh dấu đã ăn" - hiện khi chưa ăn */}
      {onMarkAsEaten && !isEaten && (
        <AppButton
          title="Đánh dấu đã ăn"
          onPress={onMarkAsEaten}
          filled={true}
          style={styles.eatenButton}
          textStyle={styles.buttonText}
        />
      )}
      
      {/* Button "Đã ăn" - hiện khi đã ăn với nút xóa */}
      {isEaten && onUnmarkAsEaten && (
        <AppButton
          title="✓ Đã ăn - Nhấn để xóa"
          onPress={onUnmarkAsEaten}
          filled={false}
          style={styles.eatenButtonRemove}
          textStyle={styles.buttonTextRemove}
        />
      )}
      
      {/* Button "Đã ăn" - hiện khi đã ăn nhưng không có callback xóa */}
      {isEaten && !onUnmarkAsEaten && (
        <AppButton
          title="✓ Đã ăn"
          onPress={() => {}} // Disabled
          filled={false}
          style={styles.eatenButtonDisabled}
          textStyle={styles.buttonTextDisabled}
        />
      )}
      
      {/* Chỉ hiện button "Thêm vào Kế hoạch ăn uống" khi chưa có trong meal plan */}
      {!isInMealPlan && (
        <AppButton
          title="Thêm vào Kế hoạch ăn uống"
          onPress={onAddToPlan}
          filled={true}
          style={styles.primaryButton}
          textStyle={styles.buttonText}
        />
      )}
      {onAddToProductList && !isInProductList && (
        <AppButton
          title="Thêm vào danh sách sản phẩm"
          onPress={onAddToProductList}
          filled={false}
          style={styles.secondaryButton}
          textStyle={styles.buttonText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomButtons: { 
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background, 
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  eatenButton: { 
    marginBottom: SPACING.umd,
    borderRadius: RADII.umd,
    backgroundColor: COLORS.success || '#4CAF50', // Màu xanh lá cho "đã ăn"
  },
  eatenButtonDisabled: { 
    marginBottom: SPACING.umd,
    borderRadius: RADII.umd,
    borderColor: COLORS.success || '#4CAF50',
    backgroundColor: 'transparent',
  },
  eatenButtonRemove: { 
    marginBottom: SPACING.umd,
    borderRadius: RADII.umd,
    borderColor: COLORS.error || '#F44336',
    backgroundColor: 'transparent',
  },
  primaryButton: { 
    marginBottom: SPACING.umd,
    borderRadius: RADII.umd,
  },
  secondaryButton: { 
    borderColor: COLORS.primary,
    borderRadius: RADII.umd,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
  },
  buttonTextDisabled: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.success || '#4CAF50',
  },
  buttonTextRemove: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.error || '#F44336',
  },
});

export default MealDetailActions;