import { useState } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useBase64Upload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const pickAndConvertToBase64 = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // Đọc file và convert sang base64
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        return {
          base64,
          fileName: file.name,
          mimeType: file.mimeType,
          size: file.size,
        };
      }
      return null;
    } catch (error) {
      console.error('Error picking and converting file:', error);
      Alert.alert('Lỗi', 'Không thể chọn file. Vui lòng thử lại.');
      return null;
    }
  };

  const uploadAvatarAsBase64 = async (base64Data: string, fileName: string, mimeType: string) => {
    try {
      setIsUploading(true);
      
      console.log('🧪 Testing base64 upload...');
      
      // Get token
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Send base64 data as JSON
      const response = await fetch('https://fondlingly-unheaped-amos.ngrok-free.dev/api/users/me/avatar-base64', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Data: `data:${mimeType};base64,${base64Data}`,
          fileName: fileName,
          mimeType: mimeType,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Base64 upload error:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('✅ Base64 upload response:', data);
      
      if (data.success) {
        Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật thành công!');
        return data.data?.avatarUrl;
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
        return null;
      }
    } catch (error) {
      console.error('Error uploading avatar as base64:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật ảnh đại diện.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAvatar = async (onSuccess?: (newAvatarUrl: string) => void) => {
    try {
      const fileData = await pickAndConvertToBase64();
      if (!fileData) return;

      console.log('📄 File converted to base64:', {
        fileName: fileData.fileName,
        mimeType: fileData.mimeType,
        size: fileData.size,
        base64Length: fileData.base64.length
      });

      const newAvatarUrl = await uploadAvatarAsBase64(
        fileData.base64, 
        fileData.fileName, 
        fileData.mimeType || 'image/jpeg'
      );
      
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
