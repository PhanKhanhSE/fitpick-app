import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';



const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  weight: number;
  image: any;
}

const FavoritesScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleFilterPress = () => {
    // Handle filter button press
    console.log('Filter pressed in favorites');
  };

  const handleDeleteFavorites = () => {
    // Handle delete favorites
    console.log('Delete favorites pressed');
  };

  const handleSuggestMeals = () => {
    // Handle suggest meals
    console.log('Suggest meals pressed');
  };

  const handleMealPress = (item: FoodItem) => {
    // Convert FoodItem to meal format for detail screen
    const meal = {
      id: item.id,
      title: item.name,
      calories: `${item.calories} kcal`,
      price: `${item.weight.toLocaleString()}đ`, // Using weight as price for now
      image: item.image,
      cookingTime: '15 phút',
    };
    navigation.navigate('MealDetail', { meal });
  };

  // Dữ liệu mẫu cho các món ăn yêu thích
  const favoriteItems: FoodItem[] = [
    {
      id: '1',
      name: 'Salad cải kale',
      calories: 173,
      weight: 25.000,
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }, // Thay thế bằng hình ảnh thực tế
    },
    {
      id: '2',
      name: 'Ức gà sốt me rang tiêu xay',
      calories: 700,
      weight: 45.000,
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }, // Thay thế bằng hình ảnh thực tế
    },
    {
      id: '3',
      name: 'Cơm gạo lứt bò nướng',
      calories: 300,
      weight: 30.000,
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }, // Thay thế bằng hình ảnh thực tế
    },
    {
      id: '4',
      name: 'Bánh yến mạch',
      calories: 300,
      weight: 30.000,
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }, // Thay thế bằng hình ảnh thực tế
    },
    {
      id: '5',
      name: 'Bánh yến mạch',
      calories: 300,
      weight: 30.000,
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }, // Thay thế bằng hình ảnh thực tế
    },
    {
      id: '6',
      name: 'Bánh yến mạch',
      calories: 300,
      weight: 30.000,
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }, // Thay thế bằng hình ảnh thực tế
    },
  ];

  const filteredItems = favoriteItems.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderFoodItem = (item: FoodItem) => (
    <TouchableOpacity key={item.id} style={styles.foodItem} onPress={() => handleMealPress(item)}>
      <Image source={item.image} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDetails}>
          {item.calories} kcal | {item.weight.toLocaleString()}g
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="heart" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Món ăn yêu thích</Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Tìm kiếm"
        onFilterPress={handleFilterPress}
      />

      {/* Food List */}
      <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
        {filteredItems.map(renderFoodItem)}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <AppButton
          title="Xóa khỏi yêu thích"
          onPress={handleDeleteFavorites}
          filled={true}
          style={styles.primaryButton}
        />
        <AppButton
          title="Gợi ý món ăn"
          onPress={handleSuggestMeals}
          filled={false}
          style={styles.secondaryButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  editButtonText: {
    fontSize: 20,
    color: COLORS.text,
  },
  foodList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: RADII.sm,
    marginRight: SPACING.md,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  foodDetails: {
    fontSize: 14,
    color: COLORS.textDim,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: COLORS.textDim,
    fontWeight: '300',
  },
  bottomContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: -40,
  },
  primaryButton: {
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    borderColor: COLORS.primary,
  },
});

export default FavoritesScreen;
