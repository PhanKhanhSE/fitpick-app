import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, FONTS } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MealCardProps {
  title: string;
  calories: string;
  price: string;
  image: any;
  onPress: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ title, calories, price, image, onPress }) => (
  <TouchableOpacity style={styles.mealCard} onPress={onPress}>
    <Image source={image} style={styles.mealImage} />
    <TouchableOpacity style={styles.heartIcon}>
      <Ionicons name="heart-outline" size={20} color="white" />
    </TouchableOpacity>
    <View style={styles.mealInfo}>
      <Text style={styles.mealTitle}>{title}</Text>
      <Text style={styles.mealDetails}>{calories} | {price}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const navigation = useNavigation<NavigationProp>();

  // Sample meal data
  const mealData = [
    {
      id: '1',
      title: 'Sữa chua trái cây tươi',
      calories: '300 kcal',
      price: '30.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '10 phút',
    },
    {
      id: '2',
      title: 'Cuốn ức gà rau củ',
      calories: '500 kcal',
      price: '55.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '20 phút',
    },
    {
      id: '3',
      title: 'Bánh mì alpaca',
      calories: '400 kcal',
      price: '40.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '15 phút',
    },
    {
      id: '4',
      title: 'Salad bơ tương ớt',
      calories: '350 kcal',
      price: '45.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '12 phút',
    },
  ];

  const suggestedMeals = [
    {
      id: '5',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '300 kcal',
      price: '30.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '25 phút',
    },
    {
      id: '6',
      title: 'Bánh bí yến mạch',
      calories: '500 kcal',
      price: '55.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '30 phút',
    },
    {
      id: '7',
      title: 'Gà nướng mật ong',
      calories: '450 kcal',
      price: '60.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '35 phút',
    },
    {
      id: '8',
      title: 'Soup bí đỏ hạt chia',
      calories: '280 kcal',
      price: '35.000đ',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      cookingTime: '18 phút',
    },
  ];

  const handleFilterPress = () => {
    // Handle filter button press
    console.log('Filter pressed');
  };

  const handleMealTypePress = (mealType: string) => {
    setSelectedMealType(mealType);
  };

  const handleMealPress = (meal: any) => {
    navigation.navigate('MealDetail', { meal });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={24} color={COLORS.muted} />
            </View>
            <View>
              <Text style={styles.greeting}>Xin chào</Text>
              <Text style={styles.username}>Linh</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm"
          onFilterPress={handleFilterPress}
        />

        {/* Meal Type Buttons */}
        <View style={styles.mealTypeContainer}>
          <View style={styles.mealTypeButtonWrapper}>
            <AppButton
              title="Bữa sáng"
              onPress={() => handleMealTypePress('breakfast')}
              filled={selectedMealType === 'breakfast'}
              style={styles.mealTypeButtonStyle}
              textStyle={styles.mealTypeTextStyle}
            />
          </View>
          <View style={styles.mealTypeButtonWrapper}>
            <AppButton
              title="Bữa trưa"
              onPress={() => handleMealTypePress('lunch')}
              filled={selectedMealType === 'lunch'}
              style={styles.mealTypeButtonStyle}
              textStyle={styles.mealTypeTextStyle}
            />
          </View>
          <View style={styles.mealTypeButtonWrapper}>
            <AppButton
              title="Bữa tối"
              onPress={() => handleMealTypePress('dinner')}
              filled={selectedMealType === 'dinner'}
              style={styles.mealTypeButtonStyle}
              textStyle={styles.mealTypeTextStyle}
            />
          </View>
        </View>

        {/* Drinking Plan Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kế hoạch ăn uống</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>xem thêm</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mealScrollView}
          contentContainerStyle={styles.mealScrollContent}
        >
          {mealData.map((meal) => (
            <MealCard
              key={meal.id}
              title={meal.title}
              calories={meal.calories}
              price={meal.price}
              image={meal.image}
              onPress={() => handleMealPress(meal)}
            />
          ))}
        </ScrollView>
        

        {/* Suggested Dishes Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Món ăn được gợi ý</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>xem thêm</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mealScrollView}
          contentContainerStyle={styles.mealScrollContent}
        >
          {suggestedMeals.map((meal) => (
            <MealCard
              key={meal.id}
              title={meal.title}
              calories={meal.calories}
              price={meal.price}
              image={meal.image}
              onPress={() => handleMealPress(meal)}
            />
          ))}
        </ScrollView>
      </ScrollView>
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
    paddingVertical: SPACING.lg,
    marginTop: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.base,
    color: COLORS.text,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  mealTypeButtonWrapper: {
    minWidth: (width - SPACING.md * 2 - SPACING.sm * 2) / 3, // Giảm kích thước nút
  },
  mealTypeButtonStyle: {
    paddingVertical: 12, // Tương đương với search bar (paddingVertical: 6 + border)
    paddingHorizontal: SPACING.sm,
    borderRadius: 25, // Giống search bar
    minWidth: (width - SPACING.md * 2 - SPACING.sm * 2) / 3, // Đặt chiều rộng tối thiểu
    height: 48, // Giống filter button height
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8,
  },
  mealTypeTextStyle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeMore: {
    fontSize: 14,
    color: COLORS.muted,
  },
  mealSection: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  mealScrollView: {
    marginBottom: SPACING.sm,
  },
  mealScrollContent: {
    paddingHorizontal: SPACING.md,
  },
  mealCard: {
    width: (width - SPACING.md * 2.5) / 2, // Show 2 items with spacing
    marginRight: SPACING.sm,
    backgroundColor: 'white',
    borderRadius: RADII.md,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: SPACING.xs,
    ...Platform.select({
    android: {
      elevation: 2, // Chỉ Android
    },
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 3.84,
    },
  }),
},
  mealImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.border,
  },
  heartIcon: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: SPACING.xs,
  },
  mealInfo: {
    padding: SPACING.md,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  mealDetails: {
    fontSize: 12,
    color: COLORS.text,
  },
});

export default HomeScreen;
