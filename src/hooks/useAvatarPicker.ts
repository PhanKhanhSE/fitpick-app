import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { userProfileAPI } from '../services/userProfileAPI';

export const useAvatarPicker = () => {
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Cần quyền truy cập',
          'Chúng tôi cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh đại diện.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }
    return null;
  };

  const uploadAvatar = async (imageUri: string) => {
    try {
      setIsUploading(true);
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        Alert.alert('Lỗi', 'File ảnh không tồn tại.');
        return null;
      }

      // Create file object for upload
      const avatarFile = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any;

      const response = await userProfileAPI.changeUserAvatar(avatarFile);
      
      if (response.success) {
        Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật thành công!');
        return response.data?.avatarUrl || imageUri;
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
        return null;
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật ảnh đại diện.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAvatar = async (onSuccess?: (newAvatarUrl: string) => void) => {
    try {
      const image = await pickImage();
      if (image) {
        const newAvatarUrl = await uploadAvatar(image.uri);
        if (newAvatarUrl && onSuccess) {
          onSuccess(newAvatarUrl);
        }
      }
    } catch (error) {
      console.error('Error in handleChangeAvatar:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi chọn ảnh.');
    }
  };

  return {
    handleChangeAvatar,
    isUploading,
  };
};
