import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING } from "../../utils/theme";

interface ProductHeaderProps {
  onBack: () => void;
  onMarkAll: () => void;
  allItemsChecked: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onBack, onMarkAll, allItemsChecked }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Sản phẩm</Text>
      </View>
      <View style={styles.headerBottom}>
        <Text style={styles.headerSubtitle}>
          Đánh dấu các nguyên liệu bạn đã có.
        </Text>
        <TouchableOpacity onPress={onMarkAll}>
          <Text style={styles.markAllText}>
            {allItemsChecked ? 'Bỏ đánh dấu tất cả' : 'Đánh dấu tất cả'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
  },
  markAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "400",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "300",
    color: COLORS.text,
    flex: 1,
  },
});

export default ProductHeader;
