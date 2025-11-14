import { useState } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { userProfileAPI } from '../services/userProfileAPI';

export const useDocumentPicker = () => {
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'], // Chỉ cho phép chọn file ảnh
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể chọn file. Vui lòng thử lại.');
      return null;
    }
  };

  const uploadAvatar = async (fileUri: string, fileName: string, mimeType: string) => {
    try {
      setIsUploading(true);
      
      const avatarFile = {
        uri: fileUri,
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
      
      if (response.success) {
        Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật thành công!');
        return response.data?.avatarUrl || fileUri;
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
        return null;
      }
    } catch (error) {

      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật ảnh đại diện.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAvatar = async (onSuccess?: (newAvatarUrl: string) => void) => {
    try {
      const document = await pickDocument();
      if (!document) return;

      const newAvatarUrl = await uploadAvatar(document.uri, document.name, document.mimeType || 'image/jpeg');
      
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
