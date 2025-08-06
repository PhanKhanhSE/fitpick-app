import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    filled?: boolean; // true = nút hồng đặc, false = viền hồng
}

const AppButton: React.FC<AppButtonProps> = ({ title, onPress, filled = true }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={filled ? styles.filledButton : styles.outlinedButton}
        >
            <Text style={filled ? styles.filledText : styles.outlinedText}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default AppButton;

const styles = StyleSheet.create({
    filledButton: {
        backgroundColor: '#F63E7C',
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 40,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    outlinedButton: {
        borderColor: '#F63E7C',
        borderWidth: 2,
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 40,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    filledText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    outlinedText: {
        color: '#F63E7C',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
