import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADII, SPACING } from "../../../utils/theme";
import PremiumModal from "../../../components/home/PremiumModal";
import { paymentsAPI } from "../../../services/paymentAPI";
import { Linking } from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";
import { userProfileAPI, settingsAPI } from "../../../services/userProfileAPI";
import { authAPI } from "../../../services/api";
import { notificationAPI } from "../../../services/notificationAPI";
import { notificationSettingsAPI } from "../../../services/notificationSettingsAPI";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notify, setNotify] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('FREE');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userProfile = await userProfileAPI.getCurrentUserProfile();
      setUserEmail(userProfile.data.email || '');
      setAccountType(userProfile.data.accountType || 'FREE');
      
      // Load notification settings
      try {
        const notificationSettings = await notificationSettingsAPI.getNotificationSettings();
        if (notificationSettings.success && notificationSettings.data) {
          setNotify(notificationSettings.data.notificationsEnabled);
        }
      } catch (error) {

        // Fallback to default value
        setNotify(true);
      }
    } catch (error) {

      // Fallback to stored data
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setUserEmail(parsedProfile.email || '');
          setAccountType(parsedProfile.accountType || parsedProfile.subscriptionType || 'FREE');
        } else {
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (storedEmail) setUserEmail(storedEmail);
        }
        
        // Try to get notification settings from local storage
        const storedNotificationSettings = await AsyncStorage.getItem('notificationSettings');
        if (storedNotificationSettings) {
          const settings = JSON.parse(storedNotificationSettings);
          setNotify(settings.notificationsEnabled ?? true);
        }
      } catch (storageError) {

      }
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      setNotify(value);
      
      // Cập nhật lên server
      await notificationSettingsAPI.updateNotificationSettings({
        notificationsEnabled: value
      });
      
      // Lưu vào local storage để backup
      await AsyncStorage.setItem('notificationSettings', JSON.stringify({
        notificationsEnabled: value
      }));

    } catch (error) {

      // Revert the change if API call failed
      setNotify(!value);
      Alert.alert(
        'Lỗi',
        'Không thể cập nhật cài đặt thông báo. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      setShowPremiumModal(false);
      const res = await paymentsAPI.createPayment({ plan: 'PRO', amount: 29000, returnUrl: 'fitpick://payments/callback' });
      const url = res?.data?.checkoutUrl || res?.data?.paymentUrl || res?.data?.url || res?.checkoutUrl || res?.paymentUrl || res?.url;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', 'Không nhận được link thanh toán.');
      }
    } catch (e: any) {

      Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán.');
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      await settingsAPI.changePassword(oldPassword, newPassword);
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi thành công!');
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể thay đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Vô hiệu hóa tài khoản', 
      'Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Tài khoản sẽ không thể đăng nhập được nữa.',
      [
        { 
          text: 'Vô hiệu hóa', 
          style: 'destructive',
          onPress: async () => {
            // Simplified confirmation - just double confirm
            Alert.alert(
              'Xác nhận cuối cùng',
              'Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Nhấn "Vô hiệu hóa" để xác nhận.',
              [
                { text: 'Hủy', style: 'cancel' },
                {
                  text: 'Vô hiệu hóa',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setLoading(true);
                      
                      // Call deactivate account API
                      await userProfileAPI.deleteAccount();
                      
                      // Clear all stored data (logout automatically)
                      await AsyncStorage.multiRemove([
                        'accessToken', 
                        'refreshToken', 
                        'user', 
                        'userProfile',
                        'userEmail'
                      ]);
                      
                      // Navigate to AuthLanding screen (logout automatically)
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'AuthLanding' }],
                      });
                      
                      // Show success message after logout
                      setTimeout(() => {
                        Alert.alert('Thành công', 'Tài khoản đã được vô hiệu hóa thành công!');
                      }, 500);
                    } catch (error) {

                      Alert.alert('Lỗi', 'Không thể vô hiệu hóa tài khoản. Vui lòng thử lại.');
                    } finally {
                      setLoading(false);
                    }
                  }
                }
              ]
            );
          }
        },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const handleTestNotification = async () => {
    try {
      setLoading(true);
      
      // Test các loại thông báo khác nhau
      const testNotifications = [
        {
          title: "Test Thông báo Hệ thống",
          message: "Đây là thông báo test hệ thống để kiểm tra chức năng thông báo hoạt động.",
          typeId: undefined
        },
        {
          title: "Test Thông báo Món ăn yêu thích",
          message: "Bạn đã thêm 'Cơm tấm sườn nướng' vào danh sách yêu thích!",
          typeId: undefined
        },
        {
          title: "Test Thông báo Thực đơn",
          message: "Thực đơn cho ngày hôm nay đã được tạo thành công!",
          typeId: undefined
        },
        {
          title: "Test Thông báo Nhắc nhở",
          message: "Đã đến giờ ăn trưa! Hãy thưởng thức bữa ăn của bạn.",
          typeId: undefined
        },
        {
          title: "Test Thông báo Khuyến mãi",
          message: "🎉 Ưu đãi đặc biệt! Giảm 50% cho gói Premium trong tháng này!",
          typeId: undefined
        }
      ];

      // Gửi từng thông báo với delay nhỏ
      for (let i = 0; i < testNotifications.length; i++) {
        const notification = testNotifications[i];
        await notificationAPI.sendNotification(
          notification.title,
          notification.message,
          notification.typeId
        );
        
        // Delay 500ms giữa các thông báo
        if (i < testNotifications.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      Alert.alert(
        'Test Thông báo',
        'Đã gửi 5 thông báo test thành công! Kiểm tra màn hình thông báo để xem kết quả.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {

      Alert.alert(
        'Lỗi',
        `Không thể gửi thông báo test: ${error.message || 'Có lỗi xảy ra'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất', 
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await authAPI.logout();
              // Clear all stored data
              await AsyncStorage.multiRemove([
                'accessToken', 
                'refreshToken', 
                'user', 
                'userProfile',
                'userEmail'
              ]);

              // Navigate to AuthLanding screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthLanding' }],
              });
            } catch (error) {

              // Still navigate even if clearing storage fails
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthLanding' }],
              });
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
      </View>

      <View style={styles.container}>
        {/* ===== Tài khoản ===== */}
        <View style={styles.accountRow}>
          <View style={styles.accountLeft}>
            <Text style={styles.accountLabel}>Tài khoản</Text>
            <View
              style={[styles.badge, accountType === "PRO" && styles.badgePro]}
            >
              <Text
                style={[
                  styles.badgeText,
                  accountType === "PRO" && styles.badgeTextPro,
                ]}
              >
                {accountType}
              </Text>
            </View>
          </View>
        </View>

        {/* Nâng cấp lên PRO - Chỉ hiển thị cho tài khoản Free */}
        {accountType === 'FREE' && (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => setShowPremiumModal(true)}
          >
            <Text style={styles.itemNormal}>Nâng cấp lên PRO</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.text} style={styles.forwardButton} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemNormal}>Email</Text>
          <Text style={styles.subText}>{userEmail || 'Chưa cập nhật'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.item}
          onPress={() => setShowChangePasswordModal(true)}
        >
          <Text style={styles.itemNormal}>Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.text} style={styles.forwardButton} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
          <Text style={[styles.itemText, { color: "red" }]}>Vô hiệu hóa tài khoản</Text>
          <Ionicons name="chevron-forward" size={18} color="red" style={styles.forwardButton} />
        </TouchableOpacity>

        <View style={styles.sectionSpacer} />

        {/* ===== Thông tin cá nhân ===== */}
        <TouchableOpacity 
          style={styles.item}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.itemLargeText}>Thông tin cá nhân</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} style={styles.forwardButton} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("PersonalNutritionScreen")}
        >
          <Text style={styles.itemLargeText}>Dinh dưỡng cá nhân</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} style={styles.forwardButton} />
        </TouchableOpacity>

        {/* Công tắc Thông báo */}
        <View style={styles.itemSwitch}>
          <Text style={styles.itemLargeText}>Thông báo</Text>
          <Switch
            value={notify}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: COLORS.under_process, true: COLORS.primary }}
            thumbColor={"#fff"}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        </View>

        <View style={styles.sectionSpacer} />

        {/* ===== Hỗ trợ ===== */}
        <View style={styles.accountRow}>
          <Text style={styles.sectionLabel}>Hỗ trợ</Text>
        </View>

        <TouchableOpacity 
          style={styles.item}
          onPress={() => navigation.navigate("TermsOfService")}
        >
          <Text style={styles.itemNormal}>Điều khoản dịch vụ</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.muted} style={styles.forwardButton} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.item}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          <Text style={styles.itemNormal}>Chính sách bảo mật</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.muted} style={styles.forwardButton} />
        </TouchableOpacity>

        {/* Test Notification Button - Đã xóa để push git */}
        {/* {__DEV__ && (
          <View style={styles.testWrapper}>
            <TouchableOpacity 
              style={[styles.testButton, loading && styles.testButtonDisabled]} 
              onPress={handleTestNotification}
              disabled={loading}
            >
              <Ionicons name="notifications" size={20} color="#fff" style={styles.testButtonIcon} />
              <Text style={styles.testButtonText}>
                {loading ? 'Đang gửi...' : 'Test Thông báo'}
              </Text>
            </TouchableOpacity>
          </View>
        )} */}

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Premium Modal - Chỉ hiển thị cho tài khoản Free */}
      {accountType === 'FREE' && (
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={handleUpgradeToPro}
        />
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSave={handleChangePassword}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.umd,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
    marginTop: SPACING.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: COLORS.text,
    marginRight: 30, // để cân bằng với nút quay lại bên trái
    marginTop: SPACING.sm,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  accountRow: {
    marginLeft: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  accountLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  accountLabel: {
    marginLeft: -SPACING.sm,
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.text,
  },
  forwardButton: {
    paddingRight: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: RADII.xl,
    marginLeft: SPACING.sm,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },
  badgePro: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  badgeTextPro: {
    color: "#fff",
  },
  item: {
    paddingHorizontal: SPACING.umd,
    paddingVertical: SPACING.umd,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.muted,
    marginHorizontal: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemNormal: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.text,
  },
  itemLargeText: {
    fontSize: 18,
    fontWeight: "700",
  },
  subText: {
    fontSize: 14,
    fontWeight: "200",
    color: COLORS.muted,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  itemSwitch: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionSpacer: {
    height: 12,
    backgroundColor: COLORS.background,
  },
  testWrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADII.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  testButtonIcon: {
    marginRight: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADII.umd,
    alignItems: "center",
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
