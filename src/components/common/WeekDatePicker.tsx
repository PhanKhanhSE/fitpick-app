import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';

interface WeekDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  onGenerateWeeklyPlan: () => void;
  isProUser: boolean;
}

const WeekDatePicker: React.FC<WeekDatePickerProps> = ({
  visible,
  onClose,
  onSelectDate,
  onGenerateWeeklyPlan,
  isProUser
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Tính ra thứ 2 gần nhất
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(monday);

  const getWeekDays = (weekStart: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return {
        dayName: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
        dayNumber: d.getDate(),
        date: d,
        isToday: d.toDateString() === today.toDateString(),
        isPast: d < today,
        isFuture: d > today
      };
    });
  };

  const weekDays = getWeekDays(currentWeekStart);

  const handleDateSelect = (date: Date) => {
    if (!isProUser && date > today) {
      // User FREE không thể chọn ngày tương lai
      return;
    }
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelectDate(selectedDate);
      setSelectedDate(null);
      onClose();
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
  };

  const canNavigateNext = () => {
    if (!isProUser) {
      // User FREE chỉ có thể xem tuần hiện tại và quá khứ
      const nextWeekStart = new Date(currentWeekStart);
      nextWeekStart.setDate(currentWeekStart.getDate() + 7);
      return nextWeekStart <= today;
    }
    return true; // User PRO có thể xem tất cả
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isProUser ? 'Chọn ngày trong tuần' : 'Chọn ngày'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Week Navigation */}
          <View style={styles.weekNavigation}>
            <TouchableOpacity 
              onPress={() => navigateWeek('prev')}
              style={styles.navButton}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            
            <Text style={styles.weekTitle}>
              Tuần {currentWeekStart.getDate()}/{currentWeekStart.getMonth() + 1}
            </Text>
            
            <TouchableOpacity 
              onPress={() => navigateWeek('next')}
              style={[styles.navButton, !canNavigateNext() && styles.disabledButton]}
              disabled={!canNavigateNext()}
            >
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={canNavigateNext() ? COLORS.primary : COLORS.muted} 
              />
            </TouchableOpacity>
          </View>

          {/* Week Days */}
          <View style={styles.weekDays}>
            {weekDays.map((day, index) => {
              const isSelected = selectedDate?.toDateString() === day.date.toDateString();
              const canSelect = isProUser || !day.isFuture;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    day.isToday && styles.todayButton,
                    isSelected && styles.selectedButton,
                    !canSelect && styles.disabledDayButton
                  ]}
                  onPress={() => canSelect && handleDateSelect(day.date)}
                  disabled={!canSelect}
                >
                  <Text style={[
                    styles.dayName,
                    day.isToday && styles.todayText,
                    isSelected && styles.selectedText,
                    !canSelect && styles.disabledText
                  ]}>
                    {day.dayName}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    day.isToday && styles.todayText,
                    isSelected && styles.selectedText,
                    !canSelect && styles.disabledText
                  ]}>
                    {day.dayNumber}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Pro Features */}
          {isProUser && (
            <View style={styles.proFeatures}>
              <TouchableOpacity 
                style={styles.aiButton}
                onPress={onGenerateWeeklyPlan}
              >
                <Ionicons name="sparkles" size={20} color="white" />
                <Text style={styles.aiButtonText}>AI Sinh thực đơn cả tuần</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, !selectedDate && styles.disabledButton]} 
              onPress={handleConfirm}
              disabled={!selectedDate}
            >
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  navButton: {
    padding: SPACING.sm,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.background,
  },
  disabledButton: {
    opacity: 0.5,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    marginHorizontal: 2,
    borderRadius: RADII.md,
    backgroundColor: COLORS.background,
  },
  todayButton: {
    backgroundColor: COLORS.primary,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  disabledDayButton: {
    backgroundColor: COLORS.muted,
    opacity: 0.5,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textDim,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  todayText: {
    color: 'white',
  },
  selectedText: {
    color: 'white',
  },
  disabledText: {
    color: COLORS.muted,
  },
  proFeatures: {
    marginBottom: SPACING.lg,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADII.md,
    gap: SPACING.sm,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDim,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default WeekDatePicker;
