import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

interface SearchHistoryProps {
  searchHistory: string[];
  onHistoryPress: (text: string) => void;
  onRemoveItem: (index: number) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  searchHistory,
  onHistoryPress,
  onRemoveItem,
}) => {
  return (
    <ScrollView style={styles.searchHistoryContainer}>
      {searchHistory.length > 0 && (
        <View style={styles.historySection}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity
              key={`history-${item}-${index}`}
              style={styles.historyItem}
              onPress={() => onHistoryPress(item)}
            >
              <Ionicons name="time-outline" size={16} color="#9CA3AF" />
              <Text style={styles.historyItemText}>{item}</Text>
              <TouchableOpacity onPress={() => onRemoveItem(index)}>
                <Ionicons name="close" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchHistoryContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  historySection: {
    marginTop: SPACING.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyItemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});

export default SearchHistory;