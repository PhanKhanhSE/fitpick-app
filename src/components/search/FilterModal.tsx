import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import AppButton from '../AppButton';
import { filterAPI, FilterData } from '../../services/filterAPI';

interface AppliedFilters {
  nutritionGoal: boolean;
  mealType: string[];
  ingredients: string[];
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
  toggleCookingTime,
  setAppliedFilters,
}) => {
  // State for filter data from API
  const [categories, setCategories] = useState<FilterData[]>([]);
  const [ingredients, setIngredients] = useState<FilterData[]>([]);
  const [allIngredients, setAllIngredients] = useState<FilterData[]>([]);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [cookingTimes, setCookingTimes] = useState<FilterData[]>([]);
  const [mealTypes, setMealTypes] = useState<FilterData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load filter data when modal opens
  useEffect(() => {
    if (visible) {
      loadFilterData();
    }
  }, [visible]);

  const toggleShowAllIngredients = () => {
    if (showAllIngredients) {
      // Show only first 10 ingredients
      setIngredients(allIngredients.slice(0, 10));
    } else {
      // Show all ingredients
      setIngredients(allIngredients);
    }
    setShowAllIngredients(!showAllIngredients);
  };

  const loadFilterData = async () => {
    try {
      setIsLoading(true);
      
      const [categoriesRes, ingredientsRes, cookingTimesRes, mealTypesRes] = await Promise.all([
        filterAPI.getCategories(),
        filterAPI.getIngredients(),
        filterAPI.getCookingTimes(),
        filterAPI.getMealTypes()
      ]);

      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
      if (ingredientsRes.success) {
        setAllIngredients(ingredientsRes.data);
        // Show only first 10 ingredients initially
        setIngredients(ingredientsRes.data.slice(0, 10));
      }
      if (cookingTimesRes.success) {
        setCookingTimes(cookingTimesRes.data);
      }
      if (mealTypesRes.success) {
        setMealTypes(mealTypesRes.data);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };
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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
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
              {mealTypes.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={[styles.filterTag, appliedFilters.mealType.includes(meal.name) && styles.filterTagActive]}
                  onPress={() => toggleMealType(meal.name)}
                >
                  <Text style={[styles.filterTagText, appliedFilters.mealType.includes(meal.name) && styles.filterTagTextActive]}>
                    {meal.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nguyên liệu */}
          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <Text style={styles.filterSectionTitle}>Nguyên liệu</Text>
              <TouchableOpacity onPress={toggleShowAllIngredients}>
                <Text style={styles.seeMoreText}>
                  {showAllIngredients ? 'Thu gọn' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterTags}>
              {ingredients.map((ingredient) => (
                <TouchableOpacity
                  key={ingredient.id}
                  style={[styles.filterTag, appliedFilters.ingredients.includes(ingredient.name) && styles.filterTagActive]}
                  onPress={() => toggleIngredient(ingredient.name)}
                >
                  <Text style={[styles.filterTagText, appliedFilters.ingredients.includes(ingredient.name) && styles.filterTagTextActive]}>
                    {ingredient.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Thời gian chế biến */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Thời gian chế biến</Text>
            <View style={styles.filterTags}>
              {cookingTimes.map((time) => (
                <TouchableOpacity
                  key={time.id}
                  style={[styles.filterTag, appliedFilters.cookingTime.includes(time.name) && styles.filterTagActive]}
                  onPress={() => toggleCookingTime(time.name)}
                >
                  <Text style={[styles.filterTagText, appliedFilters.cookingTime.includes(time.name) && styles.filterTagTextActive]}>
                    {time.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textDim,
  },
});

export default FilterModal;