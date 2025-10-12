import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADII, SPACING } from "../../../utils/theme";

type NavigationProp = any;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notify, setNotify] = useState(true);
  const accountType: string = "FREE"; // hoặc 'PRO' để test

  return (
    <View style={styles.safe}>
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

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemNormal}>Nâng cấp lên PRO</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.text} style={styles.forwardButton} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemNormal}>Email</Text>
          <Text style={styles.subText}>a@gmail.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemNormal}>Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.text} style={styles.forwardButton} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={[styles.itemText, { color: "red" }]}>Xóa tài khoản</Text>
          <Ionicons name="chevron-forward" size={18} color="red" style={styles.forwardButton} />
        </TouchableOpacity>

        <View style={styles.sectionSpacer} />

        {/* ===== Thông tin cá nhân ===== */}
        <TouchableOpacity 
          style={styles.item}
          onPress={() => navigation.navigate("UserInfo")}
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

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemNormal}>Điều khoản dịch vụ</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.muted} style={styles.forwardButton} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemNormal}>Chính sách bảo mật</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.muted} style={styles.forwardButton} />
        </TouchableOpacity>

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
