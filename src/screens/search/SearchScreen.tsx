import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, SPACING } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import PopularSection from '../../components/search/PopularSection';
import SuggestedSection from '../../components/search/SuggestedSection';
import PremiumModal from '../../components/home/PremiumModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Sample data for popular dishes
  const popularDishes = [
    {
      id: '1',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: false,
    },
    {
      id: '2',
      title: 'Thực đơn Premium đặc biệt',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: true,
    },
    {
      id: '3',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: false,
    },
    {
      id: '4',
      title: 'Món ăn VIP (Premium)',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: true,
    },
  ];

  // Sample data for suggested dishes
  const suggestedDishes = [
    {
      id: '3',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: false,
    },
    {
      id: '4',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: false,
    },
    {
      id: '5',
      title: 'Thực đơn Premium đặc biệt',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: true,
    },
    {
      id: '6',
      title: 'Món ăn VIP (Premium)',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: true,
    },
    {
      id: '7',
      title: 'Thực đơn thời thượng (Premium)',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: true,
    },
    {
      id: '8',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Bữa sáng',
      isLocked: false,
    },
  ];

  const handleFavoritePress = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleMealPress = (meal: any) => {
    if (meal.isLocked) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate('MealDetail', { meal });
    }
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
  };

  const handleUpgrade = () => {
    console.log('Upgrade to premium');
    setShowPremiumModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Search Bar */}
      <View style={styles.stickyHeader}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm"
          onFilterPress={handleFilterPress}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Section */}
        <PopularSection
          data={popularDishes}
          favorites={favorites}
          onMealPress={handleMealPress}
          onFavoritePress={handleFavoritePress}
        />

        {/* Suggested Section */}
        <SuggestedSection
          data={suggestedDishes}
          favorites={favorites}
          onMealPress={handleMealPress}
          onFavoritePress={handleFavoritePress}
        />
      </ScrollView>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={handleClosePremiumModal}
        onUpgrade={handleUpgrade}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: -SPACING.lg,
  },
  stickyHeader: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1000,
  },
});

export default SearchScreen;
