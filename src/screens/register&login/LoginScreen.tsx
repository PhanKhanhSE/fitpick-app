import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { COLORS, SPACING, RADII, FONTS } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authAPI } from "../../services/api";

type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;

const PINK = COLORS.primary;

const LoginScreen = () => {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔐 Debug - Attempting login with:', { email, password: '***' });
      const response = await authAPI.login(email, password);
      console.log('🔐 Debug - Login response:', response);
      
      if (response.success) {
        console.log('✅ Debug - Login successful, navigating to MainTabs');
        Alert.alert("Thành công", "Đăng nhập thành công!", [
          {
            text: "OK",
            onPress: () => navigation.replace("MainTabs"),
          },
        ]);
      } else {
        console.log('❌ Debug - Login failed, response:', response);
        Alert.alert("Lỗi", response.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      console.log('❌ Debug - Login error:', error);
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
      
      if (error?.type === 'network') {
        errorMessage = "Lỗi kết nối mạng. Kiểm tra:\n• Backend có đang chạy không\n• Ngrok có hoạt động không\n• Kết nối internet";
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      Alert.alert("Lỗi đăng nhập", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraHeight={80}
        extraScrollHeight={80}
        showsVerticalScrollIndicator={false}
      >
        {/* Header với banner image */}
        <Image
          source={require("../../assets/Banner.png")}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Đăng nhập</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email của bạn"
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={COLORS.muted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color={COLORS.muted}
                  />
                </TouchableOpacity>
              </View>
            </View> 

            {/* Remember password & Forgot password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={() => setRemember(!remember)}
              >
                <View
                  style={[styles.checkbox, remember && styles.checkboxChecked]}
                >
                  {remember && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text style={styles.rememberText}>Lưu mật khẩu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  /* handle forgot password */
                }}
              >
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>


            {/* Login Button */}
            <AppButton
              title={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              onPress={onLogin}
              filled
              style={styles.loginButton}
              disabled={isLoading}
            />

            {/* Sign up link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Bạn chưa có tài khoản?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("Register")}
                >
                  Tạo tài khoản mới
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
         
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  header: {
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textStrong,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
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
    fontSize: 16,
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
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: "#FAFAFA",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  rememberText: {
    fontSize: 13,
    color: COLORS.textStrong,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    borderRadius: 25,
    paddingVertical: 18,
    marginBottom: SPACING.lg,
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 4px 8px rgba(246, 62, 124, 0.3)`,
    } : {
      shadowColor: COLORS.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    }),
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.xs,
  },
  signupText: {
    fontSize: 13,
    color: COLORS.textDim,
  },
  signupLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
