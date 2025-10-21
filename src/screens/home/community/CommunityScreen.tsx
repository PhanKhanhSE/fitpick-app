import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING } from '../../../utils/theme';
import CreatePost from '../../../components/home/community/CreatePost';
import PostItem from '../../../components/home/community/PostItem';

const mockPosts = [
  {
    id: '1',
    userName: 'Quang Minh',
    timeAgo: '1 ngày',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: 'placeholder',
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
  },
  {
    id: '2',
    userName: 'Mai Anh',
    timeAgo: '2 giờ',
    content: 'Hôm nay tôi đã thử một công thức mới rất ngon!',
    imageUrl: undefined,
    likesCount: 5,
    commentsCount: 3,
    isLiked: true,
  },
  {
    id: '3',
    userName: 'Hoàng Long',
    timeAgo: '3 ngày',
    content: 'Tip nhỏ: Uống nước trước bữa ăn 30 phút giúp tiêu hóa tốt hơn!',
    imageUrl: undefined,
    likesCount: 12,
    commentsCount: 8,
    isLiked: false,
  },
];

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState(mockPosts);
  const navigation = useNavigation<any>(); // ✅ bỏ kiểu strict, tránh lỗi TS

  const handleCreatePost = () => {
    navigation.navigate("CreatePostScreen");
  };


  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      navigation.navigate('PostDetailScreen', { post });
    }
  };

  const handlePressPost = (post: any) => {
    navigation.navigate('PostDetailScreen', { post });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <CreatePost onPress={handleCreatePost} />
        
        {posts.map(post => (
          <TouchableOpacity key={post.id} onPress={() => handlePressPost(post)}>
            <PostItem
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          </TouchableOpacity>
        ))}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
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
  scrollViewContent: {
    paddingTop: SPACING.md,
  },
  bottomSpacing: {
    height: SPACING.xxl + 20, // Thêm khoảng trống cho bottom tab
  },
});

export default CommunityScreen;
