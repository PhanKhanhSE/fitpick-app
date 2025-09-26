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

interface MealCardVerticalProps {
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
  width?: number;
  height?: number;
}

const MealCardVertical: React.FC<MealCardVerticalProps> = ({
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
  width = 158,
  height = 175,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { width, height }]} 
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
            color={isFavorite ? COLORS.primary : COLORS.primary} 
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
    borderRadius: RADII.umd,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
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
    backgroundColor: 'white',
    borderRadius: 16,
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
    flex: 1,
    paddingRight: SPACING.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: -SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  info: {
    fontSize: 12,
    color: COLORS.muted,
    marginLeft: -SPACING.sm,
  },
});

export default MealCardVertical;