import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADII } from '../../../utils/theme';
import { userProfileAPI, settingsAPI } from '../../../services/userProfileAPI';
import AppButton from '../../../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDocumentPicker } from '../../../hooks/useDocumentPicker';

type NavigationProp = any;

interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  accountType: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  country?: string;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const { handleChangeAvatar, isUploading } = useDocumentPicker();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    accountType: 'FREE',
    gender: '',
    age: 0,
    height: 0,
    weight: 0,
    country: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userProfileAPI.getCurrentUserProfile();
      const profile = response.data;
      
      setUserProfile({
        fullName: profile.fullname || '',
        email: profile.email || '',
        phone: profile.phone || '',
        avatarUrl: profile.avatarUrl || '',
        accountType: profile.accountType || 'FREE',
        gender: profile.gender || '',
        age: profile.age || 0,
        height: profile.height || 0,
        weight: profile.weight || 0,
        country: profile.country || '',
      });
    } catch (error) {

      // Fallback to stored data
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setUserProfile({
            fullName: parsedProfile.fullName || '',
            email: parsedProfile.email || '',
            phone: parsedProfile.phone || '',
            avatarUrl: parsedProfile.avatarUrl || '',
            accountType: parsedProfile.accountType || 'FREE',
            gender: parsedProfile.gender || '',
            age: parsedProfile.age || 0,
            height: parsedProfile.height || 0,
            weight: parsedProfile.weight || 0,
            country: parsedProfile.country || '',
          });
        }
      } catch (storageError) {

      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile.fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên');
      return;
    }

    // Email validation removed as email field is hidden
    // if (!userProfile.email.trim()) {
    //   Alert.alert('Lỗi', 'Vui lòng nhập email');
    //   return;
    // }

    // Validate email format - removed as email field is hidden
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(userProfile.email)) {
    //   Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ');
    //   return;
    // }

    try {
      setLoading(true);
      const updateData = {
        fullname: userProfile.fullName,
        // email: userProfile.email, // Removed as email field is hidden
        age: userProfile.age,
        height: userProfile.height,
        weight: userProfile.weight,
        country: userProfile.country,
      };
      
      await settingsAPI.updateProfile(updateData);
      Alert.alert('Thành công', 'Thông tin đã được cập nhật thành công!');
      navigation.goBack();
    } catch (error) {

      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = () => {
    handleChangeAvatar((newAvatarUrl) => {
      setUserProfile(prev => ({
        ...prev,
        avatarUrl: newAvatarUrl
      }));
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarChange}>
            {userProfile.avatarUrl ? (
              <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={COLORS.muted} />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarText}>Thay đổi ảnh đại diện</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên *</Text>
            <TextInput
              style={styles.input}
              value={userProfile.fullName}
              onChangeText={(text) => setUserProfile({ ...userProfile, fullName: text })}
              placeholder="Nhập tên của bạn"
              placeholderTextColor={COLORS.muted}
            />
          </View>

          {/* Email field - Hidden as requested */}
          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={userProfile.email}
              onChangeText={(text) => setUserProfile({ ...userProfile, email: text })}
              placeholder="Nhập email của bạn"
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View> */}


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tuổi</Text>
            <TextInput
              style={styles.input}
              value={userProfile.age ? userProfile.age.toString() : ''}
              onChangeText={(text) => setUserProfile({ ...userProfile, age: parseInt(text) || 0 })}
              placeholder="Nhập tuổi"
              placeholderTextColor={COLORS.muted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chiều cao (cm)</Text>
            <TextInput
              style={styles.input}
              value={userProfile.height ? userProfile.height.toString() : ''}
              onChangeText={(text) => setUserProfile({ ...userProfile, height: parseInt(text) || 0 })}
              placeholder="Nhập chiều cao"
              placeholderTextColor={COLORS.muted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cân nặng (kg)</Text>
            <TextInput
              style={styles.input}
              value={userProfile.weight ? userProfile.weight.toString() : ''}
              onChangeText={(text) => setUserProfile({ ...userProfile, weight: parseInt(text) || 0 })}
              placeholder="Nhập cân nặng"
              placeholderTextColor={COLORS.muted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quốc gia</Text>
            <TextInput
              style={styles.input}
              value={userProfile.country}
              onChangeText={(text) => setUserProfile({ ...userProfile, country: text })}
              placeholder="Nhập quốc gia"
              placeholderTextColor={COLORS.muted}
            />
          </View>

        </View>

        {/* Save Button */}
        <AppButton
          title="Lưu thay đổi"
          onPress={handleSaveProfile}
          filled
          style={styles.saveButton}
          textStyle={{ fontWeight: '600', fontSize: 14 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
  },
  backButton: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.muted,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  saveButton: {
    borderRadius: RADII.md,
    marginBottom: SPACING.xl,
  },
});

export default EditProfileScreen;
