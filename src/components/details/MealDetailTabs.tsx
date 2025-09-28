import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SPACING } from '../../utils/theme';

type TabType = 'Ingredients' | 'Instructions' | 'Nutrition' | 'Reviews';

interface Ingredient {
  name: string;
  amount: string;
}

interface Review {
  user: string;
  date: string;
  rating: number;
  content: string;
}

interface MealDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  ingredients: Ingredient[];
  instructions: string[];
  calories?: string;
  carbs?: string;
  protein?: string;
  fat?: string;
  rating?: number;
  reviewCount?: number;
  onViewAllReviews?: () => void;
}

const MealDetailTabs: React.FC<MealDetailTabsProps> = ({
  activeTab,
  onTabChange,
  ingredients,
  instructions,
  calories = '000 kcal',
  carbs = '000 g',
  protein = '000 g',
  fat = '000 g',
  rating = 4,
  reviewCount = 0,
  onViewAllReviews,
}) => {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'Ingredients', label: 'Nguyên liệu' },
    { key: 'Instructions', label: 'Hướng dẫn' },
    { key: 'Nutrition', label: 'Dinh dưỡng' },
    { key: 'Reviews', label: 'Nhận xét' },
  ];

  const nutritionData = [
    { label: 'Calories', value: calories },
    { label: 'Tinh bột', value: carbs },
    { label: 'Protein', value: protein },
    { label: 'Chất béo', value: fat },
  ];

  const mockReviews: Review[] = [
    { user: 'user123', date: '1 ngày', rating: 5, content: 'Món ăn ngon và dễ làm, nguyên liệu tươi.' },
    { user: 'user456', date: '2 ngày', rating: 4, content: 'Hướng dẫn chi tiết, nhưng hơi tốn thời gian.' },
    { user: 'user789', date: '3 ngày', rating: 3, content: 'Hương vị ổn, nhưng gia vị hơi nhạt.' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Ingredients':
        return (
          <View style={styles.ingredientsBox}>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
              </View>
            ))}
          </View>
        );

      case 'Instructions':
        return (
          <View>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        );

      case 'Nutrition':
        return (
          <View style={styles.ingredientsBox}>
            {nutritionData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.ingredientItem,
                  index === 0 && { borderTopWidth: 0 },
                  index === 3 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.ingredientName}>{item.label}</Text>
                <Text style={styles.ingredientAmount}>{item.value}</Text>
              </View>
            ))}
          </View>
        );

      case 'Reviews':
        return (
          <View style={{ paddingVertical: SPACING.xs }}>
            {/* Khung tổng quan đánh giá */}
            <View style={styles.reviewSummary}>
              <View style={styles.ratingSection}>
                <Text style={styles.reviewScore}>{rating}</Text>
                <Text style={styles.ratingOutOf}> / 5</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= rating ? "star" : "star-outline"}
                      size={18}
                      color={star <= rating ? COLORS.primary : '#E0E0E0'}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.reviewCount}>{reviewCount.toString().padStart(2, '0')} nhận xét</Text>
              </View>
            </View>

            {/* Danh sách nhận xét */}
            {mockReviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  {/* Avatar giả */}
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/100?img=' + (index + 1) }}
                    style={styles.avatar}
                  />

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    {/* Username + Ngày */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.username}>{review.user}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>

                    {/* Rating */}
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Ionicons
                          key={i}
                          name={i <= review.rating ? 'star' : 'star-outline'}
                          size={16}
                          color={COLORS.primary}
                        />
                      ))}
                    </View>

                    {/* Nội dung */}
                    <Text style={styles.reviewContent}>{review.content}</Text>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity 
              style={{ alignItems: 'center', marginTop: SPACING.md }}
              onPress={onViewAllReviews}
            >
              <Text style={{ color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' }}>
                xem thêm
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Tabs
  tabContainer: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border, 
    marginTop: SPACING.md 
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: SPACING.sm, 
    alignItems: 'center', 
    paddingBottom: -SPACING.xs,
  },
  tabButtonActive: { 
    borderBottomWidth: 2, 
    borderBottomColor: COLORS.primary 
  },
  tabText: { 
    fontSize: 16, 
    color: COLORS.muted 
  },
  tabTextActive: { 
    color: COLORS.primary, 
    fontWeight: 'bold' 
  },
  tabContent: { 
    marginTop: SPACING.md, 
    paddingBottom: SPACING.lg 
  },

  // Ingredients / Nutrition box
  ingredientsBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  ingredientItem: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ingredientName: { 
    fontSize: 16, 
    color: COLORS.text, 
    flex: 1 
  },
  ingredientAmount: { 
    fontSize: 16, 
    color: COLORS.muted, 
    textAlign: 'right', 
    minWidth: 60 
  },
  
  instructionItem: { 
    flexDirection: 'row', 
    marginBottom: SPACING.md 
  },
  instructionText: { 
    flex: 1, 
    fontSize: 16, 
    color: COLORS.text, 
    lineHeight: 24 
  },
  stepNumber: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: SPACING.md, 
    marginTop: 2 
  },
  stepNumberText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: 'white' 
  },

  // Reviews
  reviewSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING.umd,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingSection: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: SPACING.sm,
  },
  reviewScore: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.text,
  },
  ratingOutOf: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: SPACING.sm,
  },
  reviewCount: { 
    fontSize: 14, 
    color: '#999' 
  },

  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.under_process,
    paddingVertical: SPACING.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
  },
  username: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: COLORS.text 
  },
  reviewDate: { 
    fontSize: 12, 
    color: COLORS.muted 
  },
  reviewContent: { 
    fontSize: 14, 
    color: COLORS.text, 
    lineHeight: 20, 
    marginTop: 4 
  },
});

export default MealDetailTabs;