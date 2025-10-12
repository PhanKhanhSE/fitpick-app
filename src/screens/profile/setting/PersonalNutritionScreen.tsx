import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../../../utils/theme";

type NavigationProp = any;

const PersonalNutritionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dinh dưỡng cá nhân</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Mục tiêu -> GoalsScreen từ register&login */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Goals")}
        >
          <Text style={styles.itemText}>Mục tiêu</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* Chế độ ăn -> EatStyleScreen từ register&login */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("EatStyle")}
        >
          <Text style={styles.itemText}>Chế độ ăn</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* Kỹ năng nấu ăn -> CookingLevelScreen từ register&login */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("CookingLevel")}
        >
          <Text style={styles.itemText}>Kỹ năng nấu ăn</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* Mức độ vận động -> LifestyleScreen từ register&login */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Lifestyle")}
        >
          <Text style={styles.itemText}>Mức độ vận động</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PersonalNutritionScreen;

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
    flexDirection: "row",
  },
  backButton: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.muted,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: { 
    fontSize: 16, 
    color: COLORS.text 
  },
});
