import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../../utils/theme';
import AppButton from '../../../components/AppButton';
import { userProfileAPI } from '../../../services/userProfileAPI';

type NavigationProp = any;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    try {
      setLoading(true);
      await userProfileAPI.sendForgotPasswordCode(email);
      Alert.alert('Thành công', 'Mã xác minh đã được gửi đến email của bạn');
      // Navigate to verification screen
      navigation.navigate('VerifyCodeScreen', { email });
    } catch (error: any) {
      console.error('Error sending forgot password code:', error);
      Alert.alert('Lỗi', 'Không thể gửi mã xác minh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>
          Hãy nhập địa chỉ email bạn dùng để đăng ký tài khoản. 
          Chúng tôi sẽ giúp bạn đặt lại mật khẩu.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email của bạn"
            placeholderTextColor={COLORS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <AppButton
          title={loading ? "Đang gửi..." : "Đặt lại mật khẩu"}
          onPress={handleSendCode}
          filled
          style={styles.sendButton}
          textStyle={{ fontWeight: '600', fontSize: 14 }}
          disabled={loading}
        />
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
  form: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    height: 50,
    borderWidth: 0.8,
    borderColor: COLORS.under_process,
    borderRadius: RADII.lg,
    paddingHorizontal: SPACING.lg,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  sendButton: {
    borderRadius: RADII.umd,
  },
});

export default ForgotPasswordScreen;