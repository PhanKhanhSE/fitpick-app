import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    // Sửa deprecated warning: dùng array của MediaType thay vì MediaTypeOptions
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }
    return null;
  };

  const uploadAvatarAsBase64 = async (imageUri: string) => {
    try {
      setIsUploading(true);

      // Get token
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Đọc file và convert sang base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64' as any,
      });

      // Xác định mime type từ file extension
      const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = fileExtension === 'png' ? 'image/png' : 
                     fileExtension === 'gif' ? 'image/gif' : 
                     'image/jpeg';

      // Send base64 data as JSON (giống như useBase64Upload)
      const response = await fetch('https://fitpick-be.onrender.com/api/users/me/avatar-base64', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Data: `data:${mimeType};base64,${base64}`,
          fileName: `avatar.${fileExtension}`,
          mimeType: mimeType,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Avatar upload error:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();

      if (data.success) {
        Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật thành công!');
        return data.data?.avatarUrl;
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
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
      const image = await pickImage();
      if (image) {
        const newAvatarUrl = await uploadAvatarAsBase64(image.uri);
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
