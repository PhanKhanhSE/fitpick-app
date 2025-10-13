import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type LifestyleKey = 'sedentary' | 'light' | 'moderate' | 'high' | null;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Lifestyle'>;

const LIFESTYLE_OPTIONS = [
    { key: 'sedentary' as const, title: 'Ít vận động', subtitle: 'Ít hoặc không tập thể dức.' },
    { key: 'light' as const, title: 'Hoạt động nhẹ', subtitle: 'Tập thể dục nhẹ 1-3 ngày/ tuần.' },
    { key: 'moderate' as const, title: 'Hoạt động vừa phải', subtitle: 'Tập thể dục cường độ vừa phải 3-5 ngày/ tuần.' },
    { key: 'high' as const, title: 'Hoạt động cao', subtitle: 'Tập thể dục cường độ cao, 6-7 ngày/tuần.' },
];

const LifestyleScreen = () => {
    const navigation = useNavigation<Nav>();
    const [selected, setSelected] = useState<LifestyleKey>(null);

    const handleContinue = () => {
        if (!selected) {
            alert('Vui lòng chọn mức độ vận động để tiếp tục');
            return;
        }

        // Kiểm tra nếu đang ở trong flow cài đặt
        const isSettingsFlow = navigation.getState().routes.some(route => 
            route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
        );
        
        if (isSettingsFlow) {
            // Nếu đang trong settings, lưu mức độ vận động và quay lại
            console.log('Lưu mức độ vận động:', { selected });
            navigation.goBack();
        } else {
            // Nếu đang trong flow đăng ký, tiếp tục đến màn hình EatStyle
            navigation.navigate('EatStyle');
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
                <Text style={styles.headerTitle}>Mức độ vận động</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.description}>Bạn thường hoạt động thể chất ở mức nào?</Text>

                <View style={styles.optionsContainer}>
                    {LIFESTYLE_OPTIONS.map(item => (
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
                                <Text style={[
                                    styles.optionSubtitle,
                                    selected === item.key && styles.optionSubtitleSelected
                                ]}>
                                    {item.subtitle}
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
                    title={navigation.getState().routes.some(route => 
                        route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
                    ) ? "Lưu" : "Tiếp tục"}
                    onPress={handleContinue} 
                    filled 
                    style={StyleSheet.flatten([
                        styles.continueButton,
                        !selected && styles.continueButtonDisabled
                    ])}
                />
            </View>
        </SafeAreaView>
    );
};

export default LifestyleScreen;

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
