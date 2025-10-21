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
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
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
      console.log('🧪 Testing avatar upload with Camera...');
      try {
        await userProfileAPI.testAvatarUpload(avatarFile);
        console.log('✅ Test upload successful, now trying real upload...');
      } catch (testError) {
        console.error('❌ Test upload failed:', testError);
        throw testError;
      }
      
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
      const photo = await takePhoto();
      if (!photo) return;

      console.log('📸 Photo taken:', {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        fileName: photo.fileName
      });

      const fileName = photo.fileName || `camera_${Date.now()}.jpg`;
      const mimeType = 'image/jpeg'; // Camera luôn tạo JPEG

      const newAvatarUrl = await uploadAvatar(photo.uri, fileName, mimeType);
      
      if (newAvatarUrl && onSuccess) {
        onSuccess(newAvatarUrl);
      }
    } catch (error) {
      console.error('Error in handleChangeAvatar:', error);
    }
  };

  return {
    isUploading,
    handleChangeAvatar,
  };
};
