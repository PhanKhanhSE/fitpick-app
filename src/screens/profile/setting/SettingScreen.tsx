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
import ChangePasswordModal from "./ChangePasswordModal";
import { userProfileAPI, settingsAPI } from "../../../services/userProfileAPI";
import { authAPI } from "../../../services/api";
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
    } catch (error) {
      console.error('Error loading user data:', error);
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
      } catch (storageError) {
        console.error('Error loading stored data:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPro = () => {
    // Logic nâng cấp lên PRO
    console.log('Upgrading to PRO...');
    Alert.alert('Thành công', 'Bạn đã nâng cấp lên PRO thành công!');
    setShowPremiumModal(false);
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      await settingsAPI.changePassword(oldPassword, newPassword);
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi thành công!');
    } catch (error) {
      console.error('Error changing password:', error);
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
                      console.error('Error deleting account:', error);
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
              console.log('User logged out successfully');
              // Navigate to AuthLanding screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthLanding' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
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

        <TouchableOpacity 
          style={styles.item}
          onPress={() => setShowPremiumModal(true)}
        >
          <Text style={styles.itemNormal}>Nâng cấp lên PRO</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.text} style={styles.forwardButton} />
        </TouchableOpacity>

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
            onValueChange={setNotify}
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

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handleUpgradeToPro}
      />

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
