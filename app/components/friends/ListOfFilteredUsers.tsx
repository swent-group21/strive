import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/theme/ThemedText";
import { UserListItem } from "@/components/friends/UserListItems";
import { ThemedView } from "@/components/theme/ThemedView";

/**
 * List of filtered users component
 * @param filteredUsers : list of users to display
 * @param searchText : text to search for
 * @param firestoreCtrl : firestore controller
 * @param uid : user id of the current user
 * @returns ListOfFilteredUsers Component
 */
export default function ListOfFilteredUsers({
  filteredUsers,
  searchText,
  firestoreCtrl,
  uid,
}: any) {
  const [userStatuses, setUserStatuses] = useState<{
    [key: string]: { isFriend: boolean; isRequested: boolean };
  }>({});

  // Fetch user statuses with respect to the current user (friend, requested, or not)
  const fetchUserStatuses = async () => {
    const statuses: {
      [key: string]: { isFriend: boolean; isRequested: boolean };
    } = {};
    for (const user of filteredUsers) {
      const isFriend = await firestoreCtrl.isFriend(uid, user.uid);
      const isRequested = await firestoreCtrl.isRequested(uid, user.uid);
      statuses[user.uid] = { isFriend, isRequested };
    }
    setUserStatuses(statuses);
  };

  // Fetch user statuses when the filtered users change
  useEffect(() => {
    if (filteredUsers.length > 0) {
      fetchUserStatuses();
    }
  }, [filteredUsers]);

  // Handle add friend request
  const handleAdd = async (userId: string) => {
    try {
      await firestoreCtrl.addFriend(uid, userId);
      console.info("Friend request sent");
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], isRequested: true },
      }));
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  // Handle remove friend request
  const handleRemove = async (userId: string) => {
    try {
      await firestoreCtrl.removeFriendRequest(uid, userId);
      console.log("Friend request canceled");
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], isRequested: false },
      }));
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  return (
    <ThemedView style={{ padding: 10, backgroundColor: "transparent" }}>
      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => {
            const { isFriend, isRequested } = userStatuses[item.uid] || {
              isFriend: false,
              isRequested: false,
            };

            return (
              <UserListItem
                name={item.name}
                key={item.uid}
                avatar={item.image_id}
                isFriend={isFriend}
                isRequested={isRequested}
                onAdd={() => handleAdd(item.uid)}
                onCancelRequest={() => handleRemove(item.uid)}
              />
            );
          }}
        />
      ) : (
        searchText.length > 0 && (
          <ThemedText style={styles.noResults}>No user found</ThemedText>
        )
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  noResults: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 20,
  },
});
