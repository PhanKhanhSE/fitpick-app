import { useState, useEffect } from 'react';
import { userProfileAPI } from '../services/userProfileAPI';

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

  const loadProUserPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
            userId: 0,
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
    return permissions?.isProUser || false;
  };

  const canViewFutureDates = (): boolean => {
    return permissions?.canViewFutureDates || false;
  };

  const canPlanFutureMeals = (): boolean => {
    return permissions?.canPlanFutureMeals || false;
  };

  const canViewPastDates = (): boolean => {
    return permissions?.canViewPastDates || true; // Default to true
  };

  const canUsePremiumFeatures = (): boolean => {
    return permissions?.canUsePremiumFeatures || false;
  };

  const canCreateWeeklyMealPlan = (): boolean => {
    return permissions?.canCreateWeeklyMealPlan || false;
  };

  const canViewDetailedReports = (): boolean => {
    return permissions?.canViewDetailedReports || false;
  };

  useEffect(() => {
    loadProUserPermissions();
  }, []);

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
