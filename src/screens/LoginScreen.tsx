import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, SPACING, RADII, FONTS } from '../utils/theme';
import { Logo } from '../components/Logo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const PINK = COLORS?.primary ?? '#F63E7C';

const LoginScreen = () => {
    const navigation = useNavigation<Nav>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const onLogin = () => {
        // TODO: call API login
        console.log({ email, password, remember });
        navigation.replace('MainTabs');
    };

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <AppHeader title="Đăng nhập" onBack={() => navigation.goBack()} />

            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraHeight={80}
                extraScrollHeight={80}
            >
                <Logo />

                {/* Email */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={COLORS.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="next"
                />

                {/* Mật khẩu */}
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor={COLORS.muted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                />

                {/* Lưu mật khẩu / Quên mật khẩu? */}
                <View style={styles.row}>
                    <TouchableOpacity style={styles.rememberWrap} onPress={() => setRemember(v => !v)} activeOpacity={0.8}>
                        <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                            {remember && <View style={styles.checkboxDot} />}
                        </View>
                        <Text style={styles.rememberText}>Lưu mật khẩu</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity onPress={() => { /* navigate forgot */ }}>
                        <Text style={styles.forgot}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>

                {/* CTA */}
                <View style={{ width: '100%', marginTop: 12 }}>
                    <AppButton title="ĐĂNG NHẬP" onPress={onLogin} filled />
                </View>

                {/* Link đăng ký */}
                <Text style={styles.signup}>
                    Bạn chưa có tài khoản?{' '}
                    <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>
                        ĐĂNG KÝ NGAY
                    </Text>
                </Text>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default LoginScreen;

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
        height: 48,
        borderWidth: 1,
        borderColor: PINK,
        borderRadius: RADII.xl,
        paddingHorizontal: 20,
        fontSize: FONTS.base,
        color: COLORS.text,
        backgroundColor: '#fff',
        marginBottom: SPACING.md,
    },

    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 8,
    },
    rememberWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        paddingRight: 8,
    },
    rememberText: {
        fontSize: 12,
        color: '#222',
        lineHeight: 14,
        paddingRight: 2,
        fontFamily: 'sans-serif',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 3,
        borderWidth: 1.6,
        borderColor: '#BDBDBD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkboxActive: { borderColor: PINK },
    checkboxDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: PINK },
    forgot: { fontSize: 12, color: '#666', paddingRight: 2, fontFamily: 'sans-serif' },

    signup: { marginTop: 14, fontSize: 13, color: '#333' },
    signupLink: { color: PINK, fontWeight: '700' },
});