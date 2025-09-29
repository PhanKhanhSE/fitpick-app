import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../../utils/theme';

interface TipSectionProps {
  tipText: string;
}

const TipSection: React.FC<TipSectionProps> = ({
  tipText,
}) => {
  return (
    <View style={styles.tipContainer}>
      <Ionicons name="bulb-outline" style={styles.icon} size={24} color={COLORS.primary} />
      <Text style={styles.tipText}>{tipText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    margin: SPACING.md,
    marginTop: -SPACING.umd,
    padding: SPACING.umd,
    borderRadius: RADII.sm,
  },
  icon: {
    paddingTop: SPACING.md,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 18,
    marginLeft: SPACING.md,
  },
});

export default TipSection;