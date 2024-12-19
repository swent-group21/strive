import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import FirestoreCtrl, {
  DBUser,
  DBComment,
} from "@/src/models/firebase/FirestoreCtrl";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

/**
 * The SingleComment component displays a single comment.
 * @param comment : the comment object
 * @param firestoreCtrl : FirestoreCtrl object to fetch user details
 * @returns : a component for the comment
 */
export function SingleComment({
  comment,
  firestoreCtrl,
}: {
  comment: Readonly<DBComment>;
  firestoreCtrl: FirestoreCtrl;
}) {
  const [user, setUser] = useState<DBUser | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await firestoreCtrl.getUser(comment.uid); // Assuming `post_id` links to the user
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data for comment:", error);
      }
    };

    fetchUser();
  }, [comment.post_id, firestoreCtrl]);

  return (
    <View style={styles.commentContainer}>
      {/* User Avatar */}
      {user?.image_id ? (
        <Image
          source={{ uri: user.image_id }}
          style={styles.userAvatar}
          testID="comment-user-avatar"
        />
      ) : (
        <View style={styles.defaultAvatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </Text>
        </View>
      )}

      {/* Comment Content */}
      <View
        style={styles.container}
        testID={`comment-container-${comment.comment_text}`}
      >
        <View style={styles.header}>
          <Text style={styles.userName}>{user?.name || "Anonymous"}</Text>
          <Text style={styles.commentDate}>
            {comment.created_at.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.commentText}>{comment.comment_text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
    alignItems: "center",
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  defaultAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.dark.backgroundPrimary,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  userName: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  commentDate: {
    fontSize: 13,
    color: "gray",
  },
  commentText: {
    fontSize: 15,
    color: "white",
  },
});
