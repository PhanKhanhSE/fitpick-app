import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

interface DateNavigationProps {
  dateText: string;
  onPreviousDate: () => void;
  onNextDate: () => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  dateText,
  onPreviousDate,
  onNextDate,
}) => {
  return (
    <View style={styles.dateContainer}>
      <TouchableOpacity style={styles.dateNavButton} onPress={onPreviousDate}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <Text style={styles.dateText}>{dateText}</Text>
      <TouchableOpacity style={styles.dateNavButton} onPress={onNextDate}>
        <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  dateNavButton: {
    padding: SPACING.xs,
    marginHorizontal: SPACING.sm,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
});

export default DateNavigation;