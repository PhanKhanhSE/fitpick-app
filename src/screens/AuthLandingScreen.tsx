import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { Logo } from '../components/Logo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, SPACING } from '../utils/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AuthLanding'>;

const AuthLandingScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Logo />

        <AppButton
          title="ĐĂNG NHẬP"
          onPress={() => navigation.navigate('Login' as never)}
          filled
        />

        <AppButton
          title="ĐĂNG KÝ"
          onPress={() => navigation.navigate('Register')}
          filled={false}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl, // 32
    paddingBottom: SPACING.lg,     // 24
  },
});
