import React from 'react';
import { StyleSheet, ScrollView, View, Text, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, SPACING} from '../utils/theme';

const { width, height } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'AuthLanding'>;

const AuthLandingScreen = () => {
  const navigation = useNavigation<Nav>();

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
});
