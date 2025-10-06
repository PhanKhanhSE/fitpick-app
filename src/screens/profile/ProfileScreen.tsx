import React, { useState } from "react";
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
} from "react-native";
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<"nutrition" | "posts">("nutrition");
  const { height } = useWindowDimensions();

  // State cho post & modal menu
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Sample user data
  const userData = {
    name: "Quang Minh",
    accountType: "FREE",
    avatar: "https://i.pravatar.cc/100?img=1",
  };

  // Nutrition data
  const nutritionData = {
    targetCalories: 1000,
    consumedCalories: 1000,
    starch: { current: 90, target: 100 },
    protein: { current: 110, target: 100 },
    fat: { current: 90, target: 100 },
  };

  // Nutrition bars data
  const nutritionBars = [
    { label: "Đường", current: 0, target: 0, unit: "g", color: COLORS.primary },
    { label: "Natri (Sodium)", current: 0, target: 0, unit: "mg", color: COLORS.primary },
    { label: "Chất béo bão hòa", current: 0, target: 0, unit: "g", color: COLORS.primary },
    { label: "Canxi (Calcium)", current: 0, target: 0, unit: "mg", color: COLORS.primary },
    { label: "Vitamin D", current: 0, target: 0, unit: "IU", color: COLORS.primary },
  ];

  // Sample used meals
  const usedMeals = [
    {
      id: "1",
      title: "Cá hồi sốt tiêu kèm bơ xanh",
      calories: "0 kcal",
      time: "0 phút",
      image: {
        uri: "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      },
      tag: "Bữa sáng",
      isLocked: false,
    },
  ];

  // Posts của user
  const [userPosts, setUserPosts] = useState([
    {
      id: "1",
      userName: userData.name,
      timeAgo: "2 giờ",
      content: "Bài viết đầu tiên trong trang cá nhân!",
      imageUrl: undefined,
      likesCount: 2,
      commentsCount: 1,
      isLiked: false,
    },
    {
      id: "2",
      userName: userData.name,
      timeAgo: "1 ngày",
      content: "Hôm nay ăn salad bơ rất ngon!",
      imageUrl:
        "https://monngonmoingay.com/wp-content/uploads/2021/04/salad-bi-do-500.jpg",
      likesCount: 5,
      commentsCount: 0,
      isLiked: true,
    },
  ]);

  // ---- Navigation handlers ----
  const handleGoBack = () => navigation.goBack();
  const handleSettings = () => navigation.navigate("SettingScreen");
  const handleMealPress = (meal: any) =>
    navigation.navigate("MealDetail", { meal });
  const handleTabChange = (tab: "nutrition" | "posts") => setActiveTab(tab);
  const handlePreviousDate = () => console.log("Previous date");
  const handleNextDate = () => console.log("Next date");

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
    <View style={styles.container}>
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
        />

        <StickyTabsWithDate
          activeTab={activeTab}
          onTabChange={handleTabChange}
          dateText="Thứ Hai, 8 tháng 9"
          onPreviousDate={handlePreviousDate}
          onNextDate={handleNextDate}
        />

        {activeTab === "nutrition" ? (
          <>
            <NutritionStats {...nutritionData} />
            <NutritionBars nutritionBars={nutritionBars} />
            <TipSection tipText="Lorem ipsum dolor sit amet..." />
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
    </View>
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
});

export default ProfileScreen;
