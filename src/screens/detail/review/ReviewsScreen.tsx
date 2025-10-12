import React, { useState, Fragment } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { COLORS } from '../../../utils/theme';
import { SuccessModal } from '../../../components/menu';
import {
  ReviewsHeader,
  ReviewsList,
  AddReviewInput,
  AddReviewModal,
  Review,
} from '../../../components/details/reviewScreen';

type ReviewsScreenProps = NativeStackScreenProps<RootStackParamList, 'ReviewsScreen'>;

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ navigation, route }) => {
  const { mealId, newReview: addedReview } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const mockReviews: Review[] = [
    {
      id: '1',
      user: 'user123',
      date: '1 ngày',
      rating: 5,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices. Vivamus ut lorem at nisl commodo placerat.',
      avatar: 'https://i.pravatar.cc/100?img=1'
    },
    {
      id: '2',
      user: 'user123',
      date: '1 ngày',
      rating: 4,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices. Vivamus ut lorem at nisl commodo placerat.',
      avatar: 'https://i.pravatar.cc/100?img=2'
    },
    {
      id: '3',
      user: 'user123',
      date: '1 ngày',
      rating: 5,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices. Vivamus ut lorem at nisl commodo placerat.',
      avatar: 'https://i.pravatar.cc/100?img=3'
    },
    {
      id: '4',
      user: 'user123',
      date: '1 ngày',
      rating: 5,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices. Vivamus ut lorem at nisl commodo placerat.',
      avatar: 'https://i.pravatar.cc/100?img=3'
    },
    {
      id: '5',
      user: 'user123',
      date: '1 ngày',
      rating: 5,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices. Vivamus ut lorem at nisl commodo placerat.',
      avatar: 'https://i.pravatar.cc/100?img=3'
    },
    {
      id: '6',
      user: 'user123',
      date: '1 ngày',
      rating: 5,
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices. Vivamus ut lorem at nisl commodo placerat.',
      avatar: 'https://i.pravatar.cc/100?img=3'
    },
  ];

  const handleAddReview = () => {
    setModalVisible(true);
  };

  const handleModalSubmit = (rating: number, reviewText: string) => {
    setModalVisible(false);
    
    setTimeout(() => {
      setSuccessModalVisible(true);
      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);
    }, 300);
  };

  // Combine mock reviews with new review if available
  const allReviews = addedReview ? [addedReview, ...mockReviews] : mockReviews;

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        <ReviewsHeader onGoBack={() => navigation.goBack()} />
        <ReviewsList reviews={allReviews} />
        <AddReviewInput onPress={handleAddReview} />
      </SafeAreaView>

      <AddReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
      />

      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message="Đã thêm vào danh sách sản phẩm"
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default ReviewsScreen;