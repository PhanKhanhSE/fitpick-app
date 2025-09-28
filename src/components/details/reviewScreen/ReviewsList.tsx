import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SPACING } from '../../../utils/theme';
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
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  return (
    <ScrollView style={styles.reviewsList} showsVerticalScrollIndicator={false}>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  reviewsList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
});

export default ReviewsList;