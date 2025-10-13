import React from 'react';
import {
  View,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import AppButton from '../AppButton';

interface AppliedFilters {
  nutritionGoal: boolean;
  mealType: string[];
  ingredients: string[];
  dietType: string[];
  cookingTime: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  appliedFilters: AppliedFilters;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  toggleMealType: (type: string) => void;
  toggleIngredient: (ingredient: string) => void;
  toggleDietType: (diet: string) => void;
  toggleCookingTime: (time: string) => void;
  setAppliedFilters: React.Dispatch<React.SetStateAction<AppliedFilters>>;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  appliedFilters,
  onApplyFilters,
  onClearFilters,
  toggleMealType,
  toggleIngredient,
  toggleDietType,
  toggleCookingTime,
  setAppliedFilters,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.filterModal}>
        {/* Filter Header */}
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Bộ lọc</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textStrong} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Áp dụng Dinh dưỡng cá nhân */}
          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <Text style={styles.filterSectionTitle}>Áp dụng Dinh dưỡng cá nhân</Text>
              <Text style={styles.editText}>Sửa</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, appliedFilters.nutritionGoal && styles.toggleButtonActive]}
              onPress={() => setAppliedFilters(prev => ({ ...prev, nutritionGoal: !prev.nutritionGoal }))}
            >
              <View style={[styles.toggleSwitch, appliedFilters.nutritionGoal && styles.toggleSwitchActive]} />
            </TouchableOpacity>
          </View>

          {/* Bữa ăn */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Bữa ăn</Text>
            <View style={styles.filterTags}>
              {['Bữa sáng', 'Bữa trưa', 'Bữa tối'].map((meal) => (
                <TouchableOpacity
                  key={meal}
                  style={[styles.filterTag, appliedFilters.mealType.includes(meal) && styles.filterTagActive]}
                  onPress={() => toggleMealType(meal)}
                >
                  <Text style={[styles.filterTagText, appliedFilters.mealType.includes(meal) && styles.filterTagTextActive]}>
                    {meal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nguyên liệu */}
          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <Text style={styles.filterSectionTitle}>Nguyên liệu</Text>
              <Text style={styles.seeMoreText}>xem thêm</Text>
            </View>
            <View style={styles.filterTags}>
              {['Sữa', 'Trứng', 'Bánh mì', 'Khoai tây', 'Hành tây', 'Cà rốt', 'Bò', 'Gà', 'Gạo', 'Nấm', 'Phô mai', 'Cà chua', 'Ức gà', 'Chuối', 'Sữa chua', 'Súp lơ', 'Bơ'].map((ingredient) => (
                <TouchableOpacity
                  key={ingredient}
                  style={[styles.filterTag, appliedFilters.ingredients.includes(ingredient) && styles.filterTagActive]}
                  onPress={() => toggleIngredient(ingredient)}
                >
                  <Text style={[styles.filterTagText, appliedFilters.ingredients.includes(ingredient) && styles.filterTagTextActive]}>
                    {ingredient}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chế độ ăn */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Chế độ ăn</Text>
            <View style={styles.filterTags}>
              {['Cân bằng', 'Ít tinh bột', 'Keto', 'Không gluten', 'Không sữa', 'Ăn chay', 'Thuần chay', 'Eat clean', 'Địa Trung Hải', 'Paleo'].map((diet) => (
                <TouchableOpacity
                  key={diet}
                  style={[styles.filterTag, appliedFilters.dietType.includes(diet) && styles.filterTagActive]}
                  onPress={() => toggleDietType(diet)}
                >
                  <Text style={[styles.filterTagText, appliedFilters.dietType.includes(diet) && styles.filterTagTextActive]}>
                    {diet}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Thời gian chế biến */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Thời gian chế biến</Text>
            <View style={styles.filterTags}>
              {['≤ 15 phút', '≤ 30 phút', '≤ 60 phút'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.filterTag, appliedFilters.cookingTime.includes(time) && styles.filterTagActive]}
                  onPress={() => toggleCookingTime(time)}
                >
                  <Text style={[styles.filterTagText, appliedFilters.cookingTime.includes(time) && styles.filterTagTextActive]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Filter Footer */}
        <View style={styles.filterFooter}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={onClearFilters}
          >
            <Text style={styles.clearButtonText}>Xóa</Text>
          </TouchableOpacity>
          <AppButton
            title="Áp dụng"
            onPress={onApplyFilters}
            filled
            style={styles.applyButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Filter Modal Styles
  filterModal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textStrong,
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  filterSection: {
    marginTop: SPACING.lg,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textStrong,
  },
  editText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  seeMoreText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleSwitch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleSwitchActive: {
    alignSelf: 'flex-end',
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  filterTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#F3F4F6',
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTagActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTagText: {
    fontSize: 14,
    color: COLORS.text,
  },
  filterTagTextActive: {
    color: '#FFFFFF',
  },
  filterFooter: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: SPACING.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  applyButton: {
    flex: 1,
  },
});

export default FilterModal;