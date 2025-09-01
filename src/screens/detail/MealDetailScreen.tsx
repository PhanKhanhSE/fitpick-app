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
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII, FONTS } from '../../utils/theme';
import AppButton from '../../components/AppButton';

const { width } = Dimensions.get('window');

interface MealDetailScreenProps {
  route: {
    params: {
      meal: {
        id: string;
        title: string;
        calories: string;
        price: string;
        image: any;
        cookingTime?: string;
        ingredients?: Array<{
          name: string;
          amount: string;
        }>;
        substitutions?: Array<{
          original: string;
          substitute: string;
        }>;
        instructions?: Array<string>;
      };
    };
  };
  navigation: any;
}

const MealDetailScreen: React.FC<MealDetailScreenProps> = ({ route, navigation }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const { meal } = route.params;

  const defaultIngredients = [
    { name: 'Ức gà', amount: '200 gr' },
    { name: 'Xà lách', amount: '300 gr' },
    { name: 'Cà chua bi', amount: '10 trái' },
  ];

  const defaultSubstitutions = [
    { original: 'Đậu hũ chiên áp chảo', substitute: 'Thay cho ức gà' },
    { original: 'Rau mầm', substitute: 'Thay cho xà lách' },
    { original: 'Cà chua thường', substitute: 'Thay cho cà chua bi' },
  ];

  const defaultInstructions = [
    'Rửa sạch và ướp ức gà với muối, tiêu và gia vị. Để thấm trong vài phút.',
    'Áp chảo ức gà với dầu gạo đến khi chín vàng đều hai mặt.',
    'Sơ chế rau: rửa sạch và cắt xà lách, cắt múi cau hành tây, bổ đôi cà chua bi, cắt lát trái ô liu.',
    'Pha nước sốt: 2 muỗng canh nước cốt chanh, 1 muỗng dầu gạo, ½ muỗng muối, 1 muỗng đường. Khuấy đều.',
    'Trộn đều rau củ với nước sốt, sau đó xếp ức gà đã cắt lát lên trên. Dọn ra đĩa và thưởng thức.',
  ];

  const ingredients = meal.ingredients || defaultIngredients;
  const substitutions = meal.substitutions || defaultSubstitutions;
  const instructions = meal.instructions || defaultInstructions;
  const cookingTime = meal.cookingTime || '15 phút';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToPlan = () => {
    // Handle add to meal plan
    console.log('Add to meal plan');
  };

  const handleAddToFavorites = () => {
    // Handle add to favorites
    console.log('Add to favorites');
  };

  // Animated values for header
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.8, 1],
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
      
      {/* Animated Sticky Header */}
      <Animated.View style={[
        styles.stickyHeader,
        {
          backgroundColor: headerBackgroundOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255, 255, 255, 0)', COLORS.background],
          })
        }
      ]}>
        <TouchableOpacity style={styles.stickyHeaderButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Animated.Text style={[
          styles.stickyHeaderTitle,
          { opacity: headerTitleOpacity }
        ]}>
          Chi tiết món ăn
        </Animated.Text>
        <TouchableOpacity style={styles.stickyHeaderButton} onPress={handleToggleFavorite}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? COLORS.primary : COLORS.text} 
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header with Image */}
        <View style={styles.imageContainer}>
          <Image source={meal.image} style={styles.mealImage} />
        </View>

        {/* Meal Info */}
        <View style={styles.contentContainer}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTitle}>{meal.title}</Text>
            <Text style={styles.mealPrice}>{meal.price}</Text>
          </View>

          <View style={styles.mealStats}>
            <View style={styles.statRowHorizontal}>
              <Text style={styles.statLabelHorizontal}>Thời gian chế biến</Text>
              <Text style={styles.statValueHorizontal}>{cookingTime}</Text>
            </View>
            <View style={styles.statRowHorizontal}>
              <Text style={styles.statLabelHorizontal}>Calories</Text>
              <Text style={styles.statValueHorizontal}>{meal.calories}</Text>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thành phần</Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
              </View>
            ))}
          </View>

          {/* Substitutions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gợi ý nguyên liệu thay thế</Text>
            {substitutions.map((sub, index) => (
              <View key={index} style={styles.substitutionItem}>
                <Text style={styles.substitutionOriginal}>{sub.original}</Text>
                <Text style={styles.substitutionNote}>{sub.substitute}</Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Các bước chuẩn bị</Text>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <AppButton
          title="Thêm vào Kế hoạch ăn uống"
          onPress={handleAddToPlan}
          filled={true}
          style={styles.primaryButton}
        />
        <AppButton
          title="Thêm vào Yêu thích"
          onPress={handleAddToFavorites}
          filled={false}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + SPACING.sm : 50,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stickyHeaderButton: {
    backgroundColor: COLORS.border,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  stickyHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  imageContainer: {
    position: 'relative',
    height: 350,
    marginTop: Platform.OS === 'android' ? -StatusBar.currentHeight! : 0, // Offset for translucent status bar on Android
  },
  mealImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.border,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mealTitle: {
    flex: 1,
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: SPACING.md,
  },
  mealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    alignSelf: 'center',
  },
  mealStats: {
    marginBottom: SPACING.xl,
  },
  statRowHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabelHorizontal: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: 'bold',
    flex: 1,
  },
  statValueHorizontal: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'right',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItemLeft: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: SPACING.md,
  },
  statItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  ingredientName: {
    fontSize: 18,
    color: COLORS.text,
  },
  ingredientAmount: {
    fontSize: 18,
    color: COLORS.muted,
  },
  substitutionItem: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  substitutionOriginal: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  substitutionNote: {
    fontSize: 14,
    color: COLORS.muted,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  bottomButtons: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  primaryButton: {
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    borderColor: COLORS.primary,
  },
});

export default MealDetailScreen;
