import { userProfileAPI } from '../services/userProfileAPI';

// Test function to verify Pro user functionality
export const testProUserFeatures = async () => {

  try {
    // Test 1: Check if user is Pro

    const isProResponse = await userProfileAPI.isProUser();

    // Test 2: Get Pro user permissions

    const permissionsResponse = await userProfileAPI.getProUserPermissions();

    // Test 3: Get user profile with Pro info

    const profileResponse = await userProfileAPI.getCurrentUserProfile();

    return {
      isPro: isProResponse.success ? isProResponse.data : false,
      permissions: permissionsResponse.success ? permissionsResponse.data : null,
      profile: profileResponse.success ? profileResponse.data : null
    };
    
  } catch (error) {

    return null;
  }
};

// Helper function to check Pro user status
export const checkProUserStatus = async (): Promise<boolean> => {
  try {
    const response = await userProfileAPI.isProUser();
    return response.success ? response.data : false;
  } catch (error) {

    return false;
  }
};

// Helper function to get Pro user permissions
export const getProUserPermissions = async () => {
  try {
    const response = await userProfileAPI.getProUserPermissions();
    return response.success ? response.data : null;
  } catch (error) {

    return null;
  }
};
