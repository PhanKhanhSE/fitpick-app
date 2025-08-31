import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, SPACING, RADII } from '../utils/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RegisterMealPlan'>;

type FreqKey = 'always' | 'often' | 'rarely' | 'sometimes' | 'never' | null;
type YesNo = 'yes' | 'no' | null;

const PINK = '#F63E7C';

const FREQ_OPTIONS = [
    { key: 'always' as const, label: 'Luôn luôn' },
    { key: 'often' as const, label: 'Thường xuyên' },
    { key: 'rarely' as const, label: 'Hiếm khi' },
    { key: 'sometimes' as const, label: 'Đôi khi' },
    { key: 'never' as const, label: 'Không bao giờ' },
];

const YESNO_OPTIONS = [
    { key: 'yes' as const, label: 'Có' },
    { key: 'no' as const, label: 'Không' },
];

const RegisterMealPlanScreen = () => {
    const navigation = useNavigation<Nav>();
    const [freq, setFreq] = useState<FreqKey>(null);
    const [wantAuto, setWantAuto] = useState<YesNo>(null);

    const canContinue = useMemo(() => !!freq && !!wantAuto, [freq, wantAuto]);

    const onContinue = () => {
        // TODO: lưu state vào store/context nếu cần
        navigation.replace('MainTabs');
    };

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <AppHeader title="Thực đơn hằng ngày" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                {/* Câu hỏi 1 */}
                <Text style={styles.question}>
                    Bạn có thường tự lên kế hoạch cho bữa ăn của mình không?
                </Text>

                <View style={styles.group}>
                    {FREQ_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.key}
                            activeOpacity={0.8}
                            onPress={() => setFreq(opt.key)}
                            style={[styles.choiceBtn, freq === opt.key && styles.choiceBtnActive]}
                        >
                            <Text style={[styles.choiceText, freq === opt.key && styles.choiceTextActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Câu hỏi 2 */}
                <Text style={[styles.question, { marginTop: 24 }]}>
                    Bạn có muốn <Text style={styles.brand}>FITPAL</Text> lên kế hoạch cho bữa ăn hằng ngày của bạn không?
                </Text>

                <View style={styles.group}>
                    {YESNO_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.key}
                            activeOpacity={0.8}
                            onPress={() => setWantAuto(opt.key)}
                            style={[styles.choiceBtn, wantAuto === opt.key && styles.choiceBtnActive]}
                        >
                            <Text style={[styles.choiceText, wantAuto === opt.key && styles.choiceTextActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <AppButton title="Tiếp tục" onPress={onContinue} filled />
            </View>
        </SafeAreaView>
    );
};

export default RegisterMealPlanScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    container: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.sm * 1.5,
        paddingBottom: SPACING.lg,
    },

    question: {
        fontSize: 14,
        color: COLORS.textStrong ?? '#111',
        marginBottom: 12,
    },
    brand: { fontWeight: '800' },

    group: { gap: 12 },
    choiceBtn: {
        height: 48,
        borderRadius: RADII.xl ?? 24,
        backgroundColor: '#E6E6E6',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    choiceBtnActive: {
        backgroundColor: '#F0F0F0',
        borderWidth: 2,
        borderColor: PINK,
    },
    choiceText: { fontSize: 15, color: '#333', fontWeight: '600' },
    choiceTextActive: { color: PINK },

    footer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
});