import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userProfileAPI } from '../services/userProfileAPI';

export interface UserInfo {
  id?: number;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  accountType: 'FREE' | 'PRO';
  subscriptionType?: string;
}

export const useUser = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Thử load từ API trước
      const profileResponse = await userProfileAPI.getUserProfile();
      
      if (profileResponse.success && profileResponse.data) {
        const profile = profileResponse.data;
        const user: UserInfo = {
          id: profile.id,
          email: profile.email || '',
          fullName: profile.fullName || '',
          avatarUrl: profile.avatarUrl,
          accountType: profile.accountType === 'PRO' ? 'PRO' : 'FREE',
          subscriptionType: profile.subscriptionType
        };
        
        setUserInfo(user);
        // Lưu vào AsyncStorage để cache
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        return user;
      }
      
      // Fallback: Load từ AsyncStorage
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserInfo(user);
        return user;
      }
      
      // Fallback: Load từ user cũ
      const storedUserOld = await AsyncStorage.getItem('user');
      if (storedUserOld) {
        const userOld = JSON.parse(storedUserOld);
        const user: UserInfo = {
          email: userOld.email || '',
          fullName: userOld.fullName || '',
          accountType: 'FREE', // Default to FREE
        };
        setUserInfo(user);
        return user;
      }
      
      return null;
    } catch (err) {
      console.error('Error loading user info:', err);
      setError('Không thể tải thông tin người dùng');
      
      // Fallback to stored data
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserInfo(user);
          return user;
        }
      } catch (storageError) {
        console.error('Error loading stored user info:', storageError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isProUser = () => {
    return userInfo?.accountType === 'PRO';
  };

  const canViewFutureDates = () => {
    return isProUser();
  };

  const canViewPastDates = () => {
    return true; // Cả FREE và PRO đều có thể xem quá khứ
  };

  const canPlanFutureMeals = () => {
    return isProUser();
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  return {
    userInfo,
    loading,
    error,
    loadUserInfo,
    isProUser,
    canViewFutureDates,
    canViewPastDates,
    canPlanFutureMeals,
    clearError: () => setError(null)
  };
};
