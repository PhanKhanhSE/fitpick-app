import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { profileAPI } from '../../services/profileAPI';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'EatStyle'>;

type DietPlanKey = 'balanced' | 'low_carb' | 'keto' | 'gluten_free' | 'dairy_free' | null;

// Mapping từ frontend keys sang database names
const DIET_PLAN_MAPPING: Record<string, string> = {
    'balanced': 'Balanced',
    'low_carb': 'Low Carb',
    'keto': 'Keto',
    'gluten_free': 'Gluten Free',
    'dairy_free': 'Dairy Free',
    'paleo': 'Paleo',
    'vegetarian': 'Vegetarian',
    'vegan': 'Vegan',
    'mediterranean': 'Mediterranean',
    'intermittent_fasting': 'Intermittent Fasting'
};

const DIET_PLANS = [
    {
        key: 'balanced' as const,
        title: 'Cân bằng',
        macros: '55% Tinh bột • 20% Protein • 25% Chất béo',
        description: 'Cung cấp đầy đủ các nhóm chất dinh dưỡng thiết yếu với tỷ lệ hợp lý, giúp duy trì sức khỏe.'
    },
    {
        key: 'low_carb' as const,
        title: 'Ít tinh bột',
        macros: '20% Tinh bột • 25% Protein • 55% Chất béo',
        description: 'Hạn chế tiêu thụ tinh bột (cơm, bánh mì, mì ống, đường, khoai...), tăng cường protein và chất béo.'
    },
    {
        key: 'keto' as const,
        title: 'Keto',
        macros: '10% Tinh bột • 25% Protein • 65% Chất béo',
        description: 'Giảm thiểu tinh bột xuống mức rất thấp, tăng cường chất béo, protein vừa phải.'
    },
    {
        key: 'gluten_free' as const,
        title: 'Không gluten',
        macros: '55% Tinh bột • 20% Protein • 25% Chất béo',
        description: 'Tránh hoàn toàn thực phẩm chứa gluten (lúa mì, lúa mạch...)'
    },
    {
        key: 'dairy_free' as const,
        title: 'Không sữa',
        macros: '55% Tinh bột • 20% Protein • 25% Chất béo',
        description: 'Tránh toàn bộ sản phẩm từ sữa và chế phẩm của sữa (phô mai, bơ, sữa chua, kem...)'
    }
];

const EatStyleScreen = () => {
    const navigation = useNavigation<Nav>();
    const [selected, setSelected] = useState<DietPlanKey>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!selected) {
            Alert.alert('Thông báo', 'Vui lòng chọn chế độ ăn để tiếp tục');
            return;
        }

        // Kiểm tra nếu đang ở trong flow cài đặt
        const isSettingsFlow = navigation.getState().routes.some(route => 
            route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
        );
        
        if (isSettingsFlow) {
            // Nếu đang trong settings, lưu chế độ ăn và quay lại
            setIsLoading(true);
            try {
                const dietPlanName = DIET_PLAN_MAPPING[selected] || 'Balanced';
                await profileAPI.saveUserDietPlan({ dietPlan: dietPlanName });
                Alert.alert('Thành công', 'Chế độ ăn đã được cập nhật');
                navigation.goBack();
            } catch (error: any) {
                console.error('Save diet plan error:', error);
                const errorMessage = error?.message || 'Cập nhật chế độ ăn thất bại. Vui lòng thử lại.';
                Alert.alert('Lỗi', errorMessage);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Nếu đang trong flow đăng ký, lưu chế độ ăn và tiếp tục đến màn hình CookingLevel
            setIsLoading(true);
            try {
                const dietPlanName = DIET_PLAN_MAPPING[selected] || 'Balanced';
                await profileAPI.saveUserDietPlan({ dietPlan: dietPlanName });
                navigation.navigate('CookingLevel');
            } catch (error: any) {
                console.error('Save diet plan error:', error);
                const errorMessage = error?.message || 'Lưu chế độ ăn thất bại. Vui lòng thử lại.';
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
                <Text style={styles.headerTitle}>Chế độ ăn</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.description}>
                    Chọn tối đa 2 chế độ ăn phù hợp với bạn, hoặc chọn Tiếp tục để bỏ qua.
                </Text>

                <View style={styles.dietPlansContainer}>
                    {DIET_PLANS.map(plan => (
                        <TouchableOpacity
                            key={plan.key}
                            style={[
                                styles.dietPlanCard,
                                selected === plan.key && styles.dietPlanCardSelected
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setSelected(plan.key)}
                        >
                            <View style={styles.dietPlanContent}>
                                <Text style={[
                                    styles.dietPlanTitle,
                                    selected === plan.key && styles.dietPlanTitleSelected
                                ]}>
                                    {plan.title}
                                </Text>
                                <Text style={[
                                    styles.dietPlanMacros,
                                    selected === plan.key && styles.dietPlanMacrosSelected
                                ]}>
                                    {plan.macros}
                                </Text>
                                <Text style={[
                                    styles.dietPlanDescription,
                                    selected === plan.key && styles.dietPlanDescriptionSelected
                                ]}>
                                    {plan.description}
                                </Text>
                            </View>

                            <View style={[
                                styles.radioButton,
                                selected === plan.key && styles.radioButtonSelected
                            ]}>
                                {selected === plan.key && (
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
                    disabled={isLoading}
                    style={StyleSheet.flatten([
                        styles.continueButton,
                        isLoading && styles.continueButtonDisabled
                    ])}
                />
            </View>
        </SafeAreaView>
    );
};

export default EatStyleScreen;

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
        fontWeight: '400',
        lineHeight: 24,
    },
    dietPlansContainer: {
        flex: 1,
    },
    dietPlanCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: RADII.md,
        backgroundColor: '#F9FAFB',
    },
    dietPlanCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#FEF2F2',
    },
    dietPlanContent: {
        flex: 1,
        marginRight: SPACING.md,
    },
    dietPlanTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textStrong,
        marginBottom: 6,
    },
    dietPlanTitleSelected: {
        color: COLORS.primary,
    },
    dietPlanMacros: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 20,
    },
    dietPlanMacrosSelected: {
        color: COLORS.primary,
    },
    dietPlanDescription: {
        fontSize: 14,
        color: COLORS.textDim,
        lineHeight: 20,
    },
    dietPlanDescriptionSelected: {
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
        alignSelf: 'center',
    },
    radioButtonSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
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
        opacity: 0.6,
        shadowOpacity: 0.1,
        elevation: 2,
    },
});