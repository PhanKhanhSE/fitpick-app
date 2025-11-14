import apiClient from './apiClient';

// Interface cho notification data
export interface NotificationData {
  notificationId: number;
  userId?: number;
  title: string;
  message: string;
  typeId?: number;
  typeName?: string;
  isRead?: boolean;
  createdAt?: string;
  scheduledAt?: string;
}

// Interface cho notification type
export interface NotificationType {
  id: number;
  name: string;
}

// Interface cho API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

// API service cho notification functionality
export const notificationAPI = {
  // Lấy danh sách thông báo của user
  getUserNotifications: async (onlyUnread?: boolean): Promise<{ success: boolean; data?: NotificationData[]; message?: string }> => {
    try {
      const params = onlyUnread !== undefined ? `?onlyUnread=${onlyUnread}` : '';
      const response = await apiClient.get(`/api/notification/user${params}`);
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Gửi thông báo (chủ yếu cho admin)
  sendNotification: async (title: string, message: string, typeId?: number, scheduleAt?: string): Promise<{ success: boolean; data?: NotificationData; message?: string }> => {
    try {
      const response = await apiClient.post('/api/notification/send', {
        title,
        message,
        typeId,
        scheduleAt
      });
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Đánh dấu thông báo là đã đọc
  markAsRead: async (notificationId: number): Promise<{ success: boolean; data?: NotificationData; message?: string }> => {
    try {
      const response = await apiClient.put(`/api/notification/mark-read/${notificationId}`);
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Xóa thông báo
  deleteNotification: async (notificationId: number): Promise<{ success: boolean; data?: boolean; message?: string }> => {
    try {
      const response = await apiClient.delete(`/api/notification/delete/${notificationId}`);
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Lấy tất cả loại thông báo
  getNotificationTypes: async (): Promise<{ success: boolean; data?: NotificationType[]; message?: string }> => {
    try {
      const response = await apiClient.get('/api/notification/types');
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Tạo loại thông báo mới (chỉ admin)
  createNotificationType: async (name: string): Promise<{ success: boolean; data?: NotificationType; message?: string }> => {
    try {
      const response = await apiClient.post('/api/notification/types/create', {
        name
      });
      return response.data;
    } catch (error: any) {

      throw error;
    }
  },

  // Xóa loại thông báo (chỉ admin)
  deleteNotificationType: async (typeId: number): Promise<{ success: boolean; data?: boolean; message?: string }> => {
    try {
      const response = await apiClient.delete(`/api/notification/types/delete/${typeId}`);
      return response.data;
    } catch (error: any) {

      throw error;
    }
  }
};
