import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type LifestyleKey = 'sedentary' | 'light' | 'active' | null;
type Nav = NativeStackNavigationProp<RootStackParamList, 'RegisterLifestyle'>;

const OPTIONS = [
    { key: 'sedentary' as const, title: 'Ít vận động', subtitle: 'Thường xuyên phải ngồi nhiều, ít hoạt động' },
    { key: 'light' as const, title: 'Hoạt động nhẹ', subtitle: 'Đi bộ hoặc các bài tập nhẹ' },
    { key: 'active' as const, title: 'Hoạt động thường xuyên', subtitle: 'Thường xuyên thể thao hoặc tập gym' },
];

const RegisterLifestyleScreen = () => {
    const navigation = useNavigation<Nav>();
    const [selected, setSelected] = useState<LifestyleKey>(null);

    const handleContinue = () => {
        navigation.navigate('RegisterMealPlan' as never);
    };

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <AppHeader title="Lối sống" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.caption}>Chọn lối sống hiện tại của bạn:</Text>

                {OPTIONS.map(item => (
                    <TouchableOpacity
                        key={item.key}
                        activeOpacity={0.8}
                        style={styles.item}
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
            </ScrollView>

            <View style={styles.footer}>
                <AppButton title="Tiếp tục" onPress={handleContinue} filled />
            </View>
        </SafeAreaView>
    );
};

export default RegisterLifestyleScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    container: {
        paddingHorizontal: SPACING.lg, // 24
        paddingTop: 12,
        paddingBottom: SPACING.lg,     // 24
    },
    caption: { fontSize: 14, color: (COLORS as any).textStrong ?? COLORS.text, marginBottom: 12 },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: (COLORS as any).border ?? '#F2F2F2',
    },
    itemTitle: { fontSize: 16, color: COLORS.text, marginBottom: 2, fontWeight: '600' },
    itemSubtitle: { fontSize: 12, color: (COLORS as any).textDim ?? '#777' },

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

    footer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
});
