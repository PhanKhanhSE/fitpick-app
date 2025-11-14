import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../../components/AppButton';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { RootStackParamList } from '../../types/navigation';
import { profileAPI } from '../../services/profileAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CookingLevelNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CookingLevel'>;

type CookingLevel = 'beginner' | 'intermediate' | 'advanced';

// Mapping từ frontend keys sang database names
const COOKING_LEVEL_MAPPING: Record<string, string> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced'
};

interface CookingLevelOption {
  id: CookingLevel;
  title: string;
  description: string;
}

const cookingLevelOptions: CookingLevelOption[] = [
  {
    id: 'beginner',
    title: 'Sơ cấp',
    description: 'Bạn nấu được những món đơn giản, ít bước chuẩn bị và thường làm theo công thức.',
  },
  {
    id: 'intermediate',
    title: 'Trung cấp',
    description: 'Bạn tự tin hơn với món phức tạp, biết kết hợp nguyên liệu và linh hoạt điều chỉnh công thức.',
  },
  {
    id: 'advanced',
    title: 'Nâng cao',
    description: 'Bạn thành thạo kỹ thuật nấu ăn, sáng tạo món mới và kiểm soát tốt nguyên liệu, gia vị, thời gian.',
  },
];

const CookingLevelScreen: React.FC = () => {
  const navigation = useNavigation<CookingLevelNavigationProp>();
  const [selectedLevel, setSelectedLevel] = useState<CookingLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCookingLevel, setCurrentCookingLevel] = useState<string>('');

  // Load current cooking level when component mounts
  useEffect(() => {
    loadCurrentCookingLevel();
  }, []);

  const loadCurrentCookingLevel = async () => {
    try {
      // Check if this is settings flow
      const isSettingsFlow = navigation.getState().routes.some(route => 
        route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
      );

      if (isSettingsFlow) {
        // Try to get from API first
        try {
          const profileResponse = await profileAPI.getUserProfile();
          if (profileResponse.data?.cookingLevel) {
            setCurrentCookingLevel(profileResponse.data.cookingLevel);
            // Map cooking level to selected state
            const cookingLevelKey = mapCookingLevelToKey(profileResponse.data.cookingLevel);
            if (cookingLevelKey) {
              setSelectedLevel(cookingLevelKey);
            }
          }
        } catch (error) {

          // Fallback to AsyncStorage
          const storedCookingLevel = await AsyncStorage.getItem('userCookingLevel');
          if (storedCookingLevel) {
            setCurrentCookingLevel(storedCookingLevel);
            const cookingLevelKey = mapCookingLevelToKey(storedCookingLevel);
            if (cookingLevelKey) {
              setSelectedLevel(cookingLevelKey);
            }
          }
        }
      }
    } catch (error) {

    }
  };

  const mapCookingLevelToKey = (cookingLevel: string): CookingLevel | null => {
    const lowerCookingLevel = cookingLevel.toLowerCase();
    if (lowerCookingLevel.includes('beginner') || lowerCookingLevel.includes('sơ cấp')) return 'beginner';
    if (lowerCookingLevel.includes('intermediate') || lowerCookingLevel.includes('trung cấp')) return 'intermediate';
    if (lowerCookingLevel.includes('advanced') || lowerCookingLevel.includes('nâng cao')) return 'advanced';
    return null;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = async () => {
    if (!selectedLevel) {
      Alert.alert('Thông báo', 'Vui lòng chọn trình độ nấu ăn để tiếp tục');
      return;
    }

    // Kiểm tra nếu đang ở trong flow cài đặt
    const isSettingsFlow = navigation.getState().routes.some(route => 
      route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
    );
    
    if (isSettingsFlow) {
      // Nếu đang trong settings, lưu kỹ năng nấu ăn và quay lại
      setIsLoading(true);
      try {
        const cookingLevelName = COOKING_LEVEL_MAPPING[selectedLevel] || 'Beginner';
        await profileAPI.saveUserCookingLevel({ cookingLevel: cookingLevelName });
        
        // Also save to AsyncStorage for fallback
        await AsyncStorage.setItem('userCookingLevel', cookingLevelName);
        
        Alert.alert('Thành công', 'Trình độ nấu ăn đã được cập nhật');
        navigation.goBack();
      } catch (error: any) {

        const errorMessage = error?.message || 'Cập nhật trình độ nấu ăn thất bại. Vui lòng thử lại.';
        Alert.alert('Lỗi', errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Nếu đang trong flow đăng ký, lưu kỹ năng nấu ăn và hoàn thành onboarding
      setIsLoading(true);
      try {
        const cookingLevelName = COOKING_LEVEL_MAPPING[selectedLevel] || 'Beginner';
        await profileAPI.saveUserCookingLevel({ cookingLevel: cookingLevelName });
        
        // Also save to AsyncStorage for fallback
        await AsyncStorage.setItem('userCookingLevel', cookingLevelName);
        
        // Hoàn thành onboarding
        await profileAPI.completeOnboarding();
        
        // Chuyển sang màn hình Home
        navigation.navigate('MainTabs');
      } catch (error: any) {

        const errorMessage = error?.message || 'Lưu trình độ nấu ăn thất bại. Vui lòng thử lại.';
        Alert.alert('Lỗi', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderLevelOption = (option: CookingLevelOption) => {
    const isSelected = selectedLevel === option.id;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionContainer,
          isSelected && styles.selectedOption,
        ]}
        onPress={() => setSelectedLevel(option.id)}
      >
        <View style={styles.optionContent}>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
          
          <View style={[
            styles.radioButton,
            isSelected && styles.radioButtonSelected,
          ]}>
            {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Kỹ năng nấu ăn</Text>
          <Text style={styles.subtitle}>
            Chúng tôi sẽ gợi ý công thức phù hợp với kỹ năng nấu ăn của bạn.
          </Text>

          {/* Current Cooking Level Display */}
          {currentCookingLevel && (
            <View style={styles.currentCookingLevelContainer}>
              <Text style={styles.currentCookingLevelLabel}>Kỹ năng nấu ăn hiện tại:</Text>
              <Text style={styles.currentCookingLevelText}>{currentCookingLevel}</Text>
            </View>
          )}

          <View style={styles.optionsContainer}>
            {cookingLevelOptions.map(renderLevelOption)}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <View style={!selectedLevel && styles.disabledButton}>
          <AppButton
            title={isLoading 
              ? (navigation.getState().routes.some(route => 
                  route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
                ) ? "Đang lưu..." : "Đang hoàn thành...")
              : (navigation.getState().routes.some(route => 
                  route.name === 'SettingScreen' || route.name === 'PersonalNutritionScreen'
                ) ? "Lưu" : "Tiếp tục")
            }
            onPress={handleContinue}
            filled
            disabled={isLoading}
            style={StyleSheet.flatten([
              styles.continueButton,
              isLoading && styles.continueButtonDisabled
            ])}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textStrong,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textDim,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  currentCookingLevelContainer: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  currentCookingLevelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: SPACING.xs,
  },
  currentCookingLevelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0C4A6E',
  },
  optionsContainer: {
    gap: SPACING.md,
    },
    optionContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADII.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F8',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textStrong,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueButton: {
    width: '100%',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CookingLevelScreen;
