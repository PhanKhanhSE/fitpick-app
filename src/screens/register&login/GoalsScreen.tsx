import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { profileAPI } from '../../services/profileAPI';
import { userProfileAPI } from '../../services/userProfileAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type GoalKey = 'healthy' | 'lose' | 'gain' | 'gain weight' | 'target' | null;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Goals'>;

const GOALS = [
    { key: 'healthy' as const, title: 'Ăn uống lành mạnh' },
    { key: 'lose' as const, title: 'Giảm cân' },
    { key: 'gain' as const, title: 'Tăng cơ'},
    { key: 'gain weight' as const, title: 'Tăng cân' },
    { key: 'target' as const, title: 'Duy trì cân nặng' },
];

const GoalsScreen = () => {
    const navigation = useNavigation<Nav>(); 
    const [selected, setSelected] = useState<GoalKey>(null);
    const [otherText, setOtherText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentGoal, setCurrentGoal] = useState<string>('');

    // Load current goal when component mounts
    useEffect(() => {
        loadCurrentGoal();
    }, []);

    const loadCurrentGoal = async () => {
        try {
            // Check if this is settings flow
            const isSettingsFlow = navigation.getState().routes.some(route => 
                route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
            );

            if (isSettingsFlow) {
                // Try to get from API first
                try {
                    const profileResponse = await profileAPI.getUserProfile();
                    if (profileResponse.data?.goal) {
                        setCurrentGoal(profileResponse.data.goal);
                        // Map goal to selected state
                        const goalKey = mapGoalToKey(profileResponse.data.goal);
                        if (goalKey) {
                            setSelected(goalKey);
                            // If it's target goal and we have otherGoal, load it
                            if (goalKey === 'target' && profileResponse.data.otherGoal) {
                                setOtherText(profileResponse.data.otherGoal);
                            }
                        }
                    }
                } catch (error) {

                    // Fallback to AsyncStorage
                    const storedGoal = await AsyncStorage.getItem('userGoal');
                    if (storedGoal) {
                        setCurrentGoal(storedGoal);
                        const goalKey = mapGoalToKey(storedGoal);
                        if (goalKey) {
                            setSelected(goalKey);
                        }
                    }
                }
            }
        } catch (error) {

        }
    };

    const mapGoalToKey = (goal: string): GoalKey | null => {
        const lowerGoal = goal.toLowerCase();
        
        // More specific matching to avoid conflicts
        if (lowerGoal.includes('tăng cơ') || lowerGoal.includes('gain muscle')) return 'gain';
        if (lowerGoal.includes('tăng cân') || lowerGoal.includes('gain weight')) return 'gain weight';
        if (lowerGoal.includes('giảm cân') || lowerGoal.includes('lose weight') || lowerGoal.includes('lose')) return 'lose';
        if (lowerGoal.includes('duy trì') || lowerGoal.includes('maintain') || lowerGoal.includes('target')) return 'target';
        if (lowerGoal.includes('lành mạnh') || lowerGoal.includes('healthy') || lowerGoal.includes('ăn uống')) return 'healthy';
        
        return null; // Custom goal
    };

    const canContinue = useMemo(() => {
        return selected !== null;
    }, [selected]);

    const handleContinue = async () => {
        if (!canContinue) {
            Alert.alert('Thông báo', 'Vui lòng chọn mục tiêu để tiếp tục');
            return;
        }

        // Kiểm tra nếu đang ở trong flow cài đặt
        const isSettingsFlow = navigation.getState().routes.some(route => 
            route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
        );
        
        if (isSettingsFlow) {
            // Nếu đang trong settings, lưu mục tiêu và quay lại
            setIsLoading(true);
            try {
                const goalData = {
                    goal: selected || 'other',
                    otherGoal: otherText || undefined,
                };
                
                
                await profileAPI.saveUserGoals(goalData);
                
                // Also save to AsyncStorage for fallback
                const goalText = GOALS.find(g => g.key === selected)?.title || selected || 'other';
                await AsyncStorage.setItem('userGoal', goalText);
                
                // Kiểm tra xem user đã có đủ thông tin để hoàn tất onboarding chưa
                try {
                    const profileResponse = await userProfileAPI.getCurrentUserProfile();
                    if (profileResponse.success && profileResponse.data) {
                        const profile = profileResponse.data;
                        const hasAllInfo = profile.goal && 
                                          profile.dietPlan && 
                                          profile.cookingLevel && 
                                          profile.activityLevel &&
                                          profile.fullname &&
                                          profile.age &&
                                          profile.height &&
                                          profile.weight;
                        
                        // Nếu có đủ thông tin nhưng chưa hoàn tất onboarding, hoàn tất nó
                        if (hasAllInfo && !profile.isOnboardingCompleted) {
                            await profileAPI.completeOnboarding();
                            Alert.alert('Thành công', 'Mục tiêu đã được cập nhật và hồ sơ đã hoàn tất!');
                        } else {
                            Alert.alert('Thành công', 'Mục tiêu đã được cập nhật');
                        }
                    } else {
                        Alert.alert('Thành công', 'Mục tiêu đã được cập nhật');
                    }
                } catch (checkError) {
                    // Nếu check thất bại, chỉ hiển thị thông báo thành công
                    Alert.alert('Thành công', 'Mục tiêu đã được cập nhật');
                }
                
                navigation.goBack();
            } catch (error: any) {

                const errorMessage = error?.message || 'Cập nhật mục tiêu thất bại. Vui lòng thử lại.';
                Alert.alert('Lỗi', errorMessage);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Nếu đang trong flow đăng ký, tiếp tục đến màn hình Lifestyle
            setIsLoading(true);
            try {
                const goalData = {
                    goal: selected || 'other',
                    otherGoal: otherText || undefined,
                };
                
                
                await profileAPI.saveUserGoals(goalData);
                
                // Also save to AsyncStorage for fallback
                const goalText = GOALS.find(g => g.key === selected)?.title || selected || 'other';
                await AsyncStorage.setItem('userGoal', goalText);
                
                navigation.navigate('Lifestyle');
            } catch (error: any) {

                const errorMessage = error?.message || 'Lưu mục tiêu thất bại. Vui lòng thử lại.';
                Alert.alert('Lỗi', errorMessage);
            } finally {
                setIsLoading(false);
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
                <Text style={styles.headerTitle}>Mục tiêu</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.description}>Chọn mục tiêu bạn mong muốn:</Text>
                    
                    {/* Current Goal Display */}
                    {currentGoal && (
                        <View style={styles.currentGoalContainer}>
                            <Text style={styles.currentGoalLabel}>Mục tiêu hiện tại:</Text>
                            <Text style={styles.currentGoalText}>{currentGoal}</Text>
                        </View>
                    )}

                    <View style={styles.optionsContainer}>
                        {GOALS.map(item => (
                            <TouchableOpacity
                                key={item.key}
                                style={[
                                    styles.optionCard,
                                    selected === item.key && styles.optionCardSelected
                                ]}
                                activeOpacity={0.7}
                                onPress={() => setSelected(item.key)}
                            >
                                <View style={styles.optionContent}>
                                    <Text style={[
                                        styles.optionTitle,
                                        selected === item.key && styles.optionTitleSelected
                                    ]}>
                                        {item.title}
                                    </Text>
                                </View>

                                <View style={[
                                    styles.radioButton,
                                    selected === item.key && styles.radioButtonSelected
                                ]}>
                                    {selected === item.key && (
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                <AppButton 
                    title={isLoading 
                        ? (navigation.getState().routes.some(route => 
                            route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
                        ) ? "Đang lưu..." : "Đang tiếp tục...")
                        : (navigation.getState().routes.some(route => 
                            route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
                        ) ? "Lưu" : "Tiếp tục")
                    }
                    onPress={handleContinue} 
                    filled 
                    style={StyleSheet.flatten([
                        styles.continueButton,
                        (!canContinue || isLoading) && styles.continueButtonDisabled
                    ])}
                />
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default GoalsScreen;

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
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    description: {
        fontSize: 16,
        color: COLORS.textStrong,
        marginBottom: SPACING.xl,
        fontWeight: '500',
    },
    optionsContainer: {
        flex: 1,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: RADII.md,
        backgroundColor: '#F9FAFB',
    },
    optionCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#FEF2F2',
    },
    optionContent: {
        flex: 1,
        marginRight: SPACING.md,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textStrong,
        marginBottom: 4,
    },
    optionTitleSelected: {
        color: COLORS.primary,
    },
    optionSubtitle: {
        fontSize: 14,
        color: COLORS.textDim,
        lineHeight: 20,
    },
    optionSubtitleSelected: {
        color: COLORS.primary,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    radioButtonSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },
    currentGoalContainer: {
        backgroundColor: '#F0F9FF',
        borderWidth: 1,
        borderColor: '#0EA5E9',
        borderRadius: RADII.md,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
    },
    currentGoalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0369A1',
        marginBottom: SPACING.xs,
    },
    currentGoalText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0C4A6E',
    },
    buttonContainer: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xl,
        paddingTop: SPACING.lg,
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
    continueButtonDisabled: {
        opacity: 0.5,
    },
});