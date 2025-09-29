import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADII } from '../../../utils/theme';

interface NutritionBarItem {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface NutritionBarsProps {
  nutritionBars: NutritionBarItem[];
}

const NutritionBars: React.FC<NutritionBarsProps> = ({
  nutritionBars,
}) => {
  return (
    <View style={styles.nutritionBarsContainer}>
      {nutritionBars.map((item, index) => (
        <View key={index} style={styles.nutritionBarItem}>
          <View style={styles.nutritionBarHeader}>
            <Text style={styles.nutritionBarLabel}>{item.label}</Text>
            <Text style={styles.nutritionBarValue}>
              {item.current} / {item.target} {item.unit}
            </Text>
          </View>
          <View style={styles.nutritionBarTrack}>
            <View 
              style={[
                styles.nutritionBarProgress, 
                { 
                  backgroundColor: item.color,
                  width: item.target > 0 ? `${Math.min((item.current / item.target) * 100, 100)}%` : '0%'
                }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  nutritionBarsContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  nutritionBarItem: {
    marginBottom: SPACING.lg,
  },
  nutritionBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  nutritionBarLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  nutritionBarValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  nutritionBarTrack: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  nutritionBarProgress: {
    height: '100%',
    borderRadius: 4,
  },
});

export default NutritionBars;