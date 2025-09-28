import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../../utils/theme';

interface Review {
  id: string;
  user: string;
  date: string;
  rating: number;
  content: string;
  avatar: string;
}

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color={star <= rating ? COLORS.primary : '#E0E0E0'}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.reviewItem}>
      <Image source={{ uri: review.avatar }} style={styles.avatar} />
      
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Text style={styles.username}>{review.user}</Text>
          <Text style={styles.reviewDate}>· {review.date}</Text>
        </View>
        
        {renderStars(review.rating)}
        
        <Text style={styles.reviewText}>{review.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewDate: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
});

export default ReviewItem;