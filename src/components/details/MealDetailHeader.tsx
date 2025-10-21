import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

interface MealDetailHeaderProps {
  onGoBack: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

const MealDetailHeader: React.FC<MealDetailHeaderProps> = ({
  onGoBack,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={onGoBack}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={onToggleFavorite}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? COLORS.primary : COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: StatusBar.currentHeight || 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    zIndex: 1000,
  },
  headerButton: { 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    borderRadius: 20, 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default MealDetailHeader;