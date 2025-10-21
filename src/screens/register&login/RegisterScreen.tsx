import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS, SPACING, RADII, FONTS } from "../../utils/theme";
import { authAPI } from "../../services/api";

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<Nav>();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (!agreeToTerms) {
      Alert.alert("Lỗi", "Vui lòng đồng ý với điều khoản dịch vụ");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Đăng ký tài khoản
      const registerResponse = await authAPI.register(email, password, confirmPassword);
      
      if (registerResponse.success) {
        
        // Tự động đăng nhập sau khi đăng ký thành công
        try {
          const loginResponse = await authAPI.login(email, password);
          
          if (loginResponse.success) {
            
            Alert.alert(
              "Đăng ký thành công", 
              "Tài khoản đã được tạo và sẵn sàng sử dụng!",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate('UserInfo'),
                },
              ]
            );
          } else {
            throw new Error('Auto-login failed');
          }
        } catch (loginError) {
          console.error('❌ Auto-login failed:', loginError);
          // Nếu auto-login thất bại, vẫn cho phép người dùng tiếp tục
          Alert.alert(
            "Đăng ký thành công", 
            "Tài khoản đã được tạo. Vui lòng đăng nhập để tiếp tục.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate('Login'),
              },
            ]
          );
        }
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi đăng ký", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraHeight={80}
        extraScrollHeight={80}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Đăng ký</Text>
          <Text style={styles.subtitle}>Chào mừng bạn đến với FitPick</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email của bạn"
              placeholderTextColor={COLORS.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={COLORS.muted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                textContentType="password"
                returnKeyType="next"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={COLORS.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={COLORS.muted}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                textContentType="password"
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={COLORS.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View
              style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
            >
              {agreeToTerms && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Tôi đồng ý với{" "}
              <Text style={styles.linkText}>Điều khoản dịch vụ</Text> và{" "}
              <Text style={styles.linkText}>Chính sách bảo mật</Text>.
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <AppButton
            title={isLoading ? "Đang đăng ký..." : "Đăng ký"}
            onPress={handleContinue}
            filled
            style={styles.registerButton}
            disabled={isLoading}
          />

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login" as never)}
            >
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.textStrong,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textStrong,
    marginBottom: SPACING.sm,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: RADII.sm,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: FONTS.base,
    color: COLORS.text,
    backgroundColor: "#FAFAFA",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: RADII.sm,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: FONTS.base,
    color: COLORS.text,
    backgroundColor: "#FAFAFA",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    marginRight: SPACING.sm,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDim,
    lineHeight: 20,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  registerButton: {
    width: "100%",
    borderRadius: 25,
    paddingVertical: 18,
    marginBottom: SPACING.lg,
    elevation: 8,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.xs,
  },
  loginText: {
    fontSize: 13,
    color: COLORS.textDim,
  },
  loginLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
