import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, COLORS } from '../../../utils/theme';
import ReviewItem from './ReviewItem';

interface Review {
  id: string;
  user: string;
  date: string;
  rating: number;
  content: string;
  avatar: string;
}

interface ReviewsListProps {
  reviews: Review[];
  userReview?: Review | null;
  onEditReview?: () => void;
  onDeleteReview?: () => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  userReview, 
  onEditReview, 
  onDeleteReview 
}) => {
  return (
    <ScrollView style={styles.reviewsList} showsVerticalScrollIndicator={false}>
      {/* User Review Section */}
      {userReview && (
        <View style={styles.userReviewSection}>
          <Text style={styles.sectionTitle}>Nhận xét của bạn</Text>
          <View style={styles.userReviewItem}>
            <View style={styles.reviewHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: userReview.avatar }} style={styles.avatar} />
                <View style={styles.userDetails}>
                  <Text style={styles.username}>{userReview.user}</Text>
                  <Text style={styles.reviewDate}>{userReview.date}</Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={onEditReview} style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDeleteReview} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons
                  key={i}
                  name={i <= userReview.rating ? 'star' : 'star-outline'}
                  size={18}
                  color={COLORS.primary}
                />
              ))}
            </View>
            
            <Text style={styles.reviewContent}>{userReview.content}</Text>
          </View>
        </View>
      )}
      
      {/* Other Reviews Section */}
      {reviews.length > 0 && (
        <View style={styles.otherReviewsSection}>
          <Text style={styles.sectionTitle}>
            Nhận xét khác ({reviews.length})
          </Text>
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  reviewsList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  userReviewSection: {
    marginBottom: SPACING.lg,
  },
  otherReviewsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  userReviewItem: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textDim,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  reviewContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default ReviewsList;