import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

export interface IngredientItemData {
  name: string;
  weight: string;
  checked: boolean;
}

interface IngredientItemProps {
  item: IngredientItemData;
  onToggle: () => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ item, onToggle }) => {
  return (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemWeight}>{item.weight}</Text>
      </View>
      <TouchableOpacity onPress={onToggle}>
        <View style={[styles.checkbox, item.checked && styles.checkboxSelected]}>
          {item.checked && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.under_process,
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: '400',
    color: COLORS.text 
  },
  itemWeight: { 
    fontSize: 12, 
    fontWeight: '300',
    color: COLORS.text 
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default IngredientItem;