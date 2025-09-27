import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

interface MealItemProps {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: ImageSourcePropType;
  isSelected?: boolean;
  onPress?: () => void;
  onToggleSelect?: () => void;
  onOptionsPress?: () => void;
}

const MealItem: React.FC<MealItemProps> = ({
  id,
  title,
  calories,
  time,
  image,
  isSelected = false,
  onPress,
  onToggleSelect,
  onOptionsPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={onToggleSelect}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>

      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.info}>
          {calories} • {time}
        </Text>
      </View>

      <TouchableOpacity style={styles.optionsButton} onPress={onOptionsPress}>
        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    backgroundColor: COLORS.background,
    marginBottom: 1,
  },
  checkboxContainer: {
    marginRight: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  image: {
    width: 101,
    height: 101,
    borderRadius: 8,
    marginRight: SPACING.md,
    backgroundColor: COLORS.border,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    color: COLORS.muted,
  },
  optionsButton: {
    paddingLeft: SPACING.sm,
  },
});

export default MealItem;