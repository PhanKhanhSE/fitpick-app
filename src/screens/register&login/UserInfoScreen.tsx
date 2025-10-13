import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfoScreen = () => {
    const navigation = useNavigation<Nav>();
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [targetWeight, setTargetWeight] = useState('');
    const [select, setSelected] = useState('');

    // Kiểm tra form hợp lệ
    const isFormValid = fullName.trim() && gender && age.trim() && height.trim() && weight.trim() && targetWeight.trim();
    
    const handleContinue = () => {
        // Kiểm tra nếu đang ở trong flow cài đặt (có thể check route params hoặc navigation stack)
        const isSettingsFlow = navigation.getState().routes.some(route => 
            route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
        );
        
        if (isSettingsFlow) {
            // Nếu đang trong settings, lưu thông tin và quay lại
            // TODO: Thêm logic lưu thông tin tại đây
            console.log('Lưu thông tin cá nhân:', { fullName, gender, age, height, weight, targetWeight });
            navigation.goBack();
        } else {
            // Nếu đang trong flow đăng ký, kiểm tra thông tin cần thiết và tiếp tục
            if (fullName.trim() && age.trim() && height.trim() && weight.trim()) {
                navigation.navigate('Goals' as never);
            } else {
                // Hiển thị thông báo lỗi nếu thiếu thông tin
                Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin cá nhân');
            }
        }
    };

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
                            <TouchableOpacity 
                                style={styles.dropdownInput}
                                onPress={() => setShowGenderPicker(!showGenderPicker)}
                            >
                                <Text style={[styles.dropdownPlaceholder, gender && styles.dropdownSelected]}>
                                    {gender || 'Chọn giới tính'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                            {showGenderPicker && (
                                <View style={styles.pickerContainer}>
                                    <TouchableOpacity 
                                        style={styles.pickerItem}
                                        onPress={() => {
                                            setGender('Nam');
                                            setShowGenderPicker(false);
                                        }}
                                    >
                                        <Text style={styles.pickerItemText}>Nam</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.pickerItem}
                                        onPress={() => {
                                            setGender('Nữ');
                                            setShowGenderPicker(false);
                                        }}
                                    >
                                        <Text style={styles.pickerItemText}>Nữ</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Tuổi</Text>
                            <TextInput
                                value={age}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setAge(numericValue);
                                }}
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
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setHeight(numericValue);
                                }}
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
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setWeight(numericValue);
                                }}
                                placeholder="kg"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    {/* Row 3: Cân nặng mục tiêu */}
                    <View style={styles.row}>
                        <View style={styles.fullInput}>
                            <Text style={styles.label}>Cân nặng mục tiêu (kg)</Text>
                            <TextInput
                                value={targetWeight}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setTargetWeight(numericValue);
                                }}
                                placeholder="Nhập cân nặng mục tiêu"
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
                        title={navigation.getState().routes.some(route => 
                            route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
                        ) ? "Lưu" : "Tiếp tục"}
                        onPress={handleContinue}
                        filled
                        style={StyleSheet.flatten([
                            styles.continueButton,
                            !isFormValid && styles.continueButtonDisabled
                        ])}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default UserInfoScreen;

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
    dropdownSelected: {
        color: COLORS.text,
    },
    pickerContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: RADII.sm,
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        zIndex: 1000,
        elevation: 3,
    },
    pickerItem: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    pickerItemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    fullInput: {
        flex: 1,
    },
    buttonContainer: {
        paddingTop: SPACING.xl,
    },
    continueButton: {
        width: '100%',
        borderRadius: RADII.umd,
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
    continueButtonDisabled: {
        opacity: 0.5,
        shadowOpacity: 0,
        elevation: 0,
    },
});