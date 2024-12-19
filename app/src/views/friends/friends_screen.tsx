import { FlatList, StyleSheet, Text } from "react-native";
import { TopBar } from "@/src/views/components/navigation/top_bar";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { getAuth } from "firebase/auth";
import { SearchBar } from "@/src/views/components/navigation/search_bar";
import ListOfFriends from "@/src/views/components/friends/list_of_friends";
import { RequestList } from "@/src/views/components/friends/request_list";
import ListOfFilteredUsers from "@/src/views/components/friends/list_of_filtered_users";
import { useFriendsScreenViewModel } from "@/src/viewmodels/friends/FriendsScreenViewModel";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

export default function FriendsScreen({
  navigation,
  firestoreCtrl,
}: {
  readonly navigation: any;
  readonly firestoreCtrl: FirestoreCtrl;
}) {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const {
    searchText,
    setSearchText,
    friends,
    requests,
    filteredUsers = [],
    suggestions,
    handleFriendPress,
  } = useFriendsScreenViewModel(firestoreCtrl, uid);

  // Sections configuration
  const sections = [
    {
      id: "search-results",
      title: null,
      content: (
        <ListOfFilteredUsers
          searchText={searchText}
          uid={uid}
          firestoreCtrl={firestoreCtrl}
          filteredUsers={filteredUsers}
        />
      ),
    },

    {
      id: "friends",
      title: "Your friends",
      content: (
        <ListOfFriends
          friends={friends}
          handleFriendPress={handleFriendPress}
        />
      ),
    },
    {
      id: "requests",
      title: "Requests",
      content:
        requests.length > 0 ? (
          <RequestList
            requests={requests}
            firestoreCtrl={firestoreCtrl}
            uid={uid}
          />
        ) : (
          <ThemedText style={styles.noRequests}>
            No friends request for now
          </ThemedText>
        ),
    },

    {
      id: "suggestions",
      title: "Suggestions for you",
      content: (
        <ListOfFilteredUsers
          filteredUsers={suggestions}
          searchText=""
          uid={uid}
          firestoreCtrl={firestoreCtrl}
        />
      ),
    },
  ];

  return (
    <ThemedView style={styles.bigContainer}>
      {/* Barre de recherche */}
      <TopBar
        title="Strive is better with friends"
        leftIcon="arrow-back"
        leftAction={navigation.goBack}
      />
      <SearchBar onSearch={setSearchText} element={"user"} />

      <FlatList
        style={styles.container}
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.sectionContainer}>
            {item.title && (
              <Text style={styles.sectionTitle}>{item.title}</Text>
            )}
            {item.content}
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 10,
  },
  noRequests: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 20,
  },
  bigContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
