import { authAPI } from './api';
import { profileAPI } from './profileAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const testCompleteOnboardingFlow = async () => {
  try {
    console.log('🚀 Starting Complete Onboarding Flow Test...');
    
    // Step 1: Clear existing tokens
    console.log('🧹 Clearing existing tokens...');
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

    // Step 2: Register new user
    const testEmail = `onboarding_test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    console.log('📝 Step 1: Registering user...');
    const registerResponse = await authAPI.register(testEmail, testPassword, testPassword);
    if (!registerResponse.success) {
      throw new Error('Register failed');
    }
    console.log('✅ Register successful');

    // Step 3: Auto-login after registration
    console.log('🔑 Step 2: Auto-login after registration...');
    const loginResponse = await authAPI.login(testEmail, testPassword);
    if (!loginResponse.success) {
      throw new Error('Auto-login failed');
    }
    console.log('✅ Auto-login successful');

    // Step 4: Verify token is stored
    const storedToken = await AsyncStorage.getItem('accessToken');
    if (!storedToken) {
      throw new Error('Token not stored');
    }
    console.log('✅ Token stored:', storedToken.substring(0, 50) + '...');

    // Step 5: Save user profile
    console.log('👤 Step 3: Saving user profile...');
    const profileData = {
      fullName: 'Test User',
      gender: 'Nam',
      age: 25,
      height: 170,
      weight: 70,
      targetWeight: 65
    };
    
    const profileResponse = await profileAPI.saveUserProfile(profileData);
    console.log('✅ Profile saved successfully');

    // Step 6: Save user goals
    console.log('🎯 Step 4: Saving user goals...');
    const goalsData = {
      goal: 'Giảm cân',
      otherGoal: 'Tăng cường sức khỏe'
    };
    
    const goalsResponse = await profileAPI.saveUserGoals(goalsData);
    console.log('✅ Goals saved successfully');

    // Step 7: Save user lifestyle
    console.log('🏃 Step 5: Saving user lifestyle...');
    const lifestyleData = {
      activityLevel: 'Vừa phải'
    };
    
    const lifestyleResponse = await profileAPI.saveUserLifestyle(lifestyleData);
    console.log('✅ Lifestyle saved successfully');

    // Step 8: Save user diet plan
    console.log('🍽️ Step 6: Saving user diet plan...');
    const dietPlanData = {
      dietPlan: 'Cân bằng'
    };
    
    const dietPlanResponse = await profileAPI.saveUserDietPlan(dietPlanData);
    console.log('✅ Diet plan saved successfully');

    // Step 9: Save user cooking level
    console.log('👨‍🍳 Step 7: Saving user cooking level...');
    const cookingLevelData = {
      cookingLevel: 'Trung bình'
    };
    
    const cookingLevelResponse = await profileAPI.saveUserCookingLevel(cookingLevelData);
    console.log('✅ Cooking level saved successfully');

    // Step 10: Complete onboarding
    console.log('🎉 Step 8: Completing onboarding...');
    const completeResponse = await profileAPI.completeOnboarding();
    console.log('✅ Onboarding completed successfully');

    // Step 11: Get user profile to verify
    console.log('🔍 Step 9: Verifying user profile...');
    const userProfile = await profileAPI.getUserProfile();
    console.log('✅ User profile retrieved:', userProfile);

    console.log('🎉 Complete Onboarding Flow Test SUCCESSFUL!');
    return {
      success: true,
      message: 'Complete onboarding flow test successful',
      data: {
        email: testEmail,
        profile: userProfile
      }
    };

  } catch (error: any) {
    console.error('❌ Complete Onboarding Flow Test FAILED:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return {
      success: false,
      message: error.message,
      error: error.response?.data || error,
      status: error.response?.status
    };
  }
};

export const testRegistrationFlow = async () => {
  try {
    console.log('🚀 Testing Registration Flow...');
    
    // Clear existing tokens
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

    // Register and auto-login
    const testEmail = `reg_test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    console.log('📝 Registering user...');
    const registerResponse = await authAPI.register(testEmail, testPassword, testPassword);
    if (!registerResponse.success) {
      throw new Error('Register failed');
    }
    console.log('✅ Register successful');

    console.log('🔑 Auto-login after registration...');
    const loginResponse = await authAPI.login(testEmail, testPassword);
    if (!loginResponse.success) {
      throw new Error('Auto-login failed');
    }
    console.log('✅ Auto-login successful');

    // Verify token is stored
    const storedToken = await AsyncStorage.getItem('accessToken');
    if (!storedToken) {
      throw new Error('Token not stored');
    }
    console.log('✅ Token stored and ready for API calls');

    return {
      success: true,
      message: 'Registration flow test successful',
      data: {
        email: testEmail,
        tokenStored: !!storedToken
      }
    };

  } catch (error: any) {
    console.error('❌ Registration Flow Test FAILED:', error);
    return {
      success: false,
      message: error.message,
      error: error.response?.data || error
    };
  }
};
