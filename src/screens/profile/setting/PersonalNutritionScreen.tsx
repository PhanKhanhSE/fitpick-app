import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = any;

const PersonalNutritionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dinh dưỡng cá nhân</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Mục tiêu -> GoalsScreen */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.itemText}>Mục tiêu</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Chế độ ăn -> EatStyleScreen */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('EatStyle')}
        >
          <Text style={styles.itemText}>Chế độ ăn</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

       
        {/* <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Dị ứng</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity> */}

        {/* Kỹ năng nấu ăn -> CookingLevelScreen */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('CookingLevel')}
        >
          <Text style={styles.itemText}>Kỹ năng nấu ăn</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Mức độ vận động -> LifestyleScreen */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Lifestyle')}
        >
          <Text style={styles.itemText}>Mức độ vận động</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalNutritionScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  backButton: { marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },

  container: { flex: 1, backgroundColor: '#fff' },

  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: { fontSize: 16, color: '#000' },
});
