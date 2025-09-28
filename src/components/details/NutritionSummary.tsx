import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';

interface NutritionItem {
  label: string;
  value: string;
}

interface NutritionSummaryProps {
  calories?: string;
  carbs?: string;
  protein?: string;
  fat?: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  calories = '000 kcal',
  carbs = '000 g',
  protein = '000 g',
  fat = '000 g',
}) => {
  const nutritionData: NutritionItem[] = [
    { label: 'Calories', value: calories },
    { label: 'Tinh bột', value: carbs },
    { label: 'Protein', value: protein },
    { label: 'Chất béo', value: fat },
  ];

  return (
    <View style={styles.nutritionContainer}>
      {nutritionData.map((item, index) => (
        <View
          key={index}
          style={[
            styles.nutritionItem,
            index < 3 && { borderRightWidth: 1, borderRightColor: '#E0E0E0' },
          ]}
        >
          <Text style={styles.nutritionLabel}>{item.label}</Text>
          <Text style={styles.nutritionValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  nutritionContainer: { 
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    backgroundColor: '#fff',
  },
  nutritionItem: { 
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionLabel: { 
    fontSize: 14,
    color: '#999', 
    marginBottom: 4,
  },
  nutritionValue: { 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default NutritionSummary;