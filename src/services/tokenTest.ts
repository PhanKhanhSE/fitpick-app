import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api';

// Test token storage and usage
export const testTokenFlow = async () => {
  try {
    console.log('🔍 Testing Token Flow...');
    
    // Step 1: Clear any existing tokens
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    console.log('🧹 Cleared existing tokens');
    
    // Step 2: Register a test user
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = '123456';
    
    console.log('📝 Registering test user...');
    const registerResponse = await apiClient.post('/api/auth/register', {
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    });
    
    if (!registerResponse.data.success) {
      throw new Error('Register failed');
    }
    console.log('✅ Register successful');
    
    // Step 3: Login to get token
    console.log('🔑 Logging in...');
    const loginResponse = await apiClient.post('/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }
    
    const { token, refreshToken, user } = loginResponse.data.data;
    console.log('✅ Login successful');
    
    // Step 4: Store tokens manually
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('💾 Tokens stored manually');
    
    // Step 5: Verify token is stored
    const storedToken = await AsyncStorage.getItem('accessToken');
    console.log('🔍 Token verification:', storedToken ? 'STORED' : 'NOT STORED');
    console.log('🔍 Token preview:', storedToken ? storedToken.substring(0, 20) + '...' : 'NONE');
    
    // Step 6: Test profile API with token
    console.log('👤 Testing profile API...');
    const profileResponse = await apiClient.post('/api/user/profile', {
      fullName: 'Test User',
      gender: 'Male',
      age: 25,
      height: 175,
      weight: 70,
      targetWeight: 65,
    });
    
    console.log('✅ Profile API test result:', profileResponse.data);
    return {
      success: true,
      message: 'Token flow test passed',
      token: storedToken ? 'STORED' : 'NOT STORED'
    };
    
  } catch (error: any) {
    console.error('❌ Token flow test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    return {
      success: false,
      message: `Token flow test failed: ${error.message}`,
      error: error.response?.data || error.message
    };
  }
};
