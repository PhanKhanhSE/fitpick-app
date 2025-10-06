import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADII } from "../../../utils/theme";

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
  {
    id: "3",
    userName: "user456",
    timeAgo: "2 giờ",
    content: "Mình cũng đang tìm hiểu về vấn đề này.",
    avatarUrl: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "4",
    userName: "user456",
    timeAgo: "2 giờ",
    content: "Mình cũng đang tìm hiểu về vấn đề này.",
    avatarUrl: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "5",
    userName: "user456",
    timeAgo: "2 giờ",
    content: "Mình cũng đang tìm hiểu về vấn đề này.",
    avatarUrl: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "6",
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bài viết</Text>
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
                <Ionicons name="heart-outline" size={20} color={COLORS.text} />
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },

  content: { flex: 1 },

  postContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  timeAgo: {
    fontSize: 12,
    fontWeight: '300',
    color: COLORS.text,
  },
  postContent: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  imagePlaceholder: {
    minWidth: 327,
    height: 250,
    borderRadius: RADII.umd,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.under_process,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
    marginBottom: 6,
  },
  statsText: {
    fontSize: 14,
    fontWeight: "300",
    color: COLORS.text,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "300",
    color: COLORS.text,
  },

  // Comments
  commentItem: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    marginBottom: 1,
  },
  commentAvatar: {
    width: 45,
    height: 45,
    borderRadius: RADII.xl,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  commentTime: {
    fontSize: 12,
    fontWeight: '300',
    color: COLORS.text,
  },
  commentContent: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "400",
    color: COLORS.text,
    marginTop: 2,
  },

  // Input Comment
  commentInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  inputAvatar: {
    width: 45,
    height: 45,
    borderRadius: RADII.xl,
    marginRight: SPACING.sm,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.under_process,
    backgroundColor: COLORS.background,
    borderRadius: RADII.umd,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    marginRight: SPACING.sm,
  },
});

export default PostDetailScreen;
