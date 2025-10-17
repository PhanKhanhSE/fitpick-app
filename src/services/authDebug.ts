// Debug script để test authentication
import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugAuth = async () => {
  try {
    console.log('🔍 Starting Auth Debug...');
    
    // Clear existing tokens
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    console.log('🧹 Cleared existing tokens');
    
    // Register a test user
    const testEmail = `debug_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    console.log('📝 Registering test user:', testEmail);
    const registerResponse = await apiClient.post('/api/auth/register', {
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    });
    
    if (!registerResponse.data.success) {
      throw new Error('Register failed');
    }
    console.log('✅ Register successful');
    
    // Login
    console.log('🔑 Logging in...');
    const loginResponse = await apiClient.post('/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }
    console.log('✅ Login successful');
    
    // Extract token
    const { token, refreshToken, user } = loginResponse.data.data;
    console.log('🔍 Token received:', token ? 'YES' : 'NO');
    console.log('🔍 Token length:', token?.length || 0);
    console.log('🔍 Token preview:', token ? token.substring(0, 50) + '...' : 'NONE');
    
    // Store tokens manually
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('💾 Tokens stored manually');
    
    // Verify token is stored
    const storedToken = await AsyncStorage.getItem('accessToken');
    console.log('🔍 Token verification:', storedToken ? 'STORED' : 'NOT STORED');
    console.log('🔍 Stored token preview:', storedToken ? storedToken.substring(0, 50) + '...' : 'NONE');
    
    // Test profile endpoint with manual token
    console.log('👤 Testing profile endpoint with manual token...');
    
    // Method 1: Use apiClient (should auto-add token)
    try {
      const profileResponse1 = await apiClient.get('/api/user/profile');
      console.log('✅ Profile API (apiClient):', profileResponse1.data);
    } catch (error: any) {
      console.log('❌ Profile API (apiClient) failed:', {
        status: error.response?.status,
        message: error.message,
        headers: error.response?.headers,
      });
    }
    
    // Method 2: Manual request with token
    try {
      const manualResponse = await apiClient.get('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('✅ Profile API (manual):', manualResponse.data);
    } catch (error: any) {
      console.log('❌ Profile API (manual) failed:', {
        status: error.response?.status,
        message: error.message,
        headers: error.response?.headers,
      });
    }
    
    // Method 3: Test with fetch
    try {
      const fetchResponse = await fetch(`${apiClient.defaults.baseURL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      console.log('🔍 Fetch response status:', fetchResponse.status);
      console.log('🔍 Fetch response headers:', Object.fromEntries(fetchResponse.headers.entries()));
      
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        console.log('✅ Profile API (fetch):', data);
      } else {
        const errorText = await fetchResponse.text();
        console.log('❌ Profile API (fetch) failed:', errorText);
      }
    } catch (error: any) {
      console.log('❌ Profile API (fetch) error:', error.message);
    }
    
    return {
      success: true,
      token: token,
      message: 'Auth debug completed'
    };
    
  } catch (error: any) {
    console.error('❌ Auth debug failed:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};