import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../utils/theme';

const { width } = Dimensions.get('window');

interface MealCardProps {
  id?: string;
  title: string;
  calories: string;
  time: string;
  image: ImageSourcePropType;
  tag?: string;
  isLocked?: boolean;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
  width?: number; // Cho phép custom width
}

const MealCard: React.FC<MealCardProps> = ({
  id,
  title,
  calories,
  time,
  image,
  tag,
  isLocked = false,
  isFavorite = false,
  onPress,
  onFavoritePress,
  width: customWidth,
}) => {
  const cardWidth = customWidth || (width - SPACING.md * 3.5) / 2;

  return (
    <TouchableOpacity 
      style={[styles.container, { width: cardWidth }]} 
      onPress={onPress}
      disabled={isLocked}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        
        {/* Tag */}
        {tag && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={onFavoritePress}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={COLORS.primary} 
          />
        </TouchableOpacity>
        
        {/* Lock Icon */}
        {isLocked && (
          <View style={styles.lockContainer}>
            <Ionicons name="lock-closed" size={35} color={COLORS.primary} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.info}>
          {calories} • {time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: RADII.sm,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
    gap: -SPACING.xs,
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 105,
    backgroundColor: COLORS.border,
  },
  tag: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: SPACING.xs,
  },
  lockContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  info: {
    fontSize: 12,
    color: COLORS.muted,
  },
});

export default MealCard;