import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

interface NavigationHeaderProps {
  onGoBack: () => void;
  onSettings: () => void;
  title?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  onGoBack,
  onSettings,
  title = 'Hồ sơ',
}) => {
  return (
    <View style={styles.navHeader}>
      <TouchableOpacity style={styles.headerButton} onPress={onGoBack}>
        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.headerButton} onPress={onSettings}>
        <Ionicons name="settings-outline" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.umd,
    paddingVertical: SPACING.md,
    marginBottom: -SPACING.sm,
  },
  headerButton: {
    padding: SPACING.xs,
    marginTop: SPACING.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
});

export default NavigationHeader;