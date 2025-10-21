import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADII } from '../utils/theme';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'small',
  color = 'white',
  backgroundColor = COLORS.primary
}) => {
  if (count <= 0) return null;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          minWidth: 18,
          height: 18,
          fontSize: 10,
          paddingHorizontal: 6,
        };
      case 'medium':
        return {
          minWidth: 22,
          height: 22,
          fontSize: 12,
          paddingHorizontal: 8,
        };
      case 'large':
        return {
          minWidth: 26,
          height: 26,
          fontSize: 14,
          paddingHorizontal: 10,
        };
      default:
        return {
          minWidth: 18,
          height: 18,
          fontSize: 10,
          paddingHorizontal: 6,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor,
        minWidth: sizeStyles.minWidth,
        height: sizeStyles.height,
        paddingHorizontal: sizeStyles.paddingHorizontal,
      }
    ]}>
      <Text style={[
        styles.badgeText,
        {
          color,
          fontSize: sizeStyles.fontSize,
        }
      ]}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: RADII.full,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default NotificationBadge;
