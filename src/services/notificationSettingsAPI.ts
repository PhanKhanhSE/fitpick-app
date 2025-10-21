import apiClient from './apiClient';

// Interface cho notification settings
export interface NotificationSettings {
  userId: number;
  notificationsEnabled: boolean;
}

export interface UpdateNotificationSettingsRequest {
  notificationsEnabled: boolean;
}

// Interface cho API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

// API service cho notification settings
export const notificationSettingsAPI = {
  // Lấy cài đặt thông báo của user hiện tại
  getNotificationSettings: async (): Promise<{ success: boolean; data?: NotificationSettings; message?: string }> => {
    try {
      const response = await apiClient.get('/api/notification-settings');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  // Cập nhật cài đặt thông báo
  updateNotificationSettings: async (settings: UpdateNotificationSettingsRequest): Promise<{ success: boolean; data?: NotificationSettings; message?: string }> => {
    try {
      const response = await apiClient.put('/api/notification-settings', settings);
      return response.data;
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }
};
