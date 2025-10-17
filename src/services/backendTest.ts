import apiClient from './api';

// Test connection to backend
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test basic connection
    const response = await apiClient.get('/');
    console.log('✅ Backend is running:', response.status);
    
    // Test if apiClient has post method
    console.log('🔍 Checking apiClient methods:', Object.getOwnPropertyNames(apiClient));
    console.log('🔍 apiClient.post exists:', typeof apiClient.post);
    
    return true;
  } catch (error: any) {
    console.error('❌ Backend connection failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return false;
  }
};

// Test profile API endpoint
export const testProfileEndpoint = async () => {
  try {
    console.log('🔍 Testing profile endpoint...');
    
    const testData = {
      fullName: 'Test User',
      gender: 'Male',
      age: 25,
      height: 175,
      weight: 70,
      targetWeight: 65,
    };
    
    const response = await apiClient.post('/api/user/profile', testData);
    console.log('✅ Profile endpoint works:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ Profile endpoint failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return false;
  }
};
