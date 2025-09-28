import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

interface MealImageOverlayProps {
  image: any;
  cookingTime?: string;
  rating?: number;
  reviewCount?: number;
}

const MealImageOverlay: React.FC<MealImageOverlayProps> = ({
  image,
  cookingTime = '0 phút',
  rating = 0,
  reviewCount = 0,
}) => {
  return (
    <View style={styles.imageContainer}>
      <Image source={image} style={styles.mealImage} />

      {/* Overlay: Cooking Time & Rating */}
      <View style={styles.overlayInfo}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="white" />
          <Text style={styles.timeText}>{cookingTime}</Text>
        </View> 

        <View style={styles.ratingBox}>
          <Ionicons name="star" size={16} color={COLORS.primary} />
          <Text style={styles.ratingNumber}>{rating}</Text>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.primary} style={{ marginLeft: 8 }} />
          <Text style={styles.ratingNumber}>{reviewCount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: { 
    height: 350
  },
  mealImage: { 
    width: '100%', 
    height: '100%', 
    backgroundColor: COLORS.border 
  },
  overlayInfo: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  timeText: { 
    color: 'white', 
    fontSize: 14, 
    marginLeft: 4 
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingNumber: { 
    color: COLORS.text, 
    fontSize: 14, 
    marginLeft: 4 
  },
});

export default MealImageOverlay;