import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MealCardVertical from './MealCardVertical';
import MealCardOverlay from './MealCardOverlay';
import { SPACING } from '../utils/theme';

const testImage = { uri: 'https://via.placeholder.com/300x200' };

const MealCardDemo: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <MealCardVertical
          title="Cá hồi sốt tiêu kèm bơ xanh"
          calories="0 kcal"
          time="0 phút"
          image={testImage}
          tag="Bữa sáng"
          width={158}
          height={175}
        />
        
        <MealCardOverlay
          title="Cá hồi sốt tiêu kèm bơ xanh"
          calories="0 kcal"
          time="0 phút"
          image={testImage}
          tag="Cân bằng"
          width={180}
          height={220}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: SPACING.md,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
});

export default MealCardDemo;