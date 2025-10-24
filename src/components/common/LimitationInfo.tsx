import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserLimitationInfo } from '../../services/mealPlanAPI';

interface LimitationInfoProps {
  limitationInfo: UserLimitationInfo | null;
  onUpgradePress: () => void;
}

const LimitationInfo: React.FC<LimitationInfoProps> = ({ 
  limitationInfo, 
  onUpgradePress 
}) => {
  if (!limitationInfo) {
    return null;
  }

  const handleUpgradePress = () => {
    Alert.alert(
      'Nâng cấp lên Premium',
      'Bạn có muốn nâng cấp lên Premium để sử dụng đầy đủ tính năng không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Nâng cấp', onPress: onUpgradePress }
      ]
    );
  };

  if (limitationInfo.isPremium) {
    return (
      <View style={styles.premiumContainer}>
        <View style={styles.premiumBadge}>
          <Ionicons name="diamond" size={16} color="#FFD700" />
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
        <Text style={styles.premiumDescription}>
          Bạn đang sử dụng gói Premium với đầy đủ tính năng
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.limitationContainer}>
      <View style={styles.limitationHeader}>
        <Ionicons name="lock-closed" size={20} color="#FF6B6B" />
        <Text style={styles.limitationTitle}>Giới hạn Free User</Text>
      </View>
      
      <View style={styles.limitationDetails}>
        <View style={styles.limitationItem}>
          <Ionicons name="restaurant" size={16} color="#666" />
          <Text style={styles.limitationText}>
            Còn lại {limitationInfo.remainingMealPlansToday} lượt tạo thực đơn hôm nay
          </Text>
        </View>
        
        <View style={styles.limitationItem}>
          <Ionicons name="eye" size={16} color="#666" />
          <Text style={styles.limitationText}>
            Chỉ xem được {limitationInfo.maxMealsToView} món ăn
          </Text>
        </View>
        
        <View style={styles.limitationItem}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.limitationText}>
            Không thể tạo thực đơn tuần
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradePress}>
        <Ionicons name="diamond" size={16} color="#FFF" />
        <Text style={styles.upgradeButtonText}>Nâng cấp lên Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  premiumContainer: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#2E7D32',
  },
  limitationContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  limitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  limitationDetails: {
    marginBottom: 16,
  },
  limitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default LimitationInfo;
