import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, FONTS } from '../../utils/theme';

const { width } = Dimensions.get('window');

interface MealCardProps {
  title: string;
  calories: string;
  price: string;
  image: any;
}

const MealCard: React.FC<MealCardProps> = ({ title, calories, price, image }) => (
  <View style={styles.mealCard}>
    <Image source={image} style={styles.mealImage} />
    <TouchableOpacity style={styles.heartIcon}>
      <Ionicons name="heart-outline" size={20} color="white" />
    </TouchableOpacity>
    <View style={styles.mealInfo}>
      <Text style={styles.mealTitle}>{title}</Text>
      <Text style={styles.mealDetails}>{calories} | {price}</Text>
    </View>
  </View>
);

const HomeScreen: React.FC = () => {
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
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
              placeholderTextColor={COLORS.muted}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Meal Type Buttons */}
        <View style={styles.mealTypeContainer}>
          <TouchableOpacity style={[styles.mealTypeButton, styles.activeMealType]}>
            <Text style={styles.mealTypeTextActive}>Bữa sáng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mealTypeButton}>
            <Text style={styles.mealTypeText}>Bữa trưa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mealTypeButton}>
            <Text style={styles.mealTypeText}>Bữa tối</Text>
          </TouchableOpacity>
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
          <MealCard
            title="Sữa chua trái cây tươi"
            calories="300 kcal"
            price="30.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
          <MealCard
            title="Cuốn ức gà rau củ"
            calories="500 kcal"
            price="55.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
          <MealCard
            title="Bánh mì alpaca"
            calories="400 kcal"
            price="40.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
          <MealCard
            title="Salad bơ tương ớt"
            calories="350 kcal"
            price="45.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
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
          <MealCard
            title="Cá hồi sốt tiêu kèm bơ xanh"
            calories="300 kcal"
            price="30.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
          <MealCard
            title="Bánh bí yến mạch"
            calories="500 kcal"
            price="55.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
          <MealCard
            title="Gà nướng mật ong"
            calories="450 kcal"
            price="60.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
          <MealCard
            title="Soup bí đỏ hạt chia"
            calories="280 kcal"
            price="35.000đ"
            image={{ uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' }} // Placeholder image
          />
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONTS.base,
    color: COLORS.text,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeMealType: {
    backgroundColor: COLORS.primary,
  },
  mealTypeText: {
    color: 'white',
    fontSize: FONTS.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  mealTypeTextActive: {
    color: 'white',
    fontSize: FONTS.base,
    fontWeight: '600',
    textAlign: 'center',
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
    width: (width - SPACING.md * 3) / 2, // Show 2 items with spacing
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
