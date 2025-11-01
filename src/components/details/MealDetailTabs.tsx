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
import { getUserAvatar } from '../../utils/userUtils';
import { COLORS, SPACING } from '../../utils/theme';

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
  avatar?: string;
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
  reviews?: Review[]; // Thêm prop để truyền reviews từ API
  userReview?: Review | null; // Review của user hiện tại
  onEditReview?: () => void; // Callback để edit review
  onDeleteReview?: () => void; // Callback để delete review
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
  reviews = [],
  userReview = null,
  onEditReview,
  onDeleteReview,
}) => {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'Ingredients', label: 'Nguyên liệu' },
    { key: 'Instructions', label: 'Hướng dẫn' },
    { key: 'Nutrition', label: 'Dinh dưỡng' },
    { key: 'Reviews', label: 'Nhận xét' },
  ];

  const nutritionData = [
    { label: 'Calo', value: calories },
    { label: 'Tinh bột', value: carbs },
    { label: 'Protein', value: protein },
    { label: 'Chất béo', value: fat },
  ];

  // Chỉ sử dụng reviews từ API, không có fallback mock data
  const displayReviews = reviews;

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

            {/* User Review (nếu có) */}
            {userReview && (
              <View style={[styles.reviewItem, styles.userReviewItem]}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Image
                    source={{ uri: userReview.avatar }}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.username}>Nhận xét của bạn</Text>
                      <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                        <TouchableOpacity onPress={onEditReview} style={styles.actionButton}>
                          <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDeleteReview} style={styles.actionButton}>
                          <Ionicons name="trash-outline" size={16} color="#FF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Ionicons
                          key={i}
                          name={i <= userReview.rating ? 'star' : 'star-outline'}
                          size={16}
                          color={COLORS.primary}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewContent}>{userReview.content}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Danh sách nhận xét khác */}
            {displayReviews.length > 0 ? (
              displayReviews.slice(0, 3).map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Image
                      source={{ uri: review.avatar || 'https://i.pravatar.cc/100?img=' + (index + 1) }}
                      style={styles.avatar}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.username}>{review.user}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
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
                      <Text style={styles.reviewContent}>{review.content}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : !userReview && (
              <View style={styles.emptyReviews}>
                <Text style={styles.emptyReviewsText}>Chưa có nhận xét nào</Text>
                <Text style={styles.emptyReviewsSubtext}>Hãy là người đầu tiên đánh giá món ăn này!</Text>
              </View>
            )}

            {/* Nút tối ưu - gộp viết nhận xét và xem thêm */}
            <TouchableOpacity 
              style={styles.optimizedReviewButton}
              onPress={onViewAllReviews}
            >
              <Ionicons 
                name={userReview ? "eye-outline" : "star"} 
                size={20} 
                color={COLORS.white} 
              />
              <Text style={styles.optimizedReviewText}>
                {userReview ? 'Xem tất cả nhận xét' : 'Viết nhận xét'}
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
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  emptyReviewsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDim,
    marginBottom: SPACING.xs,
  },
  emptyReviewsSubtext: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  writeReviewText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  userReviewItem: {
    backgroundColor: '#F8F9FF',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  actionButton: {
    padding: SPACING.xs,
    borderRadius: 4,
  },
  optimizedReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  optimizedReviewText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});

export default MealDetailTabs;