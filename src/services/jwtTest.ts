// Simple JWT token test
import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const testJWTToken = async () => {
  try {
    console.log('🔍 Testing JWT Token...');
    
    // Clear existing tokens
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    
    // Register and login
    const testEmail = `jwt_test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    console.log('📝 Registering:', testEmail);
    await apiClient.post('/api/auth/register', {
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    });
    
    console.log('🔑 Logging in...');
    const loginResponse = await apiClient.post('/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    
    const { token } = loginResponse.data.data;
    console.log('🔍 Token received:', token ? 'YES' : 'NO');
    console.log('🔍 Token length:', token?.length || 0);
    
    // Store token
    await AsyncStorage.setItem('accessToken', token);
    console.log('💾 Token stored');
    
    // Test profile endpoint
    console.log('👤 Testing profile endpoint...');
    const profileResponse = await apiClient.get('/api/user/profile');
    console.log('✅ Profile response:', profileResponse.data);
    
    return { success: true, message: 'JWT test successful' };
    
  } catch (error: any) {
    console.error('❌ JWT test failed:', error);
    return { 
      success: false, 
      message: error.message,
      status: error.response?.status,
      headers: error.response?.headers
    };
  }
};
