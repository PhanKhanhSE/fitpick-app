import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { COLORS, RADII, SPACING } from '../../utils/theme';
import AppButton from '../AppButton';

interface MealDetailActionsProps {
  onAddToPlan: () => void;
  onAddToFavorites: () => void;
}

const MealDetailActions: React.FC<MealDetailActionsProps> = ({
  onAddToPlan,
  onAddToFavorites,
}) => {
  return (
    <View style={styles.bottomButtons}>
      <AppButton
        title="Thêm vào Kế hoạch ăn uống"
        onPress={onAddToPlan}
        filled={true}
        style={styles.primaryButton}
        textStyle={styles.buttonText}
      />
      <AppButton
        title="Thêm vào danh sách sản phẩm"
        onPress={onAddToFavorites}
        filled={false}
        style={styles.secondaryButton}
        textStyle={styles.buttonText}
      />
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
});

export default MealDetailActions;