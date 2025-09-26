import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../utils/theme';
import SearchBar from '../../components/SearchBar';
import PopularSection from '../../components/search/PopularSection';
import SuggestedSection from '../../components/search/SuggestedSection';

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

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
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
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
      isLocked: true,
    },
    {
      id: '4',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
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
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: true,
    },
    {
      id: '6',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
      calories: '0 kcal',
      time: '0 phút',
      image: { uri: 'https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg' },
      tag: 'Cân bằng',
      isLocked: true,
    },
    {
      id: '7',
      title: 'Cá hồi sốt tiêu kèm bơ xanh',
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
      isLocked: true,
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
    console.log('Meal pressed:', meal.title);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
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
