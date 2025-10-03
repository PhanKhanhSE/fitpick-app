import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADII } from "../utils/theme";

interface Comment {
  id: string;
  userName: string;
  timeAgo: string;
  content: string;
  avatarUrl?: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    userName: "user123",
    timeAgo: "1 ngày",
    content: "Bài viết rất hay, cảm ơn bạn đã chia sẻ!",
    avatarUrl: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    userName: "user456",
    timeAgo: "2 giờ",
    content: "Mình cũng đang tìm hiểu về vấn đề này.",
    avatarUrl: "https://i.pravatar.cc/100?img=2",
  },
];

const PostDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { post } = route.params;
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    const newCmt: Comment = {
      id: Date.now().toString(),
      userName: "Bạn",
      timeAgo: "Vừa xong",
      content: newComment,
      avatarUrl: "https://i.pravatar.cc/100?img=10", // avatar mặc định
    };
    setComments([newCmt, ...comments]);
    setNewComment("");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bài viết</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Info */}
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{post.userName}</Text>
              <Text style={styles.timeAgo}>{post.timeAgo}</Text>
            </View>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          {post.imageUrl && (
            <View style={styles.imagePlaceholder}>
              <Text style={{ color: COLORS.muted }}>📷 Hình ảnh</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.stats}>
            <Text style={styles.statsText}>{post.likesCount} lượt thích</Text>
            <Text style={styles.statsText}>{post.commentsCount} nhận xét</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="heart-outline" size={18} color={COLORS.text} />
              <Text style={styles.actionText}>Thích</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={COLORS.text}
              />
              <Text style={styles.actionText}>Nhận xét</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              {item.avatarUrl ? (
                <Image
                  source={{ uri: item.avatarUrl }}
                  style={styles.commentAvatar}
                />
              ) : (
                <View style={styles.commentAvatar} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.commentUser}>{item.userName}</Text>
                <Text style={styles.commentTime}>{item.timeAgo}</Text>
                <Text style={styles.commentContent}>{item.content}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={16} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Input Comment */}
      <View style={styles.commentInputContainer}>
        {/* Avatar người dùng */}
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=10" }}
          style={styles.inputAvatar}
        />

        {/* Ô nhập */}
        <TextInput
          style={styles.commentInput}
          placeholder="Thêm nhận xét"
          placeholderTextColor={COLORS.muted}
          value={newComment}
          onChangeText={setNewComment}
        />

        {/* Icon gửi */}
        <TouchableOpacity onPress={handleSendComment}>
          <Ionicons name="send" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text },

  content: { flex: 1 },

  postContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADII.lg,
    backgroundColor: "#d3d3d3",
    marginRight: SPACING.sm,
  },
  userName: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  timeAgo: { fontSize: 12, color: COLORS.muted },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: RADII.sm,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 6,
    marginBottom: 6,
  },
  statsText: { fontSize: 12, color: COLORS.muted },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 4,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 14, color: COLORS.text },

  // Comments
  commentItem: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginBottom: 1,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    marginRight: SPACING.sm,
  },
  commentUser: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  commentTime: { fontSize: 11, color: COLORS.muted },
  commentContent: { fontSize: 13, color: COLORS.text, marginTop: 2 },

  // Input Comment
  commentInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SPACING.sm,
  },
  commentInput: {
    flex: 1,
    height: 36,
    backgroundColor: "#f8f8f8",
    borderRadius: 18,
    paddingHorizontal: 12,
    fontSize: 14,
    marginRight: SPACING.sm,
  },
});

export default PostDetailScreen;
