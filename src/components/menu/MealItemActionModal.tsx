import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, RADII } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

interface MealItem {
  id: string;
  title: string;
  calories: string;
  time: string;
  image: any;
}

interface MealActionModalProps {
  visible: boolean;
  item: MealItem | null;
  onClose: () => void;
  onAddToFavorites: () => void;
  onAddToProductList: () => void;
  onReplaceWithSuggestion: () => void;
  onReplaceFromFavorites: () => void;
  onDelete: () => void;
  // Props để ẩn các option không cần thiết
  isInFavorites?: boolean;
  isInProductList?: boolean;
}

const MealItemActionModal: React.FC<MealActionModalProps> = ({
  visible,
  item,
  onClose,
  onAddToFavorites,
  onAddToProductList,
  onReplaceWithSuggestion,
  onReplaceFromFavorites,
  onDelete,
  isInFavorites = false,
  isInProductList = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={[styles.modalOverlay, { paddingTop: insets.top }]}
          onPress={onClose}
          activeOpacity={1}
        />
        <View
          style={[
            styles.modalContent,
            { paddingBottom: insets.bottom + SPACING.md },
          ]}
        >
          {/* Thêm vào yêu thích - chỉ hiện khi chưa có trong favorites */}
          {!isInFavorites && (
            <TouchableOpacity style={styles.modalItem} onPress={onAddToFavorites}>
              <Text style={styles.modalItemText}>Thêm vào yêu thích</Text>
            </TouchableOpacity>
          )}

          {/* Thêm vào danh sách sản phẩm - chỉ hiện khi chưa có trong product list */}
          {!isInProductList && (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={onAddToProductList}
            >
              <Text style={styles.modalItemText}>
                Thêm vào danh sách sản phẩm
              </Text>
            </TouchableOpacity>
          )}

          {/* Thay đổi - luôn hiện */}
          <TouchableOpacity
            style={styles.modalItem}
            onPress={onReplaceWithSuggestion}
          >
            <Text style={styles.modalItemText}>Thay đổi</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          {/* Xóa - luôn hiện */}
          <TouchableOpacity
            style={styles.modalItem}
            onPress={onDelete}
          >
            <Text style={styles.deleteText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: -SPACING.lg,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: SPACING.md,
    borderTopLeftRadius: RADII.md,
    borderTopRightRadius: RADII.md,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    marginTop: -SPACING.sm,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
    flex: 1,
  },
  deleteText: {
    fontSize: 16,
    color: "red",
  },
});

export default MealItemActionModal;
