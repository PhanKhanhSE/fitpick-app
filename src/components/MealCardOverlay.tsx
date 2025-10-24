import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../utils/theme';
import { useUser } from '../hooks/useUser';

interface MealCardOverlayProps {
  id?: string;
  title: string;
  calories: string;
  time: string;
  image: ImageSourcePropType;
  tag?: string;
  isLocked?: boolean;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
  width?: number;
  height?: number;
  layout?: 'vertical' | 'horizontal'; // Layout orientation
}

const MealCardOverlay: React.FC<MealCardOverlayProps> = ({
  id,
  title,
  calories,
  time,
  image,
  tag,
  isLocked = false,
  isFavorite = false,
  showFavoriteButton = true,
  onPress,
  onFavoritePress,
  width = 180,
  height = 220,
  layout = 'vertical',
}) => {
  const { isProUser } = useUser();
  // Set default dimensions based on layout
  const defaultWidth = layout === 'horizontal' ? 240 : 180;
  const defaultHeight = layout === 'horizontal' ? 160 : 220;
  const cardWidth = width || defaultWidth;
  const cardHeight = height || defaultHeight;
  const showLock = (isLocked ?? false) && !(isProUser && isProUser());
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { width: cardWidth, height: cardHeight },
        layout === 'horizontal' && styles.horizontalContainer
      ]} 
      onPress={onPress}
    >
      {/* Background Image */}
      <Image source={image} style={styles.backgroundImage} />
      
      {/* Overlay Gradient */}
      <View style={styles.overlay} />
      
      {/* Tag */}
      {tag && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      )}
      
      {/* Favorite Button */}
      {showFavoriteButton && (
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={onFavoritePress}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={isFavorite ? COLORS.primary : COLORS.primary} 
          />
        </TouchableOpacity>
      )}
      
      {/* Text Content - Positioned based on layout */}
      <View style={[
        styles.textContent,
        layout === 'horizontal' && styles.textContentHorizontal
      ]}>
        <Text style={[
          styles.title,
          layout === 'horizontal' && styles.titleHorizontal
        ]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[
          styles.info,
          layout === 'horizontal' && styles.infoHorizontal
        ]}>
          {calories} • {time}
        </Text>
      </View>
      
      {/* Lock Icon (hidden for PRO users) */}
      {showLock && (
        <View style={styles.lockContainer}>
          <Ionicons name="lock-closed" size={35} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADII.umd,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
    position: 'relative',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tag: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: RADII.umd,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: SPACING.xs,
  },
  textContent: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    left: SPACING.md,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: SPACING.xs,
    marginLeft: -SPACING.sm,
    textAlign: 'left',
    ...(Platform.OS === 'web' ? {
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    } : {
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    }),
  },
  info: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    marginLeft: -SPACING.sm,
    ...(Platform.OS === 'web' ? {
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    } : {
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    }),
  },
  lockContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  // Horizontal layout styles
  horizontalContainer: {
    flexDirection: 'row',
  },
  textContentHorizontal: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    alignItems: 'flex-start',
  },
  titleHorizontal: {
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 0,
  },
  infoHorizontal: {
    textAlign: 'left',
    marginLeft: 0,
  },
});

export default MealCardOverlay;