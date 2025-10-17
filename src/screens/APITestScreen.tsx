import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { authAPI, testAPIConnection, testBasicConnection, testRootConnection, testLoginWithVerifiedAccount, testData } from '../services/apiTest';
import { testFullOnboardingFlow, quickTestOnboarding } from '../services/fullFlowTest';
import { testBackendConnection, testProfileEndpoint } from '../services/backendTest';
import { testTokenFlow } from '../services/tokenTest';
import { testAuthWithManualToken, testDatabaseTables } from '../services/authDebug';
import { debugAuth } from '../services/authDebug';
import { testJWTToken } from '../services/jwtTest';
import { debugTokenFlow } from '../services/tokenDebug';
import { testCompleteOnboardingFlow, testRegistrationFlow } from '../services/onboardingFlowTest';

const APITestScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Anonymous function to test connection directly
  const testConnectionAnonymous = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing connection with anonymous function...');
      
      // Test multiple endpoints
      const endpoints = [
        { name: 'Root (/)', url: 'https://01eea5df5d3c.ngrok-free.app/' },
        { name: 'Index.html', url: 'https://01eea5df5d3c.ngrok-free.app/index.html' },
        { name: 'API Register', url: 'https://01eea5df5d3c.ngrok-free.app/api/auth/register' }
      ];
      
      let allPassed = true;
      
      for (const endpoint of endpoints) {
        try {
          addResult(`🔍 Testing ${endpoint.name}...`);
          
          const response = await fetch(endpoint.url, {
            method: 'GET',
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
            },
          });
          
          addResult(`✅ ${endpoint.name}: ${response.status} ${response.statusText}`);
          
          if (!response.ok && response.status !== 404) {
            allPassed = false;
          }
        } catch (error) {
          addResult(`❌ ${endpoint.name}: ${error}`);
          allPassed = false;
        }
      }
      
      if (allPassed) {
        addResult('✅ All connection tests passed!');
        Alert.alert('Success', 'Connection test passed! Backend is reachable.');
      } else {
        addResult('⚠️ Some tests failed, but backend is reachable');
        Alert.alert('Partial Success', 'Backend is reachable, some endpoints may have issues.');
      }
    } catch (error) {
      addResult(`❌ Connection test failed: ${error}`);
      Alert.alert('Error', `Connection test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestBasicConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing basic connection...');
      const success = await testBasicConnection();
      
      if (success) {
        addResult('✅ Basic connection test passed!');
        Alert.alert('Success', 'Basic connection test passed!');
      } else {
        addResult('❌ Basic connection test failed!');
        Alert.alert('Error', 'Basic connection test failed! Check if backend is running.');
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
      Alert.alert('Error', `Basic connection test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Starting API connection test...');
      const success = await testAPIConnection();
      
      if (success) {
        addResult('✅ API connection test completed successfully!');
        Alert.alert('Success', 'API connection test passed!');
      } else {
        addResult('❌ API connection test failed!');
        Alert.alert('Error', 'API connection test failed!');
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
      Alert.alert('Error', `Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRegister = async () => {
    setIsLoading(true);
    addResult('📝 Testing register endpoint...');
    
    try {
      const response = await authAPI.register(
        testData.register.email,
        testData.register.password,
        testData.register.confirmPassword
      );
      
      addResult(`✅ Register successful: ${response.message}`);
      Alert.alert('Success', 'Register test passed!');
    } catch (error: any) {
      addResult(`❌ Register failed: ${error.message || error}`);
      Alert.alert('Error', `Register test failed: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    addResult('🔑 Testing login endpoint...');
    
    try {
      const response = await authAPI.login(
        testData.login.email,
        testData.login.password
      );
      
      addResult(`✅ Login successful: ${response.message}`);
      Alert.alert('Success', 'Login test passed!');
    } catch (error: any) {
      addResult(`❌ Login failed: ${error.message || error}`);
      Alert.alert('Error', `Login test failed: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestVerifiedLogin = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔑 Testing login with verified accounts...');
      const result = await testLoginWithVerifiedAccount();
      
      if (result) {
        addResult('✅ Login with verified account successful!');
        Alert.alert('Success', 'Login with verified account passed!');
      } else {
        addResult('ℹ️ No verified accounts found (normal for fresh setup)');
        Alert.alert('Info', 'No verified accounts found. This is normal for a fresh setup.');
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
      Alert.alert('Error', `Verified login test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const handleQuickTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('⚡ Starting Quick Onboarding Test...');
      
      const result = await quickTestOnboarding();
      
      if (result.success) {
        addResult('🎉 Quick test PASSED!');
        addResult(`📊 Test Data: ${result.testData.email}`);
        addResult('✅ Ready for manual testing!');
        Alert.alert('Success', 'Quick test passed! Ready for manual testing.');
      } else {
        addResult(`❌ Quick test failed: ${result.message}`);
        if (result.error) {
          addResult(`Error: ${result.error}`);
        }
        Alert.alert('Error', `Quick test failed: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackendTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing Backend Connection...');
      
      const connectionResult = await testBackendConnection();
      
      if (connectionResult) {
        addResult('✅ Backend connection successful');
        
        addResult('🔍 Testing Profile Endpoint...');
        const profileResult = await testProfileEndpoint();
        
        if (profileResult) {
          addResult('✅ Profile endpoint works');
          Alert.alert('Success', 'Backend is working correctly!');
        } else {
          addResult('❌ Profile endpoint failed');
          Alert.alert('Error', 'Profile endpoint failed - check authentication');
        }
      } else {
        addResult('❌ Backend connection failed');
        Alert.alert('Error', 'Backend connection failed - check if backend is running');
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing Token Flow...');
      
      const result = await testTokenFlow();
      
      if (result.success) {
        addResult('✅ Token flow test PASSED!');
        addResult(`🔍 Token status: ${result.token}`);
        Alert.alert('Success', 'Token flow is working correctly!');
      } else {
        addResult(`❌ Token flow test failed: ${result.message}`);
        if (result.error) {
          addResult(`Error: ${JSON.stringify(result.error)}`);
        }
        Alert.alert('Error', `Token flow test failed: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugAuth = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Starting Detailed Auth Debug...');
      
      const result = await debugAuth();
      
      if (result.success) {
        addResult('✅ Auth debug completed successfully!');
        addResult(`🔍 Token: ${result.token?.substring(0, 50)}...`);
        Alert.alert('Success', 'Auth debug completed - check logs for details');
      } else {
        addResult(`❌ Auth debug failed: ${result.message}`);
        Alert.alert('Error', `Auth debug failed: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJWTTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing JWT Token...');
      
      const result = await testJWTToken();
      
      if (result.success) {
        addResult('✅ JWT test successful!');
        Alert.alert('Success', 'JWT authentication is working!');
      } else {
        addResult(`❌ JWT test failed: ${result.message}`);
        addResult(`🔍 Status: ${result.status}`);
        Alert.alert('Error', `JWT test failed: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenDebug = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Debugging Token Flow...');
      
      const result = await debugTokenFlow();
      
      if (result.success) {
        addResult('✅ Token debug successful!');
        Alert.alert('Success', 'Token flow is working correctly!');
      } else {
        addResult(`❌ Token debug failed: ${result.message}`);
        Alert.alert('Error', `Token debug failed: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthDebug = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing Authentication Debug...');
      
      // Test 1: Manual token authentication
      addResult('🔑 Testing manual token auth...');
      const authResult = await testAuthWithManualToken();
      
      if (authResult.success) {
        addResult('✅ Manual token auth PASSED!');
        addResult(`🔍 Token: ${authResult.token}`);
      } else {
        addResult(`❌ Manual token auth failed: ${authResult.message}`);
      }
      
      // Test 2: Database tables
      addResult('🗄️ Testing database tables...');
      const dbResult = await testDatabaseTables();
      
      if (dbResult.success) {
        addResult('✅ Database tables exist');
        addResult(`🔍 Diet plans: ${dbResult.dietPlans}, Cooking levels: ${dbResult.cookingLevels}`);
      } else {
        addResult(`❌ Database tables failed: ${dbResult.message}`);
      }
      
      if (authResult.success && dbResult.success) {
        Alert.alert('Success', 'Authentication and database are working!');
      } else {
        Alert.alert('Error', 'Some tests failed - check logs for details');
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationFlowTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    try {
      addResult('🚀 Testing Registration Flow...');
      const result = await testRegistrationFlow();
      if (result.success) {
        addResult('✅ Registration flow test PASSED!');
        addResult(`📧 Test email: ${result.data.email}`);
        addResult(`🔑 Token stored: ${result.data.tokenStored}`);
        Alert.alert('Success', 'Registration flow is working correctly!');
      } else {
        addResult(`❌ Registration flow test failed: ${result.message}`);
        Alert.alert('Error', `Registration flow test failed: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboardingTest = async () => {
    setIsLoading(true);
    setTestResults([]);
    try {
      addResult('🚀 Testing Complete Onboarding Flow...');
      const result = await testCompleteOnboardingFlow();
      if (result.success) {
        addResult('✅ Complete onboarding flow test PASSED!');
        addResult(`📧 Test email: ${result.data.email}`);
        addResult('🎉 All onboarding steps completed successfully!');
        Alert.alert('Success', 'Complete onboarding flow is working correctly!');
      } else {
        addResult(`❌ Complete onboarding flow test failed: ${result.message}`);
        Alert.alert('Error', `Complete onboarding flow test failed: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`);
      Alert.alert('Error', `Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API Test Screen</Text>
        <Text style={styles.subtitle}>Test API connection with ngrok (Email verification disabled)</Text>
        <Text style={styles.url}>URL: https://01eea5df5d3c.ngrok-free.app</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.anonymousButton]}
          onPress={testConnectionAnonymous}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : '🔗 Anonymous Connection Test'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.basicButton]}
          onPress={handleTestBasicConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : '🔗 Test Basic Connection'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleTestConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : '🧪 Test Full API'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={handleQuickTest}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : '⚡ Quick Onboarding Test'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.warningButton]}
          onPress={handleBackendTest}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : '🔧 Test Backend Connection'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={handleTokenTest}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : '🔑 Test Token Flow'}
          </Text>
        </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.dangerButton]}
                  onPress={handleDebugAuth}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Testing...' : '🔍 Debug Authentication'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.warningButton]}
                  onPress={handleAuthDebug}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Testing...' : '🔧 Auth Debug (Original)'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={handleJWTTest}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Testing...' : '🔐 Test JWT Token'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.infoButton]}
                  onPress={handleTokenDebug}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Debugging...' : '🔍 Debug Token Flow'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.successButton]}
                  onPress={handleRegistrationFlowTest}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Testing...' : '🚀 Test Registration Flow'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.warningButton]}
                  onPress={handleCompleteOnboardingTest}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Testing...' : '🎉 Test Complete Onboarding'}
                  </Text>
                </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleTestRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleTestLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.length === 0 ? (
          <Text style={styles.noResults}>No test results yet</Text>
        ) : (
          testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  url: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#F63E7C',
  },
  basicButton: {
    backgroundColor: '#34C759',
  },
  anonymousButton: {
    backgroundColor: '#FF9500',
  },
  secondaryButton: {
    backgroundColor: '#007AFF',
  },
  verifiedButton: {
    backgroundColor: '#5856D6',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  warningButton: {
    backgroundColor: '#FF9800',
  },
  infoButton: {
    backgroundColor: '#2196F3',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    minHeight: 200,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noResults: {
    color: '#999',
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});

export default APITestScreen;
