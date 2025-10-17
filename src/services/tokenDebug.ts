import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api';

export const debugTokenFlow = async () => {
  try {
    console.log('🧹 Clearing existing tokens...');
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

    const testEmail = `debug_token_${Date.now()}@example.com`;
    const testPassword = 'password123';

    console.log('📝 Registering test user...');
    const registerResponse = await apiClient.post('/api/auth/register', {
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    });
    
    if (!registerResponse.data.success) throw new Error('Register failed');
    console.log('✅ Register successful');

    console.log('🔑 Logging in...');
    const loginResponse = await apiClient.post('/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    
    if (!loginResponse.data.success) throw new Error('Login failed');
    console.log('✅ Login successful');

    const { token, refreshToken, user } = loginResponse.data.data;
    console.log('🔍 Tokens from login:', {
      token: token ? token.substring(0, 30) + '...' : 'NONE',
      refreshToken: refreshToken ? refreshToken.substring(0, 30) + '...' : 'NONE',
      user: user ? 'EXISTS' : 'NONE'
    });

    // Store tokens
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('💾 Tokens stored');

    // Verify storage
    const storedToken = await AsyncStorage.getItem('accessToken');
    console.log('🔍 Stored token verification:', storedToken ? storedToken.substring(0, 30) + '...' : 'NONE');

    // Test profile API call
    console.log('👤 Testing profile API call...');
    const profileResponse = await apiClient.get('/api/user/profile');
    console.log('✅ Profile API successful:', profileResponse.data);

    return { success: true, message: 'Token flow debug successful' };
  } catch (error: any) {
    console.error('❌ Token debug failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.message, error: error.response?.data || error };
  }
};
