import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../../utils/theme';
import AppButton from '../../../components/AppButton';

type NavigationProp = any;
type RouteProp = any;

const VerifyCodeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { email } = route.params || {};

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã xác minh');
      return;
    }

    // TODO: Call API to verify code
    console.log('Verifying code:', verificationCode);
    
    // Navigate to create new password screen
    navigation.navigate('CreateNewPasswordScreen', { email, code: verificationCode });
  };

  const handleResendCode = () => {
    if (timer > 0) return;

    // TODO: Call API to resend code
    console.log('Resending code to:', email);
    setTimer(60);
    setCode(['', '', '', '', '', '']);
    Alert.alert('Thành công', 'Mã xác minh đã được gửi lại');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Nhập mã xác minh</Text>
        <Text style={styles.subtitle}>
          Chúng tôi vừa gửi mã xác minh tới email của bạn.{'\n'}
          Hãy kiểm tra email và nhập mã vào ô dưới đây.
        </Text>

        {/* Code Input */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputs.current[index] = ref;
              }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <AppButton
          title="Xác nhận"
          onPress={handleVerify}
          filled
          style={styles.verifyButton}
           textStyle={{ fontWeight: '600', fontSize: 14 }}
        />

        {/* Resend Code */}
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendCode}
          disabled={timer > 0}
        >
          <Text style={[
            styles.resendText,
            timer > 0 && styles.resendTextDisabled
          ]}>
            {timer > 0 ? `Gửi lại mã (${timer}s)` : 'Gửi lại mã'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  codeInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.under_process,
    borderRadius: RADII.umd,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  verifyButton: {
    borderRadius: RADII.umd,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: COLORS.muted,
  },
});

export default VerifyCodeScreen;