import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { Colors } from "@/constants/Colors";
import { useState, useEffect } from "react";

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
  const [status, setStatus] = useState("ADD");

  // Set the status of the user based on the friend and requested status
  useEffect(() => {
    if (isFriend) {
      setStatus("FRIEND");
    } else if (isRequested) {
      setStatus("REQUESTED");
    } else {
      setStatus("ADD");
    }
  }, [isFriend, isRequested]);

  // Handle the press event based on the status
  const handlePress = () => {
    if (status === "ADD") {
      onAdd();
      setStatus("REQUESTED");
    } else if (status === "REQUESTED") {
      onCancelRequest();
      setStatus("ADD");
    }
  };

  return (
    <ThemedView style={styles.listItem}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <ThemedView style={[styles.avatar, styles.defaultAvatar]}>
          {/* Display the first letter of the user's name */}
          <ThemedText style={styles.avatarText}>
            {name.charAt(0).toUpperCase()}
          </ThemedText>
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
          testID={`add-button-${name}`}
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
