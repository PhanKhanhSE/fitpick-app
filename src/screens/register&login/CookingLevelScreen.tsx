import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../../components/AppButton';
import { COLORS, SPACING, RADII } from '../../utils/theme';
import { RootStackParamList } from '../../types/navigation';

type CookingLevelNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CookingLevel'>;

type CookingLevel = 'beginner' | 'intermediate' | 'advanced';

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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    if (selectedLevel) {
      // Chuyển sang màn hình Home (MainTabs)
      navigation.navigate('MainTabs');
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

          <View style={styles.optionsContainer}>
            {cookingLevelOptions.map(renderLevelOption)}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <View style={!selectedLevel && styles.disabledButton}>
          <AppButton
            title="Tiếp tục"
            onPress={handleContinue}
            filled
            style={styles.continueButton}
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
  disabledButton: {
    opacity: 0.5,
  },
});

export default CookingLevelScreen;
