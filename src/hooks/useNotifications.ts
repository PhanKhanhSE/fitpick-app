import { useState, useEffect, useCallback } from 'react';
import { notificationAPI, NotificationData } from '../services/notificationAPI';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notifications từ API
  const loadNotifications = useCallback(async (onlyUnread?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationAPI.getUserNotifications(onlyUnread);
      
      if (response.success && response.data) {
        setNotifications(response.data);
        
        // Đếm số thông báo chưa đọc
        const unreadNotifications = response.data.filter(notif => !notif.isRead);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (err: any) {

      setError(err.message || 'Có lỗi xảy ra khi tải thông báo');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tất cả thông báo
  const loadAllNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Load chỉ thông báo chưa đọc
  const loadUnreadNotifications = useCallback(() => {
    loadNotifications(true);
  }, [loadNotifications]);

  // Đánh dấu thông báo là đã đọc
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await notificationAPI.markAsRead(notificationId);
      
      if (response.success) {
        // Cập nhật state local
        setNotifications(prev => 
          prev.map(notif => 
            notif.notificationId === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        
        // Giảm số thông báo chưa đọc
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {

      setError(err.message || 'Có lỗi xảy ra khi đánh dấu thông báo');
    }
  }, []);

  // Xóa thông báo
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await notificationAPI.deleteNotification(notificationId);
      
      if (response.success) {
        // Xóa khỏi state local
        setNotifications(prev => {
          const notification = prev.find(notif => notif.notificationId === notificationId);
          const newNotifications = prev.filter(notif => notif.notificationId !== notificationId);
          
          // Giảm số thông báo chưa đọc nếu thông báo bị xóa chưa đọc
          if (notification && !notification.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
          
          return newNotifications;
        });
      }
    } catch (err: any) {

      setError(err.message || 'Có lỗi xảy ra khi xóa thông báo');
    }
  }, []);

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.isRead);
      
      // Gọi API cho từng thông báo chưa đọc
      await Promise.all(
        unreadNotifications.map(notif => 
          notificationAPI.markAsRead(notif.notificationId)
        )
      );
      
      // Cập nhật state local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (err: any) {

      setError(err.message || 'Có lỗi xảy ra khi đánh dấu tất cả thông báo');
    }
  }, [notifications]);

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    loadAllNotifications();
  }, [loadAllNotifications]);

  // Load notifications khi component mount
  useEffect(() => {
    loadAllNotifications();
  }, [loadAllNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadAllNotifications,
    loadUnreadNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    refreshNotifications,
    clearError: () => setError(null)
  };
};
