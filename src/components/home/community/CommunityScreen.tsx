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
import { CreatePostInput, PostItem } from './index';

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
    likesCount: 5,
    commentsCount: 3,
    isLiked: true,
  },
  {
    id: '3',
    userName: 'Hoàng Long',
    timeAgo: '3 ngày',
    content: 'Tip nhỏ: Uống nước trước bữa ăn 30 phút giúp tiêu hóa tốt hơn!',
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
    Alert.alert('Nhận xét', 'Chức năng nhận xét sẽ được phát triển sau');
  };

  const handlePressPost = (post: any) => {
    navigation.navigate('PostDetailScreen', { post }); // ✅ không cần ép kiểu [never, never] nữa
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <CreatePostInput onPress={handleCreatePost} />
        
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
  bottomSpacing: {
    height: SPACING.xxl,
  },
});

export default CommunityScreen;
