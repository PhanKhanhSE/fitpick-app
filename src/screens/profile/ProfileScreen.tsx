import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { COLORS, SPACING } from "../../utils/theme";
import { NutritionStats } from "../../components/home";
import {
  NavigationHeader,
  UserProfile,
  StickyTabsWithDate,
  NutritionBars,
  TipSection,
  UsedMeals,
} from "../../components/profile";
import { CreatePost, PostItem } from "../../components/home/community";
import { userProfileAPI } from "../../services/userProfileAPI";
import { useAvatarPicker } from "../../hooks/useAvatarPicker";
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<"nutrition" | "posts">("nutrition");
  const { height } = useWindowDimensions();
  const { handleChangeAvatar, isUploading } = useAvatarPicker();

  // State cho post & modal menu
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // State cho dữ liệu từ API
  const [userData, setUserData] = useState({
    name: "Đang tải...",
    accountType: "FREE",
    avatar: "https://i.pravatar.cc/100?img=1",
    email: "",
    fullName: "",
  });

  const [nutritionData, setNutritionData] = useState({
    targetCalories: 0,
    consumedCalories: 0,
    starch: { current: 0, target: 0 },
    protein: { current: 0, target: 0 },
    fat: { current: 0, target: 0 },
  });

  const [nutritionBars, setNutritionBars] = useState<any[]>([]);

  const [usedMeals, setUsedMeals] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle avatar change
  const handleAvatarChange = () => {
    handleChangeAvatar((newAvatarUrl) => {
      setUserData(prev => ({
        ...prev,
        avatar: newAvatarUrl
      }));
    });
  };

  // Load dữ liệu từ API
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (activeTab === 'nutrition') {
      loadNutritionData();
    } else if (activeTab === 'posts') {
      loadUserPosts();
    }
  }, [activeTab, selectedDate]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load profile từ API trước (ưu tiên API)
      const profileResponse = await userProfileAPI.getUserProfile();
      
      if (profileResponse.success && profileResponse.data) {
        const profile = profileResponse.data;
        
        setUserData({
          name: profile.fullName || profile.email?.split('@')[0] || "Người dùng",
          fullName: profile.fullName || "",
          email: profile.email || "",
          avatar: profile.avatarUrl || "https://i.pravatar.cc/100?img=1",
          accountType: profile.accountType || "FREE",
        });
        
        return; // Thoát sớm nếu API thành công
      }
      
      // Fallback: Lấy thông tin user từ AsyncStorage nếu API thất bại
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        setUserData({
          name: user.fullName || user.email?.split('@')[0] || "Người dùng",
          accountType: "FREE",
          avatar: "https://i.pravatar.cc/100?img=1",
          email: user.email || "",
          fullName: user.fullName || "",
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      
      // Fallback to stored data
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData({
          name: user.fullName || user.email?.split('@')[0] || "Người dùng",
          accountType: "FREE",
          avatar: "https://i.pravatar.cc/100?img=1",
          email: user.email || "",
          fullName: user.fullName || "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadNutritionData = async () => {
    try {
      const [nutritionResponse, detailedNutritionResponse, mealsResponse] = await Promise.all([
        userProfileAPI.getNutritionStats(selectedDate),
        userProfileAPI.getDetailedNutritionStats(selectedDate),
        userProfileAPI.getUserMeals(selectedDate)
      ]);

      if (nutritionResponse.success && nutritionResponse.data) {
        setNutritionData(nutritionResponse.data);
      }

      if (detailedNutritionResponse.success && detailedNutritionResponse.data) {
        const detailedData = detailedNutritionResponse.data;
        setNutritionBars([
          { 
            label: "Đường", 
            current: detailedData.sugar?.current || 0, 
            target: detailedData.sugar?.target || 50, 
            unit: detailedData.sugar?.unit || "g", 
            color: COLORS.primary 
          },
          { 
            label: "Natri (Sodium)", 
            current: detailedData.sodium?.current || 0, 
            target: detailedData.sodium?.target || 2300, 
            unit: detailedData.sodium?.unit || "mg", 
            color: COLORS.primary 
          },
          { 
            label: "Chất béo bão hòa", 
            current: detailedData.saturatedFat?.current || 0, 
            target: detailedData.saturatedFat?.target || 20, 
            unit: detailedData.saturatedFat?.unit || "g", 
            color: COLORS.primary 
          },
          { 
            label: "Canxi (Calcium)", 
            current: detailedData.calcium?.current || 0, 
            target: detailedData.calcium?.target || 1000, 
            unit: detailedData.calcium?.unit || "mg", 
            color: COLORS.primary 
          },
          { 
            label: "Vitamin D", 
            current: detailedData.vitaminD?.current || 0, 
            target: detailedData.vitaminD?.target || 600, 
            unit: detailedData.vitaminD?.unit || "IU", 
            color: COLORS.primary 
          },
        ]);
      }

      if (mealsResponse.success && mealsResponse.data) {
        setUsedMeals(mealsResponse.data);
      }
    } catch (error) {
      console.error('Error loading nutrition data:', error);
      // Fallback to default data
      setNutritionData({
        targetCalories: 2000,
        consumedCalories: 0,
        starch: { current: 0, target: 100 },
        protein: { current: 0, target: 100 },
        fat: { current: 0, target: 100 },
      });
      setUsedMeals([]);
      
      // Fallback nutrition bars with default values
      setNutritionBars([
        { label: "Đường", current: 0, target: 50, unit: "g", color: COLORS.primary },
        { label: "Natri (Sodium)", current: 0, target: 2300, unit: "mg", color: COLORS.primary },
        { label: "Chất béo bão hòa", current: 0, target: 20, unit: "g", color: COLORS.primary },
        { label: "Canxi (Calcium)", current: 0, target: 1000, unit: "mg", color: COLORS.primary },
        { label: "Vitamin D", current: 0, target: 600, unit: "IU", color: COLORS.primary },
      ]);
    }
  };

  const loadUserPosts = async () => {
    try {
      const response = await userProfileAPI.getUserPosts();
      if (response.success && response.data) {
        setUserPosts(response.data);
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
      setUserPosts([]);
    }
  };

  // ---- Navigation handlers ----
  const handleGoBack = () => navigation.goBack();
  const handleSettings = () => navigation.navigate("SettingScreen");
  const handleMealPress = (meal: any) =>
    navigation.navigate("MealDetail", { meal });
  const handleTabChange = (tab: "nutrition" | "posts") => setActiveTab(tab);
  const handlePreviousDate = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };
  
  const handleNextDate = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  // ---- POST handlers ----
  const handleCreatePost = () => {
    navigation.navigate("CreatePostScreen");
  };

  const handleLike = (postId: string) => {
    setUserPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      navigation.navigate('PostDetailScreen', { post });
    }
  };

  // ---- Menu handlers ----
  const handleOpenMenu = (post: any) => {
    setSelectedPost(post);
    setMenuVisible(true);
  };
  const handleEditPost = () => {
    if (selectedPost) {
      setMenuVisible(false);
      navigation.navigate("EditPostScreen", { post: selectedPost });
    }
  };

  const handleDeletePost = () => {
    if (selectedPost) {
      Alert.alert("Xóa bài viết", "Bạn có chắc muốn xóa?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            setUserPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
            setMenuVisible(false);
          },
        },
      ]);
    }
  };

  // ---- Bấm vào post đi chi tiết ----
  const handlePostPress = (post: any) => {
    navigation.navigate("PostDetailScreen", { post });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <NavigationHeader onGoBack={handleGoBack} onSettings={handleSettings} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <UserProfile
          name={userData.name}
          accountType={userData.accountType}
          avatar={userData.avatar}
          onAvatarPress={handleAvatarChange}
        />

        <StickyTabsWithDate
          activeTab={activeTab}
          onTabChange={handleTabChange}
          dateText={new Date(selectedDate).toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
          onPreviousDate={handlePreviousDate}
          onNextDate={handleNextDate}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
          <>
            {activeTab === "nutrition" ? (
              <>
                <NutritionStats {...nutritionData} />
                <NutritionBars nutritionBars={nutritionBars} />
                <TipSection tipText="Hãy duy trì chế độ ăn uống cân bằng và tập thể dục đều đặn để có sức khỏe tốt!" />
                <UsedMeals meals={usedMeals} onMealPress={handleMealPress} />
              </>
            ) : (
              <View style={styles.postsContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <CreatePost onPress={handleCreatePost} />
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <TouchableOpacity
                        key={post.id}
                        activeOpacity={0.9}
                        onPress={() => handlePostPress(post)}
                      >
                        <PostItem
                          post={post}
                          onLike={handleLike}
                          onComment={handleComment}
                          onMenuPress={() => handleOpenMenu(post)}
                          currentUserName={userData.name}
                        />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>Chưa có bài viết nào</Text>
                  )}
                  <View style={{ height: SPACING.xxl }} />
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalBtn} onPress={handleEditPost}>
              <Text style={styles.modalText}>Chỉnh sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBtn} onPress={handleDeletePost}>
              <Text style={[styles.modalText, { color: "red" }]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
  postsContainer: { flex: 1, paddingVertical: SPACING.md },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.muted,
    marginTop: SPACING.lg,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalBtn: {
    paddingVertical: 8,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "left",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textDim,
  },
});

export default ProfileScreen;
