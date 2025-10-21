import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import CircularProgress from './CircularProgress';

interface NutritionStatsProps {
  targetCalories: number;
  consumedCalories: number;
  starch: { current: number; target: number };
  protein: { current: number; target: number };
  fat: { current: number; target: number };
  onPress?: () => void;
}

const NutritionStats: React.FC<NutritionStatsProps> = ({
  targetCalories,
  consumedCalories,
  starch,
  protein,
  fat,
  onPress,
}) => {
  const progress = Math.min(consumedCalories / targetCalories, 1);
  const circumference = 2 * Math.PI * 60; // radius = 60
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.statsCard}>
        <View style={styles.caloriesSection}>
          <Text style={styles.targetLabel}>Mục tiêu:</Text>
          <Text style={styles.targetValue}>{targetCalories} kcal</Text>
          
          <Text style={styles.consumedLabel}>Còn lại:</Text>
          <Text style={styles.consumedValue}>{targetCalories - consumedCalories} kcal</Text>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressCircle}>
            <CircularProgress
              size={120}
              strokeWidth={8}
              progress={progress}
              color="#4CAF50"
              backgroundColor="#E0E0E0"
            />
            <View style={styles.caloriesDisplay}>
              <Text style={styles.caloriesText}>{consumedCalories}</Text>
              <Text style={styles.caloriesUnit}>kcal</Text>
              <Text style={styles.statusText}>Đúng mục tiêu</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.macroSection}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Tinh bột</Text>
          <View style={[styles.macroBar, { backgroundColor: COLORS.under_process }]}>
            <View style={[styles.macroProgress, { width: `${(starch.current / starch.target) * 100}%`, backgroundColor: COLORS.process }]} />
          </View>
          <Text style={styles.macroValue}>{starch.current} / {starch.target} g</Text>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein</Text>
          <View style={[styles.macroBar, { backgroundColor: COLORS.under_process }]}>
            <View style={[styles.macroProgress, { width: `${(protein.current / protein.target) * 100}%`, backgroundColor: COLORS.primary }]} />
          </View>
          <Text style={styles.macroValue}>{protein.current} / {protein.target} g</Text>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Chất béo</Text>
          <View style={[styles.macroBar, { backgroundColor: COLORS.under_process }]}>
            <View style={[styles.macroProgress, { width: `${(fat.current / fat.target) * 100}%`, backgroundColor: COLORS.process }]} />
          </View>
          <Text style={styles.macroValue}>{fat.current} / {fat.target} g</Text>
        </View>
        
      </View>
      
      <Text style={styles.seeMore}>xem thêm</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    marginTop: SPACING.lg, // Tăng margin top để tránh sát header
    borderColor: COLORS.under_process,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
    elevation: 2,
  },
  statsCard: {
    marginTop: -SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesSection: {
    flex: 1,
  },
  targetLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  targetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  consumedLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  consumedValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progressSection: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesDisplay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  caloriesUnit: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  macroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -SPACING.md,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  macroBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  macroProgress: {
    height: '100%',
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  seeMore: {
    fontSize: 12,
    color: COLORS.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default NutritionStats;

