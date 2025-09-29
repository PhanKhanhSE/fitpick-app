import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../utils/theme';

interface StickyTabsWithDateProps {
  activeTab: 'nutrition' | 'posts';
  onTabChange: (tab: 'nutrition' | 'posts') => void;
  dateText: string;
  onPreviousDate: () => void;
  onNextDate: () => void;
}

const StickyTabsWithDate: React.FC<StickyTabsWithDateProps> = ({
  activeTab,
  onTabChange,
  dateText,
  onPreviousDate,
  onNextDate,
}) => {
  return (
    <View style={styles.stickyContainer}>
      {/* Profile Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
          onPress={() => onTabChange('nutrition')}
        >
          <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
            Thống kê Dinh dưỡng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => onTabChange('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Bài viết của tôi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Navigation */}
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateNavButton} onPress={onPreviousDate}>
          <Ionicons name="arrow-back-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{dateText}</Text>
        <TouchableOpacity style={styles.dateNavButton} onPress={onNextDate}>
          <Ionicons name="arrow-forward-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyContainer: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.umd,
    paddingTop: -SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: -SPACING.xs,
    marginHorizontal: SPACING.umd,
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.muted,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  dateNavButton: {
    padding: SPACING.xs,
    marginHorizontal: SPACING.umd,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
  },
});

export default StickyTabsWithDate;