import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { UserListItem } from "@/src/views/components/friends/user_list_items";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { useListOfFilteredUsersViewModel } from "@/src/viewmodels/components/friends/ListOfFilteredUsersViewModel";

/**
 * List of filtered users component
 * @param filteredUsers : list of users to display
 * @param searchText : text to search for
 * @param firestoreCtrl : firestore controller
 * @param uid : user id of the current user
 * @returns ListOfFilteredUsers Component
 */
export default function ListOfFilteredUsers({
  filteredUsers = [],
  searchText,
  uid,
}: any) {
  const { userStatuses, handleAdd, handleRemove } =
    useListOfFilteredUsersViewModel({ filteredUsers, uid });

  return (
    <ThemedView style={{ padding: 10, backgroundColor: "transparent" }}>
      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.uid || Math.random().toString()}
          renderItem={({ item }) => {
            const { isFriendB, isRequestedB } = userStatuses[item.uid] || {
              isFriend: false,
              isRequested: false,
            };

            return (
              <UserListItem
                name={item.name}
                key={item.uid}
                avatar={item.image_id}
                isFriend={isFriendB}
                isRequested={isRequestedB}
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
