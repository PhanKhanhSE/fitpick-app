import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../utils/theme';

interface ProUserBadgeProps {
  isProUser: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const ProUserBadge: React.FC<ProUserBadgeProps> = ({ 
  isProUser, 
  size = 'medium',
  showText = true 
}) => {
  if (!isProUser) return null;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          text: styles.textSmall,
          icon: styles.iconSmall
        };
      case 'large':
        return {
          container: styles.containerLarge,
          text: styles.textLarge,
          icon: styles.iconLarge
        };
      default:
        return {
          container: styles.containerMedium,
          text: styles.textMedium,
          icon: styles.iconMedium
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, sizeStyles.container]}>
      <Text style={[styles.icon, sizeStyles.icon]}>👑</Text>
      {showText && (
        <Text style={[styles.text, sizeStyles.text]}>PRO</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  containerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  containerMedium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  iconSmall: {
    fontSize: 10,
    marginRight: 2,
  },
  iconMedium: {
    fontSize: 12,
    marginRight: 4,
  },
  iconLarge: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    color: 'white',
    fontFamily: FONTS.bold,
    fontSize: 10,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 8,
  },
  textMedium: {
    fontSize: 10,
  },
  textLarge: {
    fontSize: 12,
  },
});

export default ProUserBadge;
