import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADII } from "../utils/theme";

const CreatePostScreen: React.FC<any> = ({ navigation }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleSave = () => {
    // Xử lý tạo mới (call API hoặc emit event)
    console.log("Tạo bài viết:", { content, image });

    // Quay lại màn trước (nếu cần refresh thì emit event hoặc gọi API)
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo bài viết</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SPACING.md }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Upload hình ảnh */}
        <Text style={styles.label}>File phương tiện</Text>
        <TouchableOpacity style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={32} color={COLORS.muted} />
          )}
        </TouchableOpacity>

        {/* Nội dung */}
        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder="Nhập nội dung..."
          placeholderTextColor={COLORS.muted}
          multiline
        />
      </ScrollView>

      {/* Nút lưu */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Đăng</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  imageBox: {
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
    borderRadius: RADII.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: RADII.md,
  },
  input: {
    minHeight: 120,
    backgroundColor: COLORS.white,
    borderRadius: RADII.md,
    padding: SPACING.md,
    textAlignVertical: "top",
    fontSize: 14,
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.lg,
    paddingVertical: 14,
    alignItems: "center",
    margin: SPACING.md,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreatePostScreen;
