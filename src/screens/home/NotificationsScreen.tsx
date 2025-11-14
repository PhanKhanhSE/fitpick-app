import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADII, SPACING } from '../../utils/theme';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationData } from '../../services/notificationAPI';

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  
  const {
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
    clearError
  } = useNotifications();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  const handleTabChange = async (tab: 'all' | 'unread') => {
    setSelectedTab(tab);
    if (tab === 'all') {
      await loadAllNotifications();
    } else {
      await loadUnreadNotifications();
    }
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    if (!notification.isRead) {
      await markAsRead(notification.notificationId);
    }
  };

  const handleDeleteNotification = (notification: NotificationData) => {
    Alert.alert(
      'Xóa thông báo',
      'Bạn có chắc chắn muốn xóa thông báo này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => deleteNotification(notification.notificationId)
        }
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      Alert.alert(
        'Đánh dấu tất cả',
        'Đánh dấu tất cả thông báo là đã đọc?',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đồng ý', onPress: markAllAsRead }
        ]
      );
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Vừa xong';
    
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần trước`;
  };

  const getNotificationIcon = (typeName?: string) => {
    switch (typeName?.toLowerCase()) {
      case 'meal_plan':
        return '🍽️';
      case 'favorite':
        return '❤️';
      case 'reminder':
        return '⏰';
      case 'system':
        return '🔔';
      case 'promotion':
        return '🎉';
      default:
        return '📢';
    }
  };

  const filteredNotifications = selectedTab === 'unread' 
    ? notifications.filter(notif => !notif.isRead)
    : notifications;

  const renderNotificationItem = ({ item }: { item: NotificationData }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getNotificationIcon(item.typeName)}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[
          styles.title,
          !item.isRead && styles.unreadTitle
        ]}>
          {item.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>
          {formatTimeAgo(item.createdAt)}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(item)}
      >
        <Ionicons name="close" size={16} color={COLORS.textDim} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-outline" size={64} color={COLORS.textDim} />
      <Text style={styles.emptyTitle}>
        {selectedTab === 'unread' ? 'Không có thông báo mới' : 'Chưa có thông báo nào'}
      </Text>
      <Text style={styles.emptyMessage}>
        {selectedTab === 'unread' 
          ? 'Tất cả thông báo đã được đọc'
          : 'Các thông báo mới sẽ xuất hiện ở đây'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f7" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thông báo</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Đánh dấu tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => handleTabChange('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'unread' && styles.activeTab]}
          onPress={() => handleTabChange('unread')}
        >
          <Text style={[styles.tabText, selectedTab === 'unread' && styles.activeTabText]}>
            Chưa đọc ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.notificationId.toString()}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          renderItem={renderNotificationItem}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorDismiss}>Đóng</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 35,
    backgroundColor: COLORS.background,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.sm,
  },
  markAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: RADII.sm,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDim,
  },
  activeTabText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textDim,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: RADII.md,
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: RADII.xl,
    marginRight: 12,
    marginTop: SPACING.xs,
    backgroundColor: COLORS.process,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  textContainer: { 
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '400',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 20,
    marginBottom: 4,
  },
  time: { 
    fontSize: 12, 
    color: COLORS.textDim,
  },
  deleteButton: {
    padding: 4,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: RADII.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#d32f2f',
  },
  errorDismiss: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
});

export default NotificationScreen;
