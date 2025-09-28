export { default as ReviewsHeader } from './ReviewsHeader';
export { default as ReviewItem } from './ReviewItem';
export { default as ReviewsList } from './ReviewsList';
export { default as AddReviewInput } from './AddReviewInput';
export { default as AddReviewModal } from './AddReviewModal';

// Export types
export interface Review {
  id: string;
  user: string;
  date: string;
  rating: number;
  content: string;
  avatar: string;
}