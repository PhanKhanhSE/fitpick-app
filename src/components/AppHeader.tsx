import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    title: string;
    onBack?: () => void;
    right?: React.ReactNode;
};

const AppHeader: React.FC<Props> = ({ title, onBack, right }) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView edges={['top']} style={styles.safe}>
            <View style={styles.header}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                ) : <View style={styles.backBtn} />}

                <Text style={styles.title}>{title}</Text>

                <View style={styles.right}>{right}</View>
            </View>
        </SafeAreaView>
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    safe: { backgroundColor: '#fff' },
    header: {
        minHeight: 56,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderBottomWidth: 2,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    backBtn: { position: 'absolute', left: 16, padding: 8 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    right: { position: 'absolute', right: 16 },
});