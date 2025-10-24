import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeeklyMealPlanDto, WeeklyDailyMealPlanDto } from '../../services/mealPlanAPI';

interface WeeklyMealPlanProps {
  weeklyMealPlan: WeeklyMealPlanDto | null;
  loading: boolean;
  onGenerateWeekly: (weekStartDate: string) => Promise<boolean>;
  onMealPress: (meal: any) => void;
}

const WeeklyMealPlan: React.FC<WeeklyMealPlanProps> = ({
  weeklyMealPlan,
  loading,
  onGenerateWeekly,
  onMealPress
}) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const handleGenerateWeekly = async () => {
    const today = new Date();
    // Start week on Monday and end on Sunday
    const weekStart = new Date(today);
    const day = today.getDay(); // 0=Sun,1=Mon,...6=Sat
    const diffToMonday = (day + 6) % 7; // 0 for Monday, 6 for Sunday
    weekStart.setDate(today.getDate() - diffToMonday);

    const weekStartString = weekStart.toISOString().split('T')[0];

    const success = await onGenerateWeekly(weekStartString);
    if (success) {
      setShowGenerateModal(false);
      Alert.alert('Thành công', 'Đã tạo thực đơn tuần thành công!');
    } else {
      Alert.alert('Lỗi', 'Không thể tạo thực đơn tuần. Vui lòng thử lại.');
    }
  };

  // Parse YYYY-MM-DD as a local date to avoid timezone shifts (off-by-one day)
  const parseDateLocal = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const formatDate = (dateString: string) => {
    const date = parseDateLocal(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
    });
  };

  const getDayName = (dayName: string) => {
    const dayMap: { [key: string]: string } = {
      'Sunday': 'Chủ nhật',
      'Monday': 'Thứ hai',
      'Tuesday': 'Thứ ba',
      'Wednesday': 'Thứ tư',
      'Thursday': 'Thứ năm',
      'Friday': 'Thứ sáu',
      'Saturday': 'Thứ bảy'
    };
    return dayMap[dayName] || dayName;
  };

  if (!weeklyMealPlan) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={48} color="#CCC" />
        <Text style={styles.emptyTitle}>Chưa có thực đơn tuần</Text>
        <Text style={styles.emptyDescription}>
          Tạo thực đơn tuần để có kế hoạch ăn uống khoa học cho cả tuần
        </Text>
        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={() => setShowGenerateModal(true)}
          disabled={loading}
        >
          <Ionicons name="add-circle" size={20} color="#FFF" />
          <Text style={styles.generateButtonText}>
            {loading ? 'Đang tạo...' : 'Tạo thực đơn tuần'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.weekTitle}>Thực đơn tuần</Text>
          <Text style={styles.weekDate}>
            {formatDate(weeklyMealPlan.weekStartDate)} - {formatDate(weeklyMealPlan.weekEndDate)}
          </Text>
          <Text style={styles.totalCalories}>
            Tổng calories: {weeklyMealPlan.totalCalories.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.regenerateButton}
          onPress={() => setShowGenerateModal(true)}
        >
          <Ionicons name="refresh" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {weeklyMealPlan.dailyPlans.map((dayPlan: WeeklyDailyMealPlanDto, index: number) => (
          <View key={dayPlan.date || index} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{getDayName(dayPlan.dayName)}</Text>
              <Text style={styles.dayDate}>{formatDate(dayPlan.date)}</Text>
            </View>
            
            <View style={styles.mealsContainer}>
              {dayPlan.meals.map((mealPlan, mealIndex) => (
                <TouchableOpacity
                  key={`${dayPlan.date}-${mealPlan.planId ?? mealIndex}`}
                  style={styles.mealItem}
                  onPress={() => onMealPress(mealPlan.meal)}
                >
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealTime}>{mealPlan.mealTime}</Text>
                    <Text style={styles.mealName}>{mealPlan.meal.name}</Text>
                    <View style={styles.mealDetails}>
                      <Text style={styles.mealCalories}>
                        {mealPlan.meal.calories} cal
                      </Text>
                      <Text style={styles.mealTime}>
                        {mealPlan.meal.cookingtime} phút
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Generate Modal */}
      <Modal
        visible={showGenerateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenerateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo thực đơn tuần mới</Text>
            <Text style={styles.modalDescription}>
              Thực đơn tuần hiện tại sẽ bị thay thế. Bạn có chắc chắn muốn tạo mới?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGenerateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleGenerateWeekly}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Đang tạo...' : 'Tạo mới'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerInfo: {
    flex: 1,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weekDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalCalories: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 4,
    fontWeight: '600',
  },
  regenerateButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  dayContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
  },
  mealsContainer: {
    gap: 8,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealTime: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  mealName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  mealDetails: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },
  mealCalories: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    margin: 32,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default WeeklyMealPlan;
