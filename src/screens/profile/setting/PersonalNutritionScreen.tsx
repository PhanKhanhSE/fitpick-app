import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../../utils/theme";
import { userProfileAPI } from "../../../services/userProfileAPI";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

type NavigationProp = any;

const PersonalNutritionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNutritionData();
    }, [])
  );

  useEffect(() => {
    loadNutritionData();
  }, []);

  const loadNutritionData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profileResponse = await userProfileAPI.getCurrentUserProfile();
      
      if (profileResponse.success && profileResponse.data) {
        setUserProfile(profileResponse.data);
      } else {
        console.log('⚠️ Profile response not successful, using fallback');
        throw new Error('Profile response not successful');
      }
      
      // Load nutrition stats
      const nutritionResponse = await userProfileAPI.getNutritionStats();
      
      if (nutritionResponse.success && nutritionResponse.data) {
        setNutritionData(nutritionResponse.data);
      } else {
        console.log('⚠️ Nutrition response not successful, using mock data');
        setNutritionData({
          targetCalories: 2000,
          consumedCalories: 0,
          starch: { current: 0, target: 100 },
          protein: { current: 0, target: 80 },
          fat: { current: 0, target: 40 }
        });
      }
      
    } catch (error) {
      console.error('❌ Error loading nutrition data:', error);
      
      // Fallback to stored data
      try {
        console.log('🔄 Falling back to AsyncStorage...');
        const storedProfile = await AsyncStorage.getItem('userProfile');
        const storedGoal = await AsyncStorage.getItem('userGoal');
        const storedDietPlan = await AsyncStorage.getItem('userDietPlan');
        const storedCookingLevel = await AsyncStorage.getItem('userCookingLevel');
        const storedActivityLevel = await AsyncStorage.getItem('userActivityLevel');
        
        console.log('📱 Stored data:', {
          profile: storedProfile ? 'EXISTS' : 'NULL',
          goal: storedGoal,
          dietPlan: storedDietPlan,
          cookingLevel: storedCookingLevel,
          activityLevel: storedActivityLevel
        });
        
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setUserProfile({
            goal: storedGoal || parsedProfile.goal || '',
            dietPlan: storedDietPlan || parsedProfile.dietPlan || '',
            cookingLevel: storedCookingLevel || parsedProfile.cookingLevel || '',
            activityLevel: storedActivityLevel || parsedProfile.activityLevel || '',
            ...parsedProfile
          });
        } else {
          // If no stored profile, use individual stored values
          setUserProfile({
            goal: storedGoal || '',
            dietPlan: storedDietPlan || '',
            cookingLevel: storedCookingLevel || '',
            activityLevel: storedActivityLevel || '',
          });
        }
        
        // Set mock nutrition data if API fails
        setNutritionData({
          targetCalories: 2000,
          consumedCalories: 0,
          starch: { current: 0, target: 100 },
          protein: { current: 0, target: 80 },
          fat: { current: 0, target: 40 }
        });
        
      } catch (storageError) {
        console.error('Error loading stored data:', storageError);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu dinh dưỡng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderNutritionGoal = (title: string, current: number, target: number, unit: string) => {
    const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
    const isOverTarget = percentage > 100;
    
    return (
      <View style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{title}</Text>
          <Text style={styles.goalValue}>
            {current}/{target} {unit}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isOverTarget ? COLORS.error : COLORS.primary
              }
            ]} 
          />
        </View>
        <Text style={styles.goalPercentage}>{percentage}%</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dinh dưỡng cá nhân</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dinh dưỡng cá nhân</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* User Info Section */}
        {userProfile && (
          <View style={styles.userInfoSection}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mục tiêu:</Text>
              <Text style={styles.infoValue}>{userProfile.goal || 'Chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chế độ ăn:</Text>
              <Text style={styles.infoValue}>{userProfile.dietPlan || 'Chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kỹ năng nấu ăn:</Text>
              <Text style={styles.infoValue}>{userProfile.cookingLevel || 'Chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mức độ vận động:</Text>
              <Text style={styles.infoValue}>{userProfile.activityLevel || 'Chưa cập nhật'}</Text>
            </View>
          </View>
        )}

        {/* Nutrition Goals Section */}
        {nutritionData && (
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Mục tiêu dinh dưỡng hôm nay</Text>
            
            {renderNutritionGoal(
              'Calo', 
              nutritionData.consumedCalories || 0, 
              nutritionData.targetCalories || 2000, 
              'kcal'
            )}
            
            {nutritionData.starch && renderNutritionGoal(
              'Tinh bột', 
              nutritionData.starch.current || 0, 
              nutritionData.starch.target || 100, 
              'g'
            )}
            
            {nutritionData.protein && renderNutritionGoal(
              'Protein', 
              nutritionData.protein.current || 0, 
              nutritionData.protein.target || 80, 
              'g'
            )}
            
            {nutritionData.fat && renderNutritionGoal(
              'Chất béo', 
              nutritionData.fat.current || 0, 
              nutritionData.fat.target || 40, 
              'g'
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Goals")}
          >
            <Ionicons name="flag" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Cập nhật mục tiêu</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("EatStyle")}
          >
            <Ionicons name="restaurant" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Cập nhật chế độ ăn</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("CookingLevel")}
          >
            <Ionicons name="flame" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Cập nhật kỹ năng nấu ăn</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Lifestyle")}
          >
            <Ionicons name="fitness" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Cập nhật mức độ vận động</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalNutritionScreen;

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.muted,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  userInfoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  nutritionSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.muted,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  goalItem: {
    marginBottom: SPACING.md,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  goalValue: {
    fontSize: 12,
    color: COLORS.muted,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.muted,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  goalPercentage: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "right",
    marginTop: SPACING.xs,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
    marginLeft: SPACING.sm,
  },
});
