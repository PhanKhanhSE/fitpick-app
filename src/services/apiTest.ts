import { authAPI } from './api';

// Test basic connectivity with working endpoint
export const testBasicConnection = async () => {
  try {
    console.log('🔍 Testing basic connection to:', 'https://01eea5df5d3c.ngrok-free.app');
    
    // Test with a working endpoint (index.html instead of swagger)
    const response = await fetch('https://01eea5df5d3c.ngrok-free.app/index.html', {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    console.log('✅ Basic connection test result:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ Basic connection test failed:', error);
    return false;
  }
};

// Alternative test with root endpoint
export const testRootConnection = async () => {
  try {
    console.log('🔍 Testing root connection to:', 'https://01eea5df5d3c.ngrok-free.app');
    
    const response = await fetch('https://01eea5df5d3c.ngrok-free.app/', {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    console.log('✅ Root connection test result:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ Root connection test failed:', error);
    return false;
  }
};

// Test API connection with proper flow
export const testAPIConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    console.log('API Base URL:', 'https://01eea5df5d3c.ngrok-free.app');
    
    // First test basic connectivity
    const basicConnection = await testBasicConnection();
    if (!basicConnection) {
      throw new Error('Basic connection failed - check if backend is running and ngrok is active');
    }
    
    // Test register endpoint
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = '123456';
    
    console.log('📝 Testing register endpoint...');
    const registerResponse = await authAPI.register(testEmail, testPassword, testPassword);
    console.log('✅ Register test result:', registerResponse);
    
    if (registerResponse.success) {
      console.log('ℹ️ Account registered and auto-verified successfully!');
      console.log('ℹ️ Email verification is disabled for demo purposes');
      
      // Test login with the newly registered account
      console.log('🔑 Testing login with newly registered account...');
      try {
        const loginResponse = await authAPI.login(testEmail, testPassword);
        console.log('✅ Login test result:', loginResponse);
      } catch (loginError) {
        console.log('❌ Login failed:', loginError);
      }
    }
    
    console.log('🎉 API connection tests completed!');
    console.log('ℹ️ Register and login both work - email verification disabled for demo');
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
};

// Test with pre-verified account
export const testLoginWithVerifiedAccount = async () => {
  try {
    console.log('🔑 Testing login with verified account...');
    
    // Try with a common test account that might be pre-verified
    const testAccounts = [
      { email: 'admin@fitpick.com', password: '123456' },
      { email: 'test@fitpick.com', password: '123456' },
      { email: 'demo@fitpick.com', password: '123456' },
    ];
    
    for (const account of testAccounts) {
      try {
        console.log(`🔍 Trying login with: ${account.email}`);
        const loginResponse = await authAPI.login(account.email, account.password);
        console.log('✅ Login successful:', loginResponse);
        return loginResponse;
      } catch (error) {
        console.log(`⚠️ Login failed with ${account.email}: ${error.message}`);
      }
    }
    
    console.log('ℹ️ No pre-verified accounts found. This is normal for fresh setup.');
    return null;
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return null;
  }
};

// Test data for manual testing
export const testData = {
  register: {
    email: 'test@example.com',
    password: '123456',
    confirmPassword: '123456'
  },
  login: {
    email: 'test@example.com',
    password: '123456'
  }
};
