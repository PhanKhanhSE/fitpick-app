import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RegisterUserInfo'>;

const RegisterUserInfoScreen = () => {
    const navigation = useNavigation<Nav>();
    const [fullName, setFullName] = useState('');

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <AppHeader title="Thông tin cá nhân" onBack={() => navigation.goBack()} />

            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={100}
            >
                {/* Avatar + nút camera */}
                <View style={styles.avatarWrap}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/140x140.png?text=+' }}
                        style={styles.avatar}
                        accessibilityLabel="Ảnh đại diện mặc định"
                    />
                    <TouchableOpacity
                        style={styles.cameraBadge}
                        activeOpacity={0.8}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <MaterialIcons name="photo-camera" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Họ và Tên */}
                <View style={styles.field}>
                    <Text style={styles.label}>Họ và Tên</Text>
                    <View style={styles.inputWrap}>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Tên đăng ký"
                            placeholderTextColor={COLORS.muted}
                            style={styles.input}
                            returnKeyType="next"
                            accessibilityLabel="Nhập họ và tên"
                        />
                    </View>
                </View>

                {/* Giới tính - Tuổi */}
                <View style={styles.row}>
                    <View style={[styles.field, styles.col]}>
                        <Text style={styles.label}>Giới tính</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                placeholder=""
                                placeholderTextColor={COLORS.muted}
                                style={[styles.input, styles.inputWithIcon]}
                                editable={false}
                                accessibilityLabel="Chọn giới tính"
                            />
                            <View pointerEvents="none" style={styles.rightIcon}>
                                <Ionicons name="chevron-down" size={18} color="#bbb" />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.field, styles.col]}>
                        <Text style={styles.label}>Tuổi</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                placeholder=""
                                placeholderTextColor={COLORS.muted}
                                keyboardType="number-pad"
                                inputMode="numeric"
                                maxLength={3}
                                style={styles.input}
                                accessibilityLabel="Nhập tuổi"
                            />
                            <View pointerEvents="none" style={styles.rightIcon}>
                                <Ionicons name="chevron-down" size={18} color="#bbb" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Chiều cao - Cân nặng */}
                <View style={styles.row}>
                    <View style={[styles.field, styles.col]}>
                        <Text style={styles.label}>Chiều cao</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                placeholder="Cm"
                                placeholderTextColor={COLORS.muted}
                                keyboardType="number-pad"
                                inputMode="numeric"
                                maxLength={3}
                                style={styles.input}
                                accessibilityLabel="Nhập chiều cao (cm)"
                            />
                        </View>
                    </View>

                    <View style={[styles.field, styles.col]}>
                        <Text style={styles.label}>Cân nặng</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                placeholder="Kg"
                                placeholderTextColor={COLORS.muted}
                                keyboardType="number-pad"
                                inputMode="numeric"
                                maxLength={3}
                                style={styles.input}
                                accessibilityLabel="Nhập cân nặng (kg)"
                            />
                        </View>
                    </View>
                </View>

                {/* Nơi sinh sống */}
                <View style={styles.field}>
                    <Text style={styles.label}>Nơi sinh sống</Text>
                    <View style={styles.inputWrap}>
                        <TextInput
                            placeholder="Quốc gia"
                            placeholderTextColor={COLORS.muted}
                            style={[styles.input, styles.inputWithIcon]}
                            editable={false}
                            accessibilityLabel="Chọn quốc gia"
                        />
                        <View pointerEvents="none" style={styles.rightIcon}>
                            <Ionicons name="chevron-down" size={18} color="#bbb" />
                        </View>
                    </View>
                </View>

                {/* Nút tiếp tục */}
                <View style={styles.cta}>
                    <AppButton
                        title="Tiếp tục"
                        onPress={() => navigation.navigate('RegisterGoals' as never)}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default RegisterUserInfoScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },

    container: {
        paddingHorizontal: SPACING.lg, // 24
        paddingTop: SPACING.lg,        // 24
        paddingBottom: SPACING.xl,     // 32
    },

    avatarWrap: { alignItems: 'center', marginBottom: 20 },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: '#EDEDED',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 4,
        right: 24,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.background,
    },

    field: { marginBottom: 14 },
    label: { fontSize: 13, color: '#222', marginBottom: 8 },

    inputWrap: { position: 'relative' },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: RADII.md,       // 24
        paddingHorizontal: 16,
        fontSize: 15,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
    inputWithIcon: { paddingRight: 36 },
    rightIcon: { position: 'absolute', right: 12, top: 13 },

    row: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },

    cta: { marginTop: 12 },
});