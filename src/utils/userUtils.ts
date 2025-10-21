import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys constants
const STORAGE_KEYS = {
  USER: 'user',
} as const;

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  AvatarUrl?: string; // Backend field (với A viết hoa)
  avatarUrl?: string; // Fallback field
  avatar?: string; // Another fallback field
}

// Type guard for user info validation
const isValidUserInfo = (userInfo: any): userInfo is UserInfo => {
  return userInfo && 
         typeof userInfo.id === 'number' && 
         typeof userInfo.fullName === 'string' && 
         typeof userInfo.email === 'string';
};

/**
 * Retrieves user information from AsyncStorage
 * @returns Promise<UserInfo | null> - User info object or null if not found
 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      // Validate the parsed data
      if (isValidUserInfo(parsedUserInfo)) {
        return parsedUserInfo;
      } else {
        console.warn('Invalid user info format in storage');
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

/**
 * Retrieves user avatar URL with fallback options
 * @returns Promise<string> - Avatar URL or default avatar
 */
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

/**
 * Retrieves user name with fallback options
 * @returns Promise<string> - User name or 'Anonymous'
 */
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

/**
 * Clears user data from AsyncStorage
 * @returns Promise<void>
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    console.log('User data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

/**
 * Saves user information to AsyncStorage
 * @param userInfo - User information to save
 * @returns Promise<void>
 */
export const saveUserInfo = async (userInfo: UserInfo): Promise<void> => {
  try {
    if (isValidUserInfo(userInfo)) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));
      console.log('User info saved successfully');
    } else {
      console.error('Invalid user info format');
      throw new Error('Invalid user info format');
    }
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
};
