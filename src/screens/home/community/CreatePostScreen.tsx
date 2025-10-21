import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADII } from "../../../utils/theme";

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
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
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
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text, 
    marginBottom: SPACING.sm,
  },
  imageBox: {
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
  image: {
    minWidth: 327,
    height: 250,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  input: {
    minWidth: 327,
    minHeight: 170,
    backgroundColor: COLORS.background,
    borderRadius: RADII.umd,
    borderWidth: 1,
    borderColor: COLORS.under_process,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    textAlignVertical: "top",
    fontSize: 14,
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.umd,
    paddingVertical: 14,
    alignItems: "center",
    margin: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CreatePostScreen;
