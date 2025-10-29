import { useState, useEffect } from 'react';
import { userProfileAPI } from '../services/userProfileAPI';
import { useUser } from './useUser';

export interface ProUserPermissions {
  userId: number;
  isProUser: boolean;
  canViewFutureDates: boolean;
  canPlanFutureMeals: boolean;
  canViewPastDates: boolean;
  canUsePremiumFeatures: boolean;
  canCreateWeeklyMealPlan: boolean;
  canViewDetailedReports: boolean;
}

export const useProUser = () => {
  const [permissions, setPermissions] = useState<ProUserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useUser();

  const loadProUserPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Nếu user là FREE, không cần gọi API Pro permissions
      if (userInfo?.accountType === 'FREE') {
        const freePermissions: ProUserPermissions = {
          userId: userInfo.id || 0,
          isProUser: false,
          canViewFutureDates: false,
          canPlanFutureMeals: false,
          canViewPastDates: true, // FREE users can view past dates
          canUsePremiumFeatures: false,
          canCreateWeeklyMealPlan: false,
          canViewDetailedReports: false,
        };
        setPermissions(freePermissions);
        return freePermissions;
      }
      
      // Chỉ gọi API Pro permissions cho PRO users
      const response = await userProfileAPI.getProUserPermissions();
      
      if (response.success && response.data) {
        setPermissions(response.data);
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error('Error loading Pro user permissions:', err);
      setError('Không thể tải thông tin Pro user');
      
      // Fallback: Check if user is Pro using simple API
      try {
        const isProResponse = await userProfileAPI.isProUser();
        if (isProResponse.success) {
          const fallbackPermissions: ProUserPermissions = {
            userId: userInfo?.id || 0,
            isProUser: isProResponse.data,
            canViewFutureDates: isProResponse.data,
            canPlanFutureMeals: isProResponse.data,
            canViewPastDates: true, // Always true
            canUsePremiumFeatures: isProResponse.data,
            canCreateWeeklyMealPlan: isProResponse.data,
            canViewDetailedReports: isProResponse.data,
          };
          setPermissions(fallbackPermissions);
          return fallbackPermissions;
        }
      } catch (fallbackError) {
        console.error('Error in fallback Pro user check:', fallbackError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isProUser = (): boolean => {
    // Ưu tiên kiểm tra từ userInfo trước
    if (userInfo?.accountType === 'PRO') {
      return true;
    }
    if (userInfo?.accountType === 'FREE') {
      return false;
    }
    // Fallback về permissions nếu có
    return permissions?.isProUser || false;
  };

  const canViewFutureDates = (): boolean => {
    // Ưu tiên kiểm tra từ userInfo trước
    if (userInfo?.accountType === 'PRO') {
      return true;
    }
    if (userInfo?.accountType === 'FREE') {
      return false;
    }
    return permissions?.canViewFutureDates || false;
  };

  const canPlanFutureMeals = (): boolean => {
    // Ưu tiên kiểm tra từ userInfo trước
    if (userInfo?.accountType === 'PRO') {
      return true;
    }
    if (userInfo?.accountType === 'FREE') {
      return false;
    }
    return permissions?.canPlanFutureMeals || false;
  };

  const canViewPastDates = (): boolean => {
    // Cả FREE và PRO đều có thể xem quá khứ
    return true;
  };

  const canUsePremiumFeatures = (): boolean => {
    // Ưu tiên kiểm tra từ userInfo trước
    if (userInfo?.accountType === 'PRO') {
      return true;
    }
    if (userInfo?.accountType === 'FREE') {
      return false;
    }
    return permissions?.canUsePremiumFeatures || false;
  };

  const canCreateWeeklyMealPlan = (): boolean => {
    // Ưu tiên kiểm tra từ userInfo trước
    if (userInfo?.accountType === 'PRO') {
      return true;
    }
    if (userInfo?.accountType === 'FREE') {
      return false;
    }
    return permissions?.canCreateWeeklyMealPlan || false;
  };

  const canViewDetailedReports = (): boolean => {
    // Ưu tiên kiểm tra từ userInfo trước
    if (userInfo?.accountType === 'PRO') {
      return true;
    }
    if (userInfo?.accountType === 'FREE') {
      return false;
    }
    return permissions?.canViewDetailedReports || false;
  };

  useEffect(() => {
    // Chỉ load permissions khi có userInfo
    if (userInfo) {
      loadProUserPermissions();
    }
  }, [userInfo]);

  return {
    permissions,
    loading,
    error,
    loadProUserPermissions,
    isProUser,
    canViewFutureDates,
    canPlanFutureMeals,
    canViewPastDates,
    canUsePremiumFeatures,
    canCreateWeeklyMealPlan,
    canViewDetailedReports,
    clearError: () => setError(null)
  };
};
