import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useMealPlans } from '../../hooks/useMealPlans';
import WeeklyMealPlan from '../../components/common/WeeklyMealPlan';
import LimitationInfo from '../../components/common/LimitationInfo';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WeeklyMealPlanScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    weeklyMealPlan, 
    limitationInfo,
    loading, 
    error,
    loadWeeklyMealPlan, 
    generateWeeklyMealPlan,
    loadLimitationInfo 
  } = useMealPlans();

  useEffect(() => {
    loadWeeklyMealPlan();
    loadLimitationInfo();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMealPress = (meal: any) => {
    navigation.navigate('MealDetail', { meal });
  };

  const handleGenerateWeekly = async (weekStartDate: string): Promise<boolean> => {
    return await generateWeeklyMealPlan(weekStartDate);
  };

  const handleUpgradePress = () => {
    // Navigate to premium upgrade screen or show modal
    navigation.navigate('ProfileScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thực đơn tuần</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Limitation Info */}
      <LimitationInfo 
        limitationInfo={limitationInfo}
        onUpgradePress={handleUpgradePress}
      />

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải thực đơn tuần...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadWeeklyMealPlan}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WeeklyMealPlan
          weeklyMealPlan={weeklyMealPlan}
          loading={loading}
          onGenerateWeekly={handleGenerateWeekly}
          onMealPress={handleMealPress}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textDim,
    marginTop: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WeeklyMealPlanScreen;
