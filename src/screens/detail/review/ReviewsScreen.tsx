import React, { useState, Fragment, useEffect } from 'react';
import { StyleSheet, StatusBar, Alert, ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { COLORS, SPACING } from '../../../utils/theme';
import { SuccessModal } from '../../../components/menu';
import {
  ReviewsHeader,
  ReviewsList,
  AddReviewInput,
  AddReviewModal,
  Review,
} from '../../../components/details/reviewScreen';
import { mealReviewAPI, MealReview } from '../../../services/mealReviewAPI';
import { getUserAvatar } from '../../../utils/userUtils';

type ReviewsScreenProps = NativeStackScreenProps<RootStackParamList, 'ReviewsScreen'>;

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ navigation, route }) => {
  const { mealId, newReview: addedReview } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  // Load reviews từ API
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load cả reviews và user review
      const [reviewsResponse, userReviewResponse] = await Promise.all([
        mealReviewAPI.getMealReviews(parseInt(mealId)),
        mealReviewAPI.getUserReview(parseInt(mealId))
      ]);
      
      if (reviewsResponse.success) {
        // Convert MealReview từ API thành Review format cho UI
        const convertedReviews: Review[] = reviewsResponse.data.map((review: MealReview) => {
          // Ưu tiên avatar từ API, nếu không có thì dùng fallback
          let avatarUrl = review.userAvatar;
          if (!avatarUrl || avatarUrl.trim() === '') {
            // Tạo avatar dựa trên userName thay vì reviewId
            const userNameHash = review.userName.split('').reduce((a, b) => {
              a = ((a << 5) - a) + b.charCodeAt(0);
              return a & a;
            }, 0);
            avatarUrl = `https://i.pravatar.cc/100?img=${Math.abs(userNameHash) % 70 + 1}`;
          }
          
          return {
            id: review.reviewId.toString(),
            user: review.userName,
            date: formatDate(review.createdAt),
            rating: review.rating,
            content: review.comment,
            avatar: avatarUrl
          };
        });
        
        setReviews(convertedReviews);
      } else {
        setError('Không thể tải nhận xét');
      }
      
      // Xử lý user review
      if (userReviewResponse.success && userReviewResponse.data) {
        // Xử lý avatar cho user review
        let userAvatarUrl = userReviewResponse.data.userAvatar;
        if (!userAvatarUrl || userAvatarUrl.trim() === '') {
          // Tạo avatar dựa trên userName
          const userNameHash = userReviewResponse.data.userName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          userAvatarUrl = `https://i.pravatar.cc/100?img=${Math.abs(userNameHash) % 70 + 1}`;
        }
        
        const convertedUserReview: Review = {
          id: userReviewResponse.data.reviewId.toString(),
          user: userReviewResponse.data.userName,
          date: formatDate(userReviewResponse.data.createdAt),
          rating: userReviewResponse.data.rating,
          content: userReviewResponse.data.comment,
          avatar: userAvatarUrl
        };
        setUserReview(convertedUserReview);
      } else {
        setUserReview(null);
      }
      
    } catch (err: any) {

      setError(err.message || 'Có lỗi xảy ra khi tải nhận xét');
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày`;
    
    return date.toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    loadReviews();
  }, [mealId]);

  const handleAddReview = () => {
    setIsEditMode(false);
    setEditingReview(null);
    setModalVisible(true);
  };

  const handleEditReview = () => {
    setIsEditMode(true);
    setEditingReview(userReview);
    setModalVisible(true);
  };

  const handleDeleteReview = async () => {
    Alert.alert(
      'Xóa nhận xét',
      'Bạn có chắc chắn muốn xóa nhận xét này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmitting(true);
              const response = await mealReviewAPI.deleteReview(parseInt(mealId));
              
              if (response.success) {
                await loadReviews();
                Alert.alert('Thành công', 'Đã xóa nhận xét');
              } else {
                Alert.alert('Lỗi', 'Không thể xóa nhận xét');
              }
            } catch (error: any) {

              Alert.alert('Lỗi', error.message || 'Không thể xóa nhận xét');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const handleModalSubmit = async (rating: number, reviewText: string) => {
    try {
      setSubmitting(true);
      setModalVisible(false);
      
      if (isEditMode && editingReview) {
        // Edit mode - update existing review
        const response = await mealReviewAPI.updateReview(parseInt(mealId), {
          rating,
          comment: reviewText
        });
        
        if (response.success) {
          await loadReviews();
          setSuccessModalVisible(true);
          setTimeout(() => setSuccessModalVisible(false), 2000);
        } else {
          Alert.alert('Lỗi', 'Không thể cập nhật nhận xét. Vui lòng thử lại.');
        }
      } else {
        // Create mode - create new review
        const response = await mealReviewAPI.createReview({
          mealId: parseInt(mealId),
          rating,
          comment: reviewText
        });
        
        if (response.success) {
          await loadReviews();
          setSuccessModalVisible(true);
          setTimeout(() => setSuccessModalVisible(false), 2000);
        } else {
          Alert.alert('Lỗi', 'Không thể gửi nhận xét. Vui lòng thử lại.');
        }
      }
    } catch (err: any) {

      Alert.alert('Lỗi', err.message || 'Không thể gửi nhận xét. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out user review từ danh sách reviews để tránh duplicate
  const otherReviews = reviews.filter(review => 
    !userReview || review.id !== userReview.id
  );
  
  // Combine reviews với new review nếu có
  const allReviews = addedReview ? [addedReview, ...otherReviews] : otherReviews;

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ReviewsHeader onGoBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải nhận xét...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ReviewsHeader onGoBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={loadReviews}>
            Thử lại
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        <ReviewsHeader onGoBack={() => navigation.goBack()} />
        <ReviewsList 
          reviews={allReviews} 
          userReview={userReview}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
        />
        <AddReviewInput onPress={handleAddReview} />
      </SafeAreaView>

      <AddReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        isEditMode={isEditMode}
        editingReview={editingReview}
      />

      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message={isEditMode ? "Đã chỉnh sửa nhận xét thành công" : "Đã nhận xét món ăn thành công"}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textDim,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textDim,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ReviewsScreen;