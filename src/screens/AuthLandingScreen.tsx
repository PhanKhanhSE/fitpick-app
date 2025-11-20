import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, SPACING} from '../utils/theme';
import { checkAuthStatus } from '../services/api';
import { userProfileAPI } from '../services/userProfileAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'AuthLanding'>;

const AuthLandingScreen = () => {
  const navigation = useNavigation<Nav>();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication and onboarding status on mount
  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      try {
        const authStatus = await checkAuthStatus();
        
        if (authStatus.isAuthenticated) {
          // User is logged in, check onboarding status
          try {
            const profileResponse = await userProfileAPI.getCurrentUserProfile();
            
            if (profileResponse.success && profileResponse.data) {
              const isOnboardingCompleted = profileResponse.data.isOnboardingCompleted;
              
              // If onboarding is not completed, redirect to onboarding flow
              if (!isOnboardingCompleted) {
                navigation.replace('UserInfo');
                return;
              }
              
              // If onboarding is completed, redirect to main app
              navigation.replace('MainTabs');
              return;
            }
          } catch (profileError: any) {
            // If we can't check profile (e.g., invalid token), clear auth and show landing page
            const errorMessage = profileError?.message || '';
            if (errorMessage.includes('Invalid token') || errorMessage.includes('401') || errorMessage.includes('403')) {
              // Token is invalid, clear auth data silently
              await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'userInfo']).catch(() => {});
            }
            // Don't log or show error, just allow user to see landing page
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndOnboarding();
  }, [navigation]);

  // Show loading indicator while checking auth
  if (isCheckingAuth) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo và Image Section - ở giữa phía trên */}
        <View style={styles.logoSection}>
          <View style={styles.imageContainer}>
            <ImageBackground 
              source={require('../assets/FitPick.png')} 
              style={styles.backgroundImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tagline}>Cá nhân hóa thực đơn lành mạnh</Text>
        </View>

        {/* Button Section - ở cuối màn hình, căn giữa */}
        <View style={styles.buttonSection}>
          <AppButton
            title="Đăng ký"
            onPress={() => navigation.navigate('Register')}
            filled
            style={styles.registerButton}
          />

          <AppButton
            title="Đăng nhập"
            onPress={() => navigation.navigate('Login' as never)}
            filled={false}
            style={styles.loginButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthLandingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: height * 0.1, // Khoảng cách từ top
    paddingBottom: height * 0.08, // Khoảng cách từ bottom
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    width: width * 0.5, // Logo chiếm 50% width màn hình
    height: width * 0.5, // Tỉ lệ vuông
    marginBottom: SPACING.lg,
    marginRight: SPACING.xl, // Dịch trái để căn giữa
    marginTop: SPACING.lg,
  },
  backgroundImage: {
    width: '110%',
    height: '110%',
  },
  appName: {
    fontSize: 48, // Font size lớn như trong hình
    fontWeight: 'bold',
    color: COLORS.primary, // Màu hồng FitPick
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center', // Căn giữa buttons
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  registerButton: {
    width: width * 0.6, // 60% width màn hình
    borderRadius: 25,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    alignSelf: 'center', // Đảm bảo button căn giữa
    elevation: 5,
  },
  loginButton: {
    width: width * 0.6, // 60% width màn hình
    borderRadius: 25,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    alignSelf: 'center', // Đảm bảo button căn giữa
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
