import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { FoodItem } from './FavoriteCard';

interface WeekDay {
  key: string;
  label: string;
  date: Date;
}

interface MealPlannerModalProps {
  visible: boolean;
  item: FoodItem | null;
  onClose: () => void;
  onSave: (selectedDays: string[], mealType: string) => void;
}

// Helper: generate 7 ngày bắt đầu từ startDate (thứ 2)
const getWeekDays = (startDate: Date): WeekDay[] => {
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return {
      key: d.toDateString(),
      label: formatter.format(d), // Ví dụ: "Thứ Hai, 30 tháng 9"
      date: d,
    };
  });
};

const MealPlannerModal: React.FC<MealPlannerModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const mealTypes = ["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"];
  const [mealType, setMealType] = useState(mealTypes[0]);
  const [showMealDropdown, setShowMealDropdown] = useState(false);

  // Tính ra thứ 2 gần nhất
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(monday);

  const weekDays = getWeekDays(currentWeekStart);

  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey) ? prev.filter((x) => x !== dayKey) : [...prev, dayKey]
    );
  };

  const handleSave = () => {
    onSave(selectedDays, mealType);
    setSelectedDays([]);
    onClose();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay} />
      <View style={styles.mealPlanner}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thêm vào thực đơn</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Item info */}
        {item && (
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              {item.calories} kcal • {item.weight}g
            </Text>
          </View>
        )}

        {/* Header tuần */}
        <View style={styles.weekHeader}>
          <TouchableOpacity onPress={() => navigateWeek('prev')}>
            <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.weekText}>
            {weekDays[0].label.split(", ")[1]} -{" "}
            {weekDays[6].label.split(", ")[1]}
          </Text>

          <TouchableOpacity onPress={() => navigateWeek('next')}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Dropdown bữa ăn */}
        <View style={styles.mealTypeContainer}>
          <Text style={styles.sectionTitle}>Loại bữa ăn:</Text>
          <TouchableOpacity
            style={styles.mealTypeButton}
            onPress={() => setShowMealDropdown(!showMealDropdown)}
          >
            <Text style={styles.mealTypeText}>
              {mealType}
            </Text>
            <Ionicons 
              name={showMealDropdown ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
          
          {showMealDropdown && (
            <View style={styles.dropdown}>
              {mealTypes.map((type, index) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setMealType(type);
                    setShowMealDropdown(false);
                  }}
                  style={index === mealTypes.length - 1 ? styles.lastDropdownItem : styles.dropdownItem}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    type === mealType && styles.selectedMealType
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Danh sách ngày */}
        <Text style={styles.sectionTitle}>Chọn ngày:</Text>
        <ScrollView style={styles.daysList}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={styles.dayRow}
              onPress={() => toggleDay(day.key)}
            >
              <Text style={styles.dayLabel}>{day.label}</Text>
              <View
                style={[
                  styles.checkbox,
                  selectedDays.includes(day.key) && styles.checkedBox,
                ]}
              >
                {selectedDays.includes(day.key) && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lưu */}
        <TouchableOpacity
          style={[
            styles.saveButton, 
            selectedDays.length === 0 && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={selectedDays.length === 0}
        >
          <Text style={[
            styles.saveButtonText,
            selectedDays.length === 0 && styles.saveButtonTextDisabled
          ]}>
            Lưu ({selectedDays.length} ngày)
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mealPlanner: {
    backgroundColor: 'white',
    padding: SPACING.md,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 24,
  },
  itemInfo: {
    backgroundColor: '#f8f9fa',
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginBottom: SPACING.lg,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemDetails: {
    fontSize: 14,
    color: COLORS.muted,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  weekText: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.text,
  },
  mealTypeContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  mealTypeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADII.md,
    backgroundColor: 'white',
  },
  mealTypeText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: 'white',
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADII.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastDropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedMealType: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  daysList: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADII.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
});

export default MealPlannerModal;