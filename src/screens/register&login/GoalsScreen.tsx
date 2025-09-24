import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type GoalKey = 'healthy' | 'lose' | 'gain' | 'gain weight' | 'target' | null;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Goals'>;

const GOALS = [
    { key: 'healthy' as const, title: 'Ăn uống lành mạnh' },
    { key: 'lose' as const, title: 'Giảm cân' },
    { key: 'gain' as const, title: 'Tăng cơ'},
    { key: 'gain weight' as const, title: 'Tăng cân' },
];

const GoalsScreen = () => {
    const navigation = useNavigation<Nav>(); 
    const [selected, setSelected] = useState<GoalKey>(null);
    const [otherText, setOtherText] = useState('');

    const canContinue = useMemo(() => {
        if (selected && selected !== 'target') return true;
        return otherText.trim().length > 0;
    }, [selected, otherText]);

    const handleContinue = () => {
        navigation.navigate('Lifestyle');
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

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.description}>Chọn mục tiêu bạn mong muốn:</Text>

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

                        {/* target */}
                        <View style={styles.otherSection}>
                            <Text style={styles.otherTitle}>Cân nặng mục tiêu</Text>
                            <TextInput
                                style={[
                                    styles.otherInput,
                                    selected === 'target' && styles.otherInputFocused
                                ]}
                                placeholder=""
                                placeholderTextColor="#9CA3AF"
                                value={otherText}
                                onChangeText={(t) => {
                                    setOtherText(t);
                                    if (t.trim().length > 0) setSelected('target');
                                    else if (selected === 'target') setSelected(null);
                                }}
                                returnKeyType="done"
                                multiline
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                <AppButton 
                    title="Tiếp tục" 
                    onPress={handleContinue} 
                    filled 
                    style={StyleSheet.flatten([
                        styles.continueButton,
                        !selected && styles.continueButtonDisabled
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
    otherSection: {
        marginTop: SPACING.lg,
    },
    otherTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textStrong,
        marginBottom: SPACING.sm,
    },
    otherInput: {
        minHeight: 50,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: RADII.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: '#F9FAFB',
        textAlignVertical: 'top',
    },
    otherInputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: '#FEF2F2',
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