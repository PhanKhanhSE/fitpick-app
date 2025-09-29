import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, SPACING, FONTS, RADII } from "../../../utils/theme";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Ionicons } from "@expo/vector-icons";

interface PostItemProps {
  post: {
    id: string;
    userName: string;
    timeAgo: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onLike, onComment }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}></View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Image - Only show if imageUrl is provided */}
      {post.imageUrl && (
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: COLORS.muted, fontSize: 12 }}>
              📷 Hình ảnh
            </Text>
          </View>
        </View>
      )}

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>{post.likesCount} lượt thích</Text>
        <Text style={styles.statsText}>{post.commentsCount} nhận xét</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, post.isLiked && styles.likedButton]}
          onPress={() => onLike(post.id)}
          activeOpacity={0.6}
        >
          {post.isLiked ? (
            <Ionicons 
              name="heart" 
              size={18} 
              color={COLORS.primary} 
              style={styles.actionIcon}
            />
          ) : (
            <Ionicons 
              name="heart-outline" 
              size={18} 
              color={COLORS.text} 
              style={styles.actionIcon}
            />
          )}
          <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
            Thích
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment(post.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Nhận xét</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderRadius: RADII.umd,
    padding: SPACING.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    marginLeft: -SPACING.xs,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: RADII.xl,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.muted,
  },
  content: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  imageContainer: {
    marginBottom: SPACING.md,
  },
  imagePlaceholder: {
    width: 327,
    height: 250,
    backgroundColor: "#E5E5E5",
    borderRadius: RADII.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.under_process,
    marginBottom: SPACING.sm,
  },
  statsText: {
    fontSize: 14,
    fontWeight: "300",
    color: COLORS.muted,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADII.md,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },
  likedButton: {
  },
  actionIcon: {
    marginRight: SPACING.sm,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  likedText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default PostItem;
