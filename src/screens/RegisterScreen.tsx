import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { Logo } from '../components/Logo';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, RADII, FONTS } from '../utils/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation<Nav>();

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <AppHeader title="Đăng ký" onBack={() => navigation.goBack()} />

            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraHeight={80}
                extraScrollHeight={80}
            >
                <Logo />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={COLORS.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    returnKeyType="next"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor={COLORS.muted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    textContentType="password"
                    returnKeyType="next"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu"
                    placeholderTextColor={COLORS.muted}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    textContentType="password"
                    returnKeyType="done"
                />

                <AppButton title="ĐĂNG KÝ" onPress={() => navigation.navigate('RegisterUserInfo')} filled />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    scrollContainer: {
        backgroundColor: COLORS.background,
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: RADII.xl,
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: FONTS.base,
        marginBottom: SPACING.md,
        color: COLORS.text,
    },
});