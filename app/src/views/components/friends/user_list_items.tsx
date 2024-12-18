import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { Colors } from "@/constants/Colors";
import { useState, useEffect } from "react";
import { useUserListItemViewModel } from "@/src/viewmodels/components/friends/UserListItemViewModel";
import { useFriendIconViewModel } from "@/src/viewmodels/components/friends/FriendIconViewModel";

/**
 * User list item component
 * @param name : name of the user
 * @param avatar : avatar of the user
 * @param isFriend : boolean indicating if the user is a friend
 * @param isRequested : boolean indicating if the user has been requested
 * @param onAdd : function to add a friend
 * @param onCancelRequest : function to cancel a friend request
 * @returns UserListItem Component
 */
export const UserListItem = ({
  name,
  avatar,
  isFriend,
  isRequested,
  onAdd,
  onCancelRequest,
}: {
  readonly name: string;
  readonly avatar?: string;
  readonly isFriend: boolean;
  readonly isRequested: boolean;
  readonly onAdd: () => void;
  readonly onCancelRequest: () => void;
}) => {
  const { handlePress, status } = useUserListItemViewModel({
    isFriend,
    isRequested,
    onAdd,
    onCancelRequest,
  });
  const { firstLetter } = useFriendIconViewModel({ name });

  return (
    <ThemedView style={styles.listItem} testID={`user-list-item-${name}`}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <ThemedView style={[styles.avatar, styles.defaultAvatar]}>
          {/* Display the first letter of the user's name */}
          <ThemedText style={styles.avatarText}>{firstLetter}</ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.name}>{name}</ThemedText>
      </ThemedView>

      {status === "FRIEND" ? (
        <ThemedText style={styles.friendCheck}>✓</ThemedText>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handlePress}
          testID={`handle-button-${name}`}
        >
          <ThemedText style={styles.addButtonText}>{status}</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: "auto",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  friendCheck: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "auto",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#000",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  avatarText: {
    color: Colors.light.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  defaultAvatar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundSecondary,
  },
  textContainer: {
    backgroundColor: "transparent",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
