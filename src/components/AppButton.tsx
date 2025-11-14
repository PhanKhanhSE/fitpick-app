import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../utils/theme';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    filled?: boolean; // true = nút hồng đặc, false = viền hồng
    style?: ViewStyle; // Custom style cho button
    textStyle?: TextStyle; // Custom style cho text
    disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({ 
    title, 
    onPress, 
    filled = true, 
    style, 
    textStyle,
    disabled = false,
}) => {
    return (
        <TouchableOpacity
            onPress={() => { if (!disabled) onPress(); }}
            activeOpacity={disabled ? 1 : 0.7}
            style={[
                filled ? styles.filledButton : styles.outlinedButton,
                style,
                disabled && styles.disabledButton,
            ]}
        >
            <Text style={[
                filled ? styles.filledText : styles.outlinedText,
                textStyle,
                disabled && styles.disabledText,
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default AppButton;

const styles = StyleSheet.create({
    filledButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 40,
        alignItems: 'center',
    },
    outlinedButton: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 40,
        alignItems: 'center',
    },
    filledText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    outlinedText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledText: {
        opacity: 0.7,
    },
    disabledButton: {
        opacity: 0.6,
    },
});
