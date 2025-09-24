import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'RegisterUserInfo'>;

const RegisterUserInfoScreen = () => {
    const navigation = useNavigation<Nav>();
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={COLORS.textStrong} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={100}
            >
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={60} color="#6B7280" />
                        </View>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    {/* Tên */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên</Text>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Tên của bạn"
                            placeholderTextColor="#9CA3AF"
                            style={styles.input}
                            returnKeyType="next"
                        />
                    </View>

                    {/* Row 1: Giới tính - Tuổi */}
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Giới tính</Text>
                            <TouchableOpacity style={styles.dropdownInput}>
                                <Text style={styles.dropdownPlaceholder}></Text>
                                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Tuổi</Text>
                            <TextInput
                                value={age}
                                onChangeText={setAge}
                                placeholder="Nhập độ tuổi"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    {/* Row 2: Chiều cao - Cân nặng */}
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Chiều cao</Text>
                            <TextInput
                                value={height}
                                onChangeText={setHeight}
                                placeholder="cm"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                keyboardType="number-pad"
                            />
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Cân nặng</Text>
                            <TextInput
                                value={weight}
                                onChangeText={setWeight}
                                placeholder="kg"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Button */}
                <View style={styles.buttonContainer}>
                    <AppButton
                        title="Tiếp tục"
                        onPress={() => navigation.navigate('RegisterGoals' as never)}
                        filled
                        style={styles.continueButton}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default RegisterUserInfoScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background,
    },
    backButton: {
        padding: SPACING.sm,
        marginRight: SPACING.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textStrong,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xl,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.background,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textStrong,
        marginBottom: SPACING.sm,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: RADII.sm,
        paddingHorizontal: SPACING.md,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: '#F9FAFB',
    },
    row: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    halfInput: {
        flex: 1,
    },
    dropdownInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: RADII.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: '#F9FAFB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    buttonContainer: {
        paddingTop: SPACING.xl,
    },
    continueButton: {
        width: '100%',
        borderRadius: 25,
        paddingVertical: 16,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
    },
});