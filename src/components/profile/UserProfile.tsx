import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, SPACING } from "../../utils/theme";

interface UserProfileProps {
  name: string;
  accountType: string;
  avatar: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  accountType,
  avatar,
}) => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
          uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7XDKSjjkyUPBWh7lrsh4BrKCkyuNC2v7UfA&s',
}}
          style={styles.avatar}
        />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Meo Meo Đã Căng</Text>
        <View style={styles.accountTypeContainer}>
          <Text style={styles.accountTypeLabel}>Tài khoản </Text>
          <View style={styles.accountTypeBadge}>
            <Text style={styles.accountTypeText}>FREE</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  avatarContainer: {
    width: 101,
    height: 94,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 101,
    height: 94,
    borderRadius: 100,
  },
  userInfo: {
    alignItems: "flex-start",
    marginLeft: SPACING.md,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  accountTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountTypeLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  accountTypeBadge: {
    backgroundColor: "#FFE0E0",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  accountTypeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default UserProfile;
