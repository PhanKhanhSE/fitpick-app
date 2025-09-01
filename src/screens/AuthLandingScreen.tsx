import React from 'react';
import { StyleSheet, ScrollView, View, Text, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { Logo } from '../components/Logo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, SPACING, RADII } from '../utils/theme';

const { width, height } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'AuthLanding'>;

const AuthLandingScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Logo />
          <Text style={styles.welcomeText}>Chào mừng đến với FitPick</Text>
          <Text style={styles.subtitleText}>Ứng dụng gợi ý món ăn phù hợp với lối sống của bạn</Text>
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <AppButton
            title="ĐĂNG NHẬP"
            onPress={() => navigation.navigate('Login' as never)}
            filled
            style={styles.loginButton}
          />

          <AppButton
            title="ĐĂNG KÝ"
            onPress={() => navigation.navigate('Register')}
            filled={false}
            style={styles.registerButton}
          />
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Bắt đầu hành trình khỏe mạnh của bạn ngay hôm nay!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthLandingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  buttonSection: {
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  loginButton: {
    width: '100%',
    marginBottom: SPACING.md,
    borderRadius: 25,
    paddingVertical: SPACING.md,
  },
  registerButton: {
    width: '100%',
    borderRadius: 25,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  footerSection: {
    paddingBottom: SPACING.lg,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
