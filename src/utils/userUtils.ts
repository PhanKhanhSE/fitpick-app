import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  AvatarUrl?: string; // Backend field (với A viết hoa)
  avatarUrl?: string; // Fallback field
  avatar?: string; // Another fallback field
}

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const userInfo = await AsyncStorage.getItem('user');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const getUserAvatar = async (): Promise<string> => {
  try {
    console.log('🔍 Getting user info for avatar...');
    const userInfo = await getUserInfo();
    console.log('🔍 User info:', userInfo);
    
    if (userInfo) {
      // Backend sử dụng AvatarUrl (với A viết hoa)
      const avatarUrl = userInfo.AvatarUrl || userInfo.avatarUrl || userInfo.avatar || `https://i.pravatar.cc/100?img=${userInfo.id || 1}`;
      console.log('🔍 Avatar URL:', avatarUrl);
      return avatarUrl;
    }
    console.log('🔍 No user info found, using default avatar');
    return 'https://i.pravatar.cc/100?img=1'; // Default avatar
  } catch (error) {
    console.error('Error getting user avatar:', error);
    return 'https://i.pravatar.cc/100?img=1';
  }
};

export const getUserName = async (): Promise<string> => {
  try {
    const userInfo = await getUserInfo();
    if (userInfo) {
      return userInfo.fullName || userInfo.email || 'Anonymous';
    }
    return 'Anonymous';
  } catch (error) {
    console.error('Error getting user name:', error);
    return 'Anonymous';
  }
};
