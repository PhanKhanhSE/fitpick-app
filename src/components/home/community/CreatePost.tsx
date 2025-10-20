import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, SPACING, RADII } from "../../../utils/theme";

interface CreatePostProps {
  onPress: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7XDKSjjkyUPBWh7lrsh4BrKCkyuNC2v7UfA&s",
            }}
            style={styles.avatar}
          />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.placeholder}>Tạo bài viết</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'white',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderRadius: RADII.sm,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: RADII.xl,
    marginLeft: SPACING.sm,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: COLORS.under_process,
    borderRadius: RADII.umd,
    paddingVertical: SPACING.umd,
  },
  placeholder: {
    fontSize: 14,
    fontWeight: "400",
    marginLeft: SPACING.md,

    color: COLORS.muted,
  },
});

export default CreatePost;
