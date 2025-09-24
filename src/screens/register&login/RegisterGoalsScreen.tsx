import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type GoalKey = 'healthy' | 'lose' | 'gain' | 'other' | null;
type Nav = NativeStackNavigationProp<RootStackParamList, 'RegisterGoals'>;

const GOALS = [
    { key: 'healthy' as const, title: 'Ăn uống lành mạnh', subtitle: 'Chế độ ăn cân bằng, đầy đủ dinh dưỡng' },
    { key: 'lose' as const, title: 'Giảm cân', subtitle: 'Tính toán calo cho bữa ăn' },
    { key: 'gain' as const, title: 'Tăng cơ', subtitle: 'Món ăn giàu năng lượng' },
];

const RegisterGoalsScreen = () => {
    const navigation = useNavigation<Nav>();
    const [selected, setSelected] = useState<GoalKey>(null);
    const [otherText, setOtherText] = useState('');

    const canContinue = useMemo(() => {
        if (selected && selected !== 'other') return true;
        return otherText.trim().length > 0;
    }, [selected, otherText]);

    const handleContinue = () => {
        navigation.navigate('RegisterLifestyle' as never);
    };

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <AppHeader title="Mục tiêu" onBack={() => navigation.goBack()} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.caption}>Chọn mục tiêu bạn mong muốn:</Text>

                    {GOALS.map(item => (
                        <TouchableOpacity
                            key={item.key}
                            style={styles.item}
                            activeOpacity={0.8}
                            onPress={() => setSelected(item.key)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                            </View>

                            <View style={[styles.radio, selected === item.key && styles.radioActive]}>
                                {selected === item.key && <View style={styles.radioDot} />}
                            </View>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.otherWrap}>
                        <Text style={styles.otherLabel}>Khác</Text>
                        <TextInput
                            style={styles.otherInput}
                            placeholder=""
                            placeholderTextColor={COLORS.muted}
                            value={otherText}
                            onChangeText={(t) => {
                                setOtherText(t);
                                if (t.trim().length > 0) setSelected('other');
                                else if (selected === 'other') setSelected(null);
                            }}
                            returnKeyType="done"
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <AppButton title="Tiếp tục" onPress={handleContinue} filled />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterGoalsScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },

    container: {
        paddingHorizontal: SPACING.lg, // 24
        paddingTop: SPACING.sm * 1.5,  // 12
        paddingBottom: SPACING.lg,     // 24
    },

    caption: { fontSize: 14, color: COLORS.textStrong, marginBottom: 16 },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: COLORS.border, // #F2F2F2
    },
    itemTitle: { fontSize: 16, color: COLORS.text, marginBottom: 2, fontWeight: '600' },
    itemSubtitle: { fontSize: 12, color: COLORS.textDim }, // #777

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    radioActive: { borderColor: COLORS.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

    otherWrap: { marginTop: 16 },
    otherLabel: { fontSize: 14, color: COLORS.textLabel, marginBottom: 8, fontWeight: '600' }, // #222
    otherInput: {
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: RADII.md, // 24
        paddingHorizontal: 16,
        fontSize: 15,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },

    footer: {
        paddingHorizontal: SPACING.lg, // 24
        paddingBottom: SPACING.lg,     // 24
    },
});