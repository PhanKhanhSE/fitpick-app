import { Text, StyleSheet } from 'react-native';

export const Logo = () => (
    <Text style={styles.logo}>FIT{"\n"}PICK</Text>
);

const styles = StyleSheet.create({
    logo: {
        fontSize: 68,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#F63E7C',
        marginBottom: 150,
        lineHeight: 68,
    },
});