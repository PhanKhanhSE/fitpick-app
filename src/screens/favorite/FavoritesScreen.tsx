import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADII } from "../../utils/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
import {
  FavoriteCard,
  FavoriteActionModal,
  FavoriteBottomBar,
  MealPlannerModal,
  FoodItem,
} from "../../components/fav";

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [actionItem, setActionItem] = useState<FoodItem | null>(null);
  const [showMealPlanner, setShowMealPlanner] = useState(false);

  // Dữ liệu mẫu
  const favoriteItems: FoodItem[] = [
    {
      id: "1",
      name: "Cá hồi sốt tiêu kèm bơ xanh",
      calories: 200,
      weight: 250,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
    {
      id: "2",
      name: "Ức gà sốt me rang tiêu xay",
      calories: 700,
      weight: 45,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
    {
      id: "3",
      name: "Cơm gạo lứt bò nướng",
      calories: 550,
      weight: 30,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
    {
      id: "4",
      name: "Bánh yến mạch",
      calories: 300,
      weight: 30,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
    {
      id: "5",
      name: "Salad bí đỏ",
      calories: 200,
      weight: 25,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
    {
      id: "6",
      name: "Canh rau củ thập cẩm",
      calories: 180,
      weight: 300,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
    {
      id: "7",
      name: "Gỏi cuốn tôm thịt",
      calories: 250,
      weight: 35,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
    {
      id: "8",
      name: "Phở gà",
      calories: 400,
      weight: 350,
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
    },
  ];

  // Convert FoodItem to meal format for MealDetailScreen
  const convertFoodItemToMeal = (item: FoodItem) => {
    return {
      id: item.id,
      title: item.name,
      calories: `${item.calories} kcal`,
      price: "0 VND", // Default price
      image: item.image,
      cookingTime: "0 phút", // Default cooking time
      ingredients: [
        { name: "Thành phần chính", amount: `${item.weight}g` },
      ],
      instructions: [
        "Hướng dẫn sẽ được cập nhật sau.",
      ],
    };
  };

  const handleNavigateToDetail = (item: FoodItem) => {
    const meal = convertFoodItemToMeal(item);
    navigation.navigate('MealDetail', { meal });
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleMealPlannerSave = (selectedDays: string[], mealType: string) => {
    // Xử lý lưu vào meal planner
    console.log("Saving to meal planner:", {
      selectedDays,
      mealType,
      item: actionItem,
    });
  };

  const renderFoodCard = ({ item }: { item: FoodItem }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <FavoriteCard
        item={item}
        multiSelect={multiSelect}
        isSelected={isSelected}
        onPress={() =>
          multiSelect
            ? toggleSelect(item.id)
            : handleNavigateToDetail(item)
        }
        onMorePress={() => setActionItem(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Yêu thích</Text>
      </View>

      {/* Grid danh sách với nút action */}
      <FlatList
        data={favoriteItems}
        renderItem={renderFoodCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 85 } // 85 là chiều cao bottom tab
        ]}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <TouchableOpacity onPress={() => setMultiSelect(!multiSelect)}>
            <Text style={styles.actionText}>
              {multiSelect ? "Bỏ chọn tất cả" : "Chọn nhiều món"}
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Components */}
      <FavoriteBottomBar
        visible={multiSelect}
        selectedCount={selectedItems.length}
        onAddToProductList={() => console.log("Add to product list")}
        onDelete={() => console.log("Delete selected items")}
      />

      <FavoriteActionModal
        visible={!!actionItem}
        item={actionItem}
        onClose={() => setActionItem(null)}
        onAddToMealPlan={() => {
          setActionItem(null);
          setShowMealPlanner(true);
        }}
        onAddToProductList={() => {
          console.log("Add to product list");
          setActionItem(null);
        }}
        onDelete={() => {
          console.log("Delete item");
          setActionItem(null);
        }}
      />

      <MealPlannerModal
        visible={showMealPlanner}
        item={actionItem}
        onClose={() => setShowMealPlanner(false)}
        onSave={handleMealPlannerSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: "right",
    marginBottom: SPACING.md,
    marginRight: SPACING.sm,
    textDecorationLine: "underline",
  },
  list: {
    paddingHorizontal: SPACING.md,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
});

export default FavoritesScreen;
