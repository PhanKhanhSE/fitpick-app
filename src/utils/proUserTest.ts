import { userProfileAPI } from '../services/userProfileAPI';

// Test function to verify Pro user functionality
export const testProUserFeatures = async () => {
  console.log('🧪 Testing Pro User Features...');
  
  try {
    // Test 1: Check if user is Pro
    console.log('1. Testing isProUser API...');
    const isProResponse = await userProfileAPI.isProUser();
    console.log('✅ isProUser response:', isProResponse);
    
    // Test 2: Get Pro user permissions
    console.log('2. Testing getProUserPermissions API...');
    const permissionsResponse = await userProfileAPI.getProUserPermissions();
    console.log('✅ Pro user permissions:', permissionsResponse);
    
    // Test 3: Get user profile with Pro info
    console.log('3. Testing getUserProfile API...');
    const profileResponse = await userProfileAPI.getCurrentUserProfile();
    console.log('✅ User profile with Pro info:', profileResponse);
    
    return {
      isPro: isProResponse.success ? isProResponse.data : false,
      permissions: permissionsResponse.success ? permissionsResponse.data : null,
      profile: profileResponse.success ? profileResponse.data : null
    };
    
  } catch (error) {
    console.error('❌ Error testing Pro user features:', error);
    return null;
  }
};

// Helper function to check Pro user status
export const checkProUserStatus = async (): Promise<boolean> => {
  try {
    const response = await userProfileAPI.isProUser();
    return response.success ? response.data : false;
  } catch (error) {
    console.error('Error checking Pro user status:', error);
    return false;
  }
};

// Helper function to get Pro user permissions
export const getProUserPermissions = async () => {
  try {
    const response = await userProfileAPI.getProUserPermissions();
    return response.success ? response.data : null;
  } catch (error) {
    console.error('Error getting Pro user permissions:', error);
    return null;
  }
};
