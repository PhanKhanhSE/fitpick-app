import apiClient from './apiClient';
import { getUserInfo, getUserAvatar } from '../utils/userUtils';

// Interface cho Review từ backend
export interface MealReview {
  reviewId: number;
  rating: number;
  comment: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt?: string;
}

// Interface cho tạo review
export interface CreateReviewRequest {
  mealId: number;
  rating: number;
  comment: string;
}

// Interface cho cập nhật review
export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

// Interface cho API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

// Interface cho pagination response
export interface PagedReviewResponse {
  data: MealReview[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const mealReviewAPI = {
  // Lấy tất cả review của một món ăn
  getMealReviews: async (mealId: number): Promise<ApiResponse<MealReview[]>> => {
    try {
      const response = await apiClient.get(`/api/meal-reviews/meal/${mealId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching meal reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  // Lấy avatar của user hiện tại
  getUserAvatar: async (): Promise<string> => {
    return await getUserAvatar();
  },
  getUserReview: async (mealId: number): Promise<ApiResponse<MealReview | null>> => {
    try {
      // Sử dụng endpoint có sẵn để lấy tất cả reviews, sau đó filter ra review của user hiện tại
      const response = await apiClient.get(`/api/meal-reviews/meal/${mealId}`);
      
      if (response.data.success && response.data.data) {
        const reviews = response.data.data;
        
        // Lấy thông tin user hiện tại từ AsyncStorage
        const userInfo = await getUserInfo();
        
        if (userInfo) {
          // Tìm review của user hiện tại
          const userReview = reviews.find((review: MealReview) => 
            review.userName === userInfo.fullName || review.userName === userInfo.email
          );
          
          if (userReview) {
            // Cập nhật avatar với avatar thực của user
            const userAvatar = await getUserAvatar();
            userReview.userAvatar = userAvatar;
            return { success: true, data: userReview, message: 'User review found' };
          }
        }
        
        return { success: true, data: null, message: 'No user review found' };
      }
      
      return { success: true, data: null, message: 'No reviews found' };
    } catch (error: any) {
      console.error('Error fetching user review:', error);
      // Nếu không tìm thấy review (404), trả về null
      if (error.response?.status === 404) {
        return { success: true, data: null, message: 'No review found' };
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user review');
    }
  },

  // Tạo review mới
  createReview: async (data: CreateReviewRequest): Promise<ApiResponse<MealReview>> => {
    try {
      const response = await apiClient.post('/api/meal-reviews', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  },

  // Cập nhật review
  updateReview: async (mealId: number, data: UpdateReviewRequest): Promise<ApiResponse<MealReview>> => {
    try {
      const response = await apiClient.put(`/api/meal-reviews/${mealId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  },

  // Xóa review
  deleteReview: async (mealId: number): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.delete(`/api/meal-reviews/${mealId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting review:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  },

  // Lấy review với pagination (nếu backend hỗ trợ)
  getMealReviewsPaginated: async (
    mealId: number, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<ApiResponse<PagedReviewResponse>> => {
    try {
      const response = await apiClient.get(
        `/api/meal-reviews/meal/${mealId}/paginated?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching paginated reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch paginated reviews');
    }
  },

  // Lấy thống kê rating của món ăn
  getMealRatingStats: async (mealId: number): Promise<ApiResponse<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }>> => {
    try {
      const response = await apiClient.get(`/api/meal-reviews/meal/${mealId}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching rating stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch rating stats');
    }
  }
};
