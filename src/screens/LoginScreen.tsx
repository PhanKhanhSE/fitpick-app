import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            {/* Logo */}
            <Text style={styles.logo}>FIT{"\n"}PICK</Text>

            {/* Nút đăng nhập */}
            <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>

            {/* Nút đăng ký */}
            <TouchableOpacity style={styles.signupButton}>
                <Text style={styles.signupText}>ĐĂNG KÝ</Text>
            </TouchableOpacity>

            {/* Link bỏ qua */}
            <TouchableOpacity>
                <Text style={styles.skipText}>Bỏ qua bước này?</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#F63E7C',
        marginBottom: 60,
        lineHeight: 52,
    },
    loginButton: {
        backgroundColor: '#F63E7C',
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 40,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signupButton: {
        borderColor: '#F63E7C',
        borderWidth: 2,
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 40,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    signupText: {
        color: '#F63E7C',
        fontWeight: 'bold',
        fontSize: 16,
    },
    skipText: {
        color: '#999',
        fontSize: 14,
    },
});
