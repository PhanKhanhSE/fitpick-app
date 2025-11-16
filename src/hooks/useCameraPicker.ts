import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { userProfileAPI } from '../services/userProfileAPI';

export const useCameraPicker = () => {
  const [isUploading, setIsUploading] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền truy cập camera', 'Vui lòng cấp quyền truy cập camera để chụp ảnh đại diện.');
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return null;

    try {
      // Sửa deprecated warning: dùng array của MediaType thay vì MediaTypeOptions
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
      return null;
    }
  };

  const uploadAvatar = async (imageUri: string, fileName: string, mimeType: string) => {
    try {
      setIsUploading(true);
      
      const avatarFile = {
        uri: imageUri,
        type: mimeType,
        name: fileName,
      };

      // Test với test endpoint trước

      try {
        await userProfileAPI.testAvatarUpload(avatarFile);

      } catch (testError) {

        throw testError;
      }
      
      const response = await userProfileAPI.changeUserAvatar(avatarFile);
      
      console.log('Upload avatar response:', response);
      
      if (response && response.success) {
        const avatarUrl = response.data?.avatarUrl;
        if (avatarUrl) {
          Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật thành công!');
          return avatarUrl;
        } else {
          console.warn('No avatarUrl in response:', response);
          Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật, nhưng không nhận được URL mới.');
          return imageUri; // Return original URI as fallback
        }
      } else {
        console.error('Upload failed:', response);
        Alert.alert('Lỗi', response?.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
        return null;
      }
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      const errorMessage = error?.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện.';
      Alert.alert('Lỗi', errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAvatar = async (onSuccess?: (newAvatarUrl: string) => void) => {
    try {
      const photo = await takePhoto();
      if (!photo) return;

      const fileName = photo.fileName || `camera_${Date.now()}.jpg`;
      const mimeType = 'image/jpeg'; // Camera luôn tạo JPEG

      const newAvatarUrl = await uploadAvatar(photo.uri, fileName, mimeType);
      
      if (newAvatarUrl && onSuccess) {
        onSuccess(newAvatarUrl);
      }
    } catch (error) {

    }
  };

  return {
    isUploading,
    handleChangeAvatar,
  };
};
