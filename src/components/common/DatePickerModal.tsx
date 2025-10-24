import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate?: Date;
  minDate?: Date; // Default to today
  maxDate?: Date; // Optional max date
  title?: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
  minDate,
  maxDate,
  title = 'Chọn ngày thêm vào thực đơn'
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(selectedDate);

  useEffect(() => {
    if (visible) {
      const today = new Date();
      setCurrentMonth(today);
      setTempSelectedDate(selectedDate || today);
    }
  }, [visible, selectedDate]);

  const getMinDate = () => {
    if (minDate) return minDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const isDateDisabled = (date: Date): boolean => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    const min = getMinDate();
    if (compareDate < min) return true;
    
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (compareDate > max) return true;
    }
    
    return false;
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Add empty slots for days before the first day of month
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(new Date(0)); // Invalid date placeholder
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    
    // Don't allow going to months before current month
    const today = new Date();
    if (newMonth.getFullYear() < today.getFullYear() || 
        (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() < today.getMonth())) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleSelectDate = (date: Date) => {
    if (isDateDisabled(date)) return;
    setTempSelectedDate(date);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      onSelectDate(tempSelectedDate);
      onClose();
    }
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  const renderDay = (date: Date, index: number) => {
    const isPlaceholder = date.getTime() === 0;
    if (isPlaceholder) {
      return <View key={`placeholder-${index}`} style={styles.dayCell} />;
    }

    const disabled = isDateDisabled(date);
    const selected = tempSelectedDate && isSameDay(date, tempSelectedDate);
    const today = isToday(date);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          selected && styles.selectedDayCell,
          today && !selected && styles.todayDayCell,
          disabled && styles.disabledDayCell
        ]}
        onPress={() => handleSelectDate(date)}
        disabled={disabled}
      >
        <Text style={[
          styles.dayText,
          selected && styles.selectedDayText,
          today && !selected && styles.todayDayText,
          disabled && styles.disabledDayText
        ]}>
          {date.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  
  const today = new Date();
  const isPrevMonthDisabled = currentMonth.getMonth() === today.getMonth() && 
                               currentMonth.getFullYear() === today.getFullYear();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity 
              onPress={handlePrevMonth} 
              style={styles.navButton}
              disabled={isPrevMonthDisabled}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={isPrevMonthDisabled ? COLORS.border : COLORS.primary} 
              />
            </TouchableOpacity>
            <Text style={styles.monthText}>{formatMonthYear(currentMonth)}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Week Days Header */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <ScrollView style={styles.calendarScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.calendarGrid}>
              {days.map((day, index) => renderDay(day, index))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
              disabled={!tempSelectedDate}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textStrong,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  navButton: {
    padding: SPACING.sm,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textStrong,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  calendarScroll: {
    maxHeight: 300,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xs,
  },
  selectedDayCell: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
  },
  todayDayCell: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADII.md,
  },
  disabledDayCell: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  todayDayText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  disabledDayText: {
    color: COLORS.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default DatePickerModal;
