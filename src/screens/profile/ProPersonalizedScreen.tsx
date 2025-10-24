import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { useUser } from '../../hooks/useUser';
import { proPersonalizedAPI, DeepRecommendation } from '../../services/proPersonalizedAPI';
import ProUpgradeModal from '../../components/common/ProUpgradeModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProPersonalizedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isProUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<DeepRecommendation | null>(null);
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);
  const [settingUpReminders, setSettingUpReminders] = useState(false);

  // Show upgrade modal on first mount if not PRO
  useEffect(() => {
    if (!isProUser()) {
      setShowProUpgradeModal(true);
    }
  }, []);

  // Auto-reload recommendations whenever the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      if (isProUser()) {
        loadRecommendations();
      }
    }, [])
  );

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await proPersonalizedAPI.getDeepRecommendations();
      
      if (response.success && response.data) {
        setRecommendations(response.data);
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể tải gợi ý');
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      Alert.alert('Lỗi', 'Không thể tải gợi ý cá nhân hóa');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupReminders = async () => {
    try {
      setSettingUpReminders(true);
      const response = await proPersonalizedAPI.setupMealReminders();
      
      if (response.success) {
        Alert.alert(
          'Thành công',
          'Đã thiết lập nhắc nhở cho 3 bữa ăn hàng ngày!\n\n' +
          '🌅 Bữa sáng: 7:00\n' +
          '☀️ Bữa trưa: 12:00\n' +
          '🌙 Bữa tối: 18:30'
        );
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể thiết lập nhắc nhở');
      }
    } catch (error) {
      console.error('Error setting up reminders:', error);
      Alert.alert('Lỗi', 'Không thể thiết lập nhắc nhở');
    } finally {
      setSettingUpReminders(false);
    }
  };

  const handleMealPress = (mealId: number) => {
    navigation.navigate('MealDetail' as any, { mealId });
  };

  const handleUpgradeToPro = () => {
    setShowProUpgradeModal(false);
    navigation.navigate('Profile' as any);
  };

  const renderMealCard = (meal: any, index?: number) => (
    <TouchableOpacity
      key={`${meal.mealId}-${index ?? 0}`}
      style={styles.mealCard}
      onPress={() => handleMealPress(meal.mealId)}
    >
      {meal.imageUrl && (
        <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
      )}
      <View style={styles.mealInfo}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName} numberOfLines={2}>{meal.name}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{Math.round(meal.matchScore)}</Text>
            <Ionicons name="star" size={14} color="#FFD700" />
          </View>
        </View>
        <Text style={styles.mealReason} numberOfLines={2}>{meal.reason}</Text>
        <View style={styles.mealMeta}>
          <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
          <Text style={styles.mealTime}>{meal.mealTimeRecommendation}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gợi ý cá nhân hóa</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang phân tích...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gợi ý cá nhân hóa</Text>
        <TouchableOpacity onPress={loadRecommendations} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {recommendations && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadRecommendations} />
          }
        >
          {/* Personalized Message */}
          <View style={styles.messageCard}>
            <Ionicons name="sparkles" size={24} color={COLORS.primary} style={styles.messageIcon} />
            <Text style={styles.messageText}>{recommendations.personalizedMessage}</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSetupReminders}
              disabled={settingUpReminders}
            >
              {settingUpReminders ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="notifications" size={20} color="#FFF" />
              )}
              <Text style={styles.actionButtonText}>
                {settingUpReminders ? 'Đang thiết lập...' : 'Thiết lập nhắc nhở'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => navigation.navigate('WeeklyMealPlanScreen' as any)}
            >
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                Thực đơn tuần
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress Summary */}
          {recommendations.progress && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Tiến độ của bạn</Text>
              <View style={styles.progressCard}>
                {/* Goal and Weight Overview */}
                <View style={styles.progressHeader}>
                  <View style={styles.progressGoal}>
                    <Ionicons name="flag" size={20} color={COLORS.primary} />
                    <Text style={styles.progressGoalText}>{recommendations.progress.goalName}</Text>
                  </View>
                </View>

                {/* Weight Progress Bar */}
                <View style={styles.weightProgressContainer}>
                  <View style={styles.weightRow}>
                    <View style={styles.weightItem}>
                      <Text style={styles.weightLabel}>Hiện tại</Text>
                      <Text style={styles.weightValue}>{recommendations.progress.currentWeight.toFixed(1)} kg</Text>
                    </View>
                    <View style={styles.weightDivider} />
                    <View style={styles.weightItem}>
                      <Text style={styles.weightLabel}>Mục tiêu</Text>
                      <Text style={styles.weightValue}>{recommendations.progress.targetWeight.toFixed(1)} kg</Text>
                    </View>
                  </View>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[
                          styles.progressBarFill,
                          { 
                            width: `${Math.min(100, Math.max(0, parseFloat(recommendations.progress.progressPercentage) || 0))}%`,
                            backgroundColor: parseFloat(recommendations.progress.progressPercentage) >= 75 
                              ? '#4CAF50' 
                              : parseFloat(recommendations.progress.progressPercentage) >= 50 
                              ? '#FFC107' 
                              : COLORS.primary
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressPercentageText}>
                      {recommendations.progress.progressPercentage}
                    </Text>
                  </View>

                  {/* Weight Change */}
                  <View style={styles.weightChangeContainer}>
                    <Ionicons 
                      name={recommendations.progress.weightChange > 0 ? "trending-down" : "trending-up"} 
                      size={16} 
                      color={recommendations.progress.weightChange > 0 ? "#4CAF50" : "#FF9800"} 
                    />
                    <Text style={styles.weightChangeText}>
                      {Math.abs(recommendations.progress.weightChange).toFixed(1)} kg {recommendations.progress.weightChange >= 0 ? 'giảm' : 'tăng'}
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Ionicons name="calendar" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.statValue}>{recommendations.progress.daysActive}</Text>
                    <Text style={styles.statLabel}>ngày hoạt động</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Ionicons name="flame" size={20} color="#FF5722" />
                    </View>
                    <Text style={styles.statValue}>
                      {Math.round(recommendations.progress.averageCaloriesPerDay)}
                    </Text>
                    <Text style={styles.statLabel}>kcal/ngày TB</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Recommended Meals */}
          {recommendations.recommendedMeals && recommendations.recommendedMeals.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍽️ Món ăn đề xuất</Text>
              {recommendations.recommendedMeals.map((meal, idx) => renderMealCard(meal, idx))}
            </View>
          )}

          {/* Nutrition Tips */}
          {recommendations.nutritionTips && recommendations.nutritionTips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Mẹo dinh dưỡng</Text>
              {recommendations.nutritionTips.map((tip, index) => (
                <View key={index} style={styles.tipCard}>
                  <Ionicons name="bulb" size={16} color={COLORS.primary} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Goal Advice */}
          {recommendations.goalBasedAdvice && recommendations.goalBasedAdvice.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Lời khuyên dựa trên mục tiêu</Text>
              {recommendations.goalBasedAdvice.map((advice, index) => (
                <View key={index} style={styles.adviceCard}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.adviceText}>{advice}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

      <ProUpgradeModal
        visible={showProUpgradeModal && !isProUser()}
        onClose={() => {
          setShowProUpgradeModal(false);
          navigation.goBack();
        }}
        onUpgrade={handleUpgradeToPro}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  refreshButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FF',
    padding: SPACING.md,
    margin: SPACING.md,
    borderRadius: RADII.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  messageIcon: {
    marginRight: SPACING.sm,
  },
  messageText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
    gap: SPACING.xs,
  },
  actionButtonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  progressCard: {
    backgroundColor: '#FFF',
    padding: SPACING.md,
    borderRadius: RADII.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressPercentage: {
    color: COLORS.primary,
    fontSize: 16,
  },
  // New progress bar styles
  progressHeader: {
    marginBottom: SPACING.md,
  },
  progressGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  progressGoalText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  weightProgressContainer: {
    marginTop: SPACING.sm,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  weightItem: {
    flex: 1,
    alignItems: 'center',
  },
  weightDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: SPACING.md,
  },
  weightLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressBarContainer: {
    marginBottom: SPACING.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  weightChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADII.sm,
    gap: SPACING.xs,
  },
  weightChangeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
  },
  statIconContainer: {
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: '#FFF',
    borderRadius: RADII.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  mealInfo: {
    padding: SPACING.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  mealName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADII.sm,
    marginLeft: SPACING.xs,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9800',
    marginRight: 2,
  },
  mealReason: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  mealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary,
  },
  mealTime: {
    fontSize: 12,
    color: COLORS.textLight,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  adviceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FFF4',
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  adviceText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default ProPersonalizedScreen;
