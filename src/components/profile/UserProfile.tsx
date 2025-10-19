import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, SPACING } from "../../utils/theme";

interface UserProfileProps {
  name: string;
  accountType: string;
  avatar: string;
  onAvatarPress?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  accountType,
  avatar,
  onAvatarPress,
}) => {
  return (
    <View style={styles.profileSection}>
      <TouchableOpacity style={styles.avatarContainer} onPress={onAvatarPress}>
        <Image
          source={{
            uri: avatar,
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.accountTypeContainer}>
          <Text style={styles.accountTypeLabel}>Tài khoản </Text>
          <View style={styles.accountTypeBadge}>
            <Text style={styles.accountTypeText}>{accountType}</Text>
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
