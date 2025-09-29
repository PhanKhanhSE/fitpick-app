import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
} from 'react-native';
import { COLORS, SPACING } from '../../../utils/theme';
import { CreatePostInput, PostItem } from './index';

// Mock data cho demo
const mockPosts = [
  {
    id: '1',
    userName: 'Quang Minh',
    timeAgo: '1 ngày',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at quam nec sapien fringilla ultrices. Vivamus ut lorem at nisl commodo placerat.',
    imageUrl: 'placeholder',
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
  },
  {
    id: '2',
    userName: 'Mai Anh',
    timeAgo: '2 giờ',
    content: 'Hôm nay tôi đã thử một công thức mới rất ngon! Ai muốn chia sẻ kinh nghiệm nấu ăn không?',
    likesCount: 5,
    commentsCount: 3,
    isLiked: true,
  },
  {
    id: '3',
    userName: 'Hoàng Long',
    timeAgo: '3 ngày',
    content: 'Tip nhỏ: Uống nước trước bữa ăn 30 phút sẽ giúp cải thiện quá trình tiêu hóa đấy các bạn!',
    likesCount: 12,
    commentsCount: 8,
    isLiked: false,
  },
];

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState(mockPosts);

  const handleCreatePost = () => {
    Alert.alert('Tạo bài viết', 'Chức năng tạo bài viết sẽ được phát triển sau');
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

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <CreatePostInput onPress={handleCreatePost} />
        
        {posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
        
        {/* Bottom spacing for better scrolling */}
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
  placeholderContainer: {
    flex: 1,
  },
  bottomSpacing: {
    height: SPACING.xxl,
  },
});

export default CommunityScreen;