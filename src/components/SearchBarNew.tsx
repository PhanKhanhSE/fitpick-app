import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SPACING } from '../utils/theme';

interface SearchBarNewProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  onClear?: () => void;
  showCancel?: boolean;
  onCancel?: () => void;
}

const SearchBarNew: React.FC<SearchBarNewProps> = ({
  value,
  onChangeText,
  placeholder = "Tìm kiếm món ăn...",
  onFilterPress,
  onFocus,
  onBlur,
  onSubmitEditing,
  onClear,
  showCancel = false,
  onCancel,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchBarContainer,
          isFocused && styles.searchBarFocused,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Search Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="search"
            size={20}
            color={isFocused ? COLORS.primary : COLORS.muted}
          />
        </View>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDim}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
        />

        {/* Clear Button - Only show when there's text */}
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}

        {/* Filter Button */}
        {onFilterPress && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <View style={styles.filterIconContainer}>
              <Ionicons name="options-outline" size={20} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Cancel Button - Show when focused */}
      {showCancel && isFocused && onCancel && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            handleBlur();
            onCancel();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    paddingHorizontal: SPACING.sm,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : SPACING.xs,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchBarFocused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
    paddingHorizontal: SPACING.xs,
    ...Platform.select({
      ios: {
        height: 30,
      },
      android: {
        height: 40,
      },
    }),
  },
  clearButton: {
    marginLeft: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xs / 2,
  },
  filterButton: {
    marginLeft: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconContainer: {
    padding: SPACING.xs / 2,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.primary + '15',
  },
  cancelButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default SearchBarNew;

