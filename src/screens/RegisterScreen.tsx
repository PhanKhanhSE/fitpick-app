import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Logo } from '../components/Logo';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const insets = useSafeAreaInsets();
    const keyboardOffset = 56 + insets.top;

    const navigation = useNavigation();

    const handleRegister = () => {
        console.log('Đăng ký với:', email, password, confirmPassword);
    };

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đăng ký</Text>
            </View>

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
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <AppButton title="ĐĂNG KÝ" onPress={handleRegister} filled />
            </KeyboardAwareScrollView>
        </>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#eee',
        position: 'relative',
        paddingHorizontal: 16,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 32,
        paddingBottom: 24,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#F63E7C',
        borderRadius: 40,
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 16,
        color: '#000',
    },
});
