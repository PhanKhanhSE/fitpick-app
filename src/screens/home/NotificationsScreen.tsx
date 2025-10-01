import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADII, SPACING } from '../../utils/theme';

const notifications = [
  { id: '1', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultricies.', time: '1 ngày' },
  { id: '2', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultricies.', time: '1 ngày' },
  { id: '3', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultricies. Có 3 công thức nấu ăn mới được gợi ý cho bạn 👨‍🍳', time: '1 ngày' },
];

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f7" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Thông báo</Text>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 35,
    backgroundColor: COLORS.background,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // căn avatar với dòng đầu tiên của text
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: RADII.xl,
    marginRight: 12,
    marginTop: SPACING.xs,
    backgroundColor: COLORS.process,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    marginLeft: 0.5,
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '400',
    marginBottom: 2,
  },
  time: { fontSize: 13, color: COLORS.textDim },
});

export default NotificationScreen;
