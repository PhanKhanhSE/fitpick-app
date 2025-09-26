import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADII } from "../../utils/theme";

const { height } = Dimensions.get("window");
const freeFeaturesIndex = [0, 1];

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  onUpgrade,
}) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 10,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        tension: 30,
        friction: 10,
      }).start();
    }
  }, [visible, slideAnim]);

  const features = [
    "Gợi ý theo nguyên liệu có sẵn",
    "Theo dõi mục tiêu cơ bản",
    "Thư viện công thức cao cấp",
    "Lên kế hoạch ăn uống cá tuần",
    "Nhắc nhở lịch trình ăn uống",
    "Gợi ý cá nhân hóa chuyên sâu",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.proTag}>
                <Text style={styles.proTagText}>PRO</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Mở khóa trải nghiệm hoàn hảo{"\n"}với FitPick PREMIUM
          </Text>

          {/* Feature Comparison */}
          <View style={styles.comparisonContainer}>
            <View style={styles.tableContainer}>
              {/* Header Row */}
              <View style={styles.tableRow}>
                <View style={styles.featureColumn}>
                  <Text style={styles.featureText}></Text>
                </View>
                <View style={styles.freeColumn}>
                  <Text style={styles.freeLabel}>Free</Text>
                </View>
                <View style={styles.proColumn}>
                  <Text style={styles.proLabel}>PRO</Text>
                </View>
              </View>

              {/* Feature Rows */}
              {features.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: index % 2 === 1 ? "#FFF5F8" : "white",
                    },
                  ]}
                >
                  <View style={styles.featureColumn}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                  <View style={styles.freeColumn}>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={
                        freeFeaturesIndex.includes(index)
                          ? COLORS.primary
                          : "#E0E0E0"
                      }
                    />
                  </View>
                  <View style={styles.proColumn}>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={COLORS.primary}
                    />
                  </View>
                </View>
              ))}

              {/* PRO Column Border */}
              <View style={styles.proColumnBorder} />
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.pricingContainer}>
            <Text style={styles.pricingText}>
              Tận hưởng mọi tính năng của{" "}
              <Text style={styles.fitPickPro}>FitPick PRO</Text> chỉ với
            </Text>
            <Text style={styles.price}>
              50.000<Text style={styles.currency}>đ</Text>
              <Text style={styles.period}>/tháng</Text>
            </Text>
          </View>

          {/* Upgrade Button */}
          <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
            <Text style={styles.upgradeButtonText}>Nâng cấp ngay</Text>
          </TouchableOpacity>

          {/* Terms */}
          <TouchableOpacity style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Điều khoản dịch vụ và Chính sách bảo mật
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 40,
    minHeight: height * 0.85,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  proTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADII.umd,
  },
  proTagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.xs,
    lineHeight: 28,
  },
  comparisonContainer: {
    marginBottom: SPACING.umd,
  },
  tableContainer: {
    position: "relative",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    marginBottom: 2,
  },
  featureColumn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: SPACING.sm,
    justifyContent: "center",
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
  },
  freeColumn: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  freeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  proColumn: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  proLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
  },
  proColumnBorder: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 60,
    height: "100%",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  pricingContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  pricingText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  fitPickPro: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
  },
  currency: {
    fontSize: 20,
    fontWeight: "normal",
  },
  period: {
    fontSize: 16,
    fontWeight: "normal",
    color: COLORS.muted,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.umd,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  upgradeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsContainer: {
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});

export default PremiumModal;
