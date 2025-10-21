import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

 const Logo = () => (
    <Text style={styles.logo}>FIT{"\n"}PICK</Text>
);

const styles = StyleSheet.create({
    logo: {
        fontSize: 68,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.primary,
        marginBottom: 150,
        lineHeight: 68,
    },
});

export default Logo;