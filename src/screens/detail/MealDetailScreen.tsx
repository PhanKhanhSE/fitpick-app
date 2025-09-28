import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { COLORS } from '../../utils/theme';
import {
  MealDetailHeader,
  MealImageOverlay,
  MealTitleQuantity,
  NutritionSummary,
  MealDetailTabs,
  MealDetailActions,
} from '../../components/details';



interface MealDetailScreenProps {
  route: {
    params: {
      meal: {
        id: string;
        title: string;
        calories?: string;
        carbs?: string;
        protein?: string;
        fat?: string;
        price: string;
        image: any;
        cookingTime?: string;
        ingredients?: Array<{ name: string; amount: string }>;
        substitutions?: Array<{ original: string; substitute: string }>;
        instructions?: Array<string>;
      };
    };
  };
  navigation: any;
}

const MealDetailScreen: React.FC<MealDetailScreenProps> = ({ route, navigation }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Instructions' | 'Nutrition' | 'Reviews'>('Ingredients');
  const [scrollY] = useState(new Animated.Value(0));
  const [quantity, setQuantity] = useState(1);
  const { meal } = route.params;

  const defaultIngredients = [
    { name: 'Ức gà', amount: '200 gr' },
    { name: 'Xà lách', amount: '300 gr' },
    { name: 'Cà chua bi', amount: '10 trái' },
  ];
  const defaultInstructions = [
    'Rửa sạch và ướp ức gà với muối, tiêu và gia vị. Để thấm trong vài phút.',
    'Áp chảo ức gà với dầu gạo đến khi chín vàng đều hai mặt.',
    'Sơ chế rau: rửa sạch và cắt xà lách, cắt múi cau hành tây, bổ đôi cà chua bi, cắt lát trái ô liu.',
    'Pha nước sốt: 2 muỗng canh nước cốt chanh, 1 muỗng dầu gạo, ½ muỗng muối, 1 muỗng đường. Khuấy đều.',
    'Trộn đều rau củ với nước sốt, sau đó xếp ức gà đã cắt lát lên trên. Dọn ra đĩa và thưởng thức.',
  ];

  const ingredients = meal.ingredients || defaultIngredients;
  const instructions = meal.instructions || defaultInstructions;

  const handleGoBack = () => navigation.goBack();
  const handleToggleFavorite = () => setIsFavorite(!isFavorite);
  const handleAddToPlan = () => console.log('Add to meal plan');
  const handleAddToFavorites = () => console.log('Add to favorites');
  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleViewAllReviews = () => {
    navigation.navigate('ReviewsScreen', { 
      mealId: meal.id,
      mealTitle: meal.title 
    });
  };

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['transparent', COLORS.background],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header Overlay */}
      <MealDetailHeader
        onGoBack={handleGoBack}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Image */}
        <MealImageOverlay
          image={meal.image}
          cookingTime={meal.cookingTime}
          rating={4}
          reviewCount={12}
        />

        {/* Title + Quantity + Nutrition */}
        <View style={styles.contentContainer}>
          {/* Meal Title + Quantity Row */}
          <MealTitleQuantity
            title={meal.title}
            quantity={quantity}
            onIncreaseQuantity={increaseQty}
            onDecreaseQuantity={decreaseQty}
          />

          {/* Nutrition Summary */}
          <NutritionSummary
            calories={meal.calories}
            carbs={meal.carbs}
            protein={meal.protein}
            fat={meal.fat}
          />

          {/* Tabs */}
          <MealDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ingredients={ingredients}
            instructions={instructions}
            calories={meal.calories}
            carbs={meal.carbs}
            protein={meal.protein}
            fat={meal.fat}
            rating={4}
            reviewCount={12}
            onViewAllReviews={handleViewAllReviews}
          />
        </View>
      </Animated.ScrollView>

      {/* Bottom Buttons */}
      <MealDetailActions
        onAddToPlan={handleAddToPlan}
        onAddToFavorites={handleAddToFavorites}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  contentContainer: { 
    padding: 16 
  },
});

export default MealDetailScreen;
