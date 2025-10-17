import { authAPI } from './api';
import { profileAPI } from './profileAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Full flow test data
const testUserData = {
  email: `test${Date.now()}@example.com`,
  password: '123456',
  fullName: 'Test User',
  gender: 'Male',
  age: 25,
  height: 175,
  weight: 70,
  targetWeight: 65,
  goal: 'lose',
  activityLevel: 'moderate',
  dietPlan: 'Balanced',
  cookingLevel: 'Intermediate'
};

// Full flow test function
export const testFullOnboardingFlow = async () => {
  console.log('🚀 Starting Full Onboarding Flow Test...');
  console.log('📊 Test Data:', testUserData);
  
  const results = {
    register: false,
    userInfo: false,
    goals: false,
    lifestyle: false,
    dietPlan: false,
    cookingLevel: false,
    completeOnboarding: false,
    login: false
  };

  try {
    // Step 1: Register
    console.log('📝 Step 1: Registering user...');
    const registerResponse = await authAPI.register(
      testUserData.email,
      testUserData.password,
      testUserData.password
    );
    
    if (registerResponse.success) {
      results.register = true;
      console.log('✅ Register successful:', registerResponse.message);
    } else {
      throw new Error('Register failed');
    }

    // Step 2: Login to get token
    console.log('🔑 Step 2: Logging in...');
    const loginResponse = await authAPI.login(testUserData.email, testUserData.password);
    
    if (loginResponse.success) {
      results.login = true;
      console.log('✅ Login successful, token received');
      
      // Wait a bit to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('⏳ Waiting for token to be stored...');
      
      // Debug: Check if token is stored
      const storedToken = await AsyncStorage.getItem('accessToken');
      console.log('🔍 Token stored:', storedToken ? 'YES' : 'NO');
      console.log('🔍 Token preview:', storedToken ? storedToken.substring(0, 20) + '...' : 'NONE');
    } else {
      throw new Error('Login failed');
    }

    // Step 3: Save User Profile
    console.log('👤 Step 3: Saving user profile...');
    const profileResponse = await profileAPI.saveUserProfile({
      fullName: testUserData.fullName,
      gender: testUserData.gender,
      age: testUserData.age,
      height: testUserData.height,
      weight: testUserData.weight,
      targetWeight: testUserData.targetWeight,
    });
    
    if (profileResponse.success) {
      results.userInfo = true;
      console.log('✅ User profile saved');
    } else {
      throw new Error('Save user profile failed');
    }

    // Step 4: Save Goals
    console.log('🎯 Step 4: Saving goals...');
    const goalsResponse = await profileAPI.saveUserGoals({
      goal: testUserData.goal,
    });
    
    if (goalsResponse.success) {
      results.goals = true;
      console.log('✅ Goals saved');
    } else {
      throw new Error('Save goals failed');
    }

    // Step 5: Save Lifestyle
    console.log('🏃 Step 5: Saving lifestyle...');
    const lifestyleResponse = await profileAPI.saveUserLifestyle({
      activityLevel: testUserData.activityLevel,
    });
    
    if (lifestyleResponse.success) {
      results.lifestyle = true;
      console.log('✅ Lifestyle saved');
    } else {
      throw new Error('Save lifestyle failed');
    }

    // Step 6: Save Diet Plan
    console.log('🍽️ Step 6: Saving diet plan...');
    const dietResponse = await profileAPI.saveUserDietPlan({
      dietPlan: testUserData.dietPlan,
    });
    
    if (dietResponse.success) {
      results.dietPlan = true;
      console.log('✅ Diet plan saved');
    } else {
      throw new Error('Save diet plan failed');
    }

    // Step 7: Save Cooking Level
    console.log('👨‍🍳 Step 7: Saving cooking level...');
    const cookingResponse = await profileAPI.saveUserCookingLevel({
      cookingLevel: testUserData.cookingLevel,
    });
    
    if (cookingResponse.success) {
      results.cookingLevel = true;
      console.log('✅ Cooking level saved');
    } else {
      throw new Error('Save cooking level failed');
    }

    // Step 8: Complete Onboarding
    console.log('✅ Step 8: Completing onboarding...');
    const completeResponse = await profileAPI.completeOnboarding();
    
    if (completeResponse.success) {
      results.completeOnboarding = true;
      console.log('✅ Onboarding completed');
    } else {
      throw new Error('Complete onboarding failed');
    }

    // Step 9: Get Final Profile
    console.log('📋 Step 9: Getting final profile...');
    const finalProfile = await profileAPI.getUserProfile();
    
    if (finalProfile.success) {
      console.log('✅ Final profile retrieved:', finalProfile.data);
    }

    // Summary
    console.log('🎉 Full Onboarding Flow Test Completed!');
    console.log('📊 Results Summary:', results);
    
    const successCount = Object.values(results).filter(Boolean).length;
    const totalSteps = Object.keys(results).length;
    
    console.log(`✅ Success: ${successCount}/${totalSteps} steps completed`);
    
    if (successCount === totalSteps) {
      console.log('🎯 ALL STEPS COMPLETED SUCCESSFULLY!');
      console.log('🚀 User is ready to use the app!');
      return {
        success: true,
        message: 'Full onboarding flow completed successfully!',
        results,
        testData: testUserData
      };
    } else {
      console.log('⚠️ Some steps failed');
      return {
        success: false,
        message: 'Some steps failed in onboarding flow',
        results,
        testData: testUserData
      };
    }

  } catch (error) {
    console.error('❌ Full onboarding flow test failed:', error);
    return {
      success: false,
      message: `Test failed: ${error.message}`,
      results,
      testData: testUserData,
      error: error.message
    };
  }
};

// Quick test function for development
export const quickTestOnboarding = async () => {
  console.log('⚡ Quick Onboarding Test...');
  
  try {
    const result = await testFullOnboardingFlow();
    
    if (result.success) {
      console.log('🎉 Quick test PASSED!');
      return {
        success: true,
        message: 'Quick test passed - ready for manual testing',
        testData: result.testData
      };
    } else {
      console.log('❌ Quick test FAILED!');
      return {
        success: false,
        message: 'Quick test failed - check logs for details',
        error: result.error
      };
    }
  } catch (error) {
    console.error('❌ Quick test error:', error);
    return {
      success: false,
      message: 'Quick test error',
      error: error.message
    };
  }
};
