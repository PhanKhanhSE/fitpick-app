import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { Logo } from '../components/Logo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Logo />

        {/* Nút đăng nhập */}
        <AppButton
          title="ĐĂNG NHẬP"
          onPress={() => console.log('Đăng nhập')}
          filled
        />

        {/* Nút đăng ký */}
        <AppButton
          title="ĐĂNG KÝ"
          onPress={() => navigation.navigate('Register')}
          filled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  logo: {
    fontSize: 68,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#F63E7C',
    marginBottom: 150,
    lineHeight: 68,
  },
});