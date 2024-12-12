import { FlatList, StyleSheet, Text } from "react-native";
import { TopBar } from "@/components/navigation/TopBar";
import { ThemedView } from "@/components/theme/ThemedView";
import { ThemedText } from "@/components/theme/ThemedText";
import { getAuth } from "firebase/auth";
import { SearchBar } from "@/components/friends/Search_Bar";
import ListOfFriends from "@/components/friends/ListOfFriends";
import RequestList from "@/components/friends/RequestList";
import ListOfFilteredUsers from "@/components/friends/ListOfFilteredUsers";
import { useFriendsScreenViewModel } from "@/src/viewmodels/friends/FriendsScreenViewModel";

export default function FriendsScreen({ navigation, firestoreCtrl }: any) {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const {
    searchText,
    setSearchText,
    friends,
    requests,
    filteredUsers,
    handleFriendPress,
    suggestions,
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
          testID="suggestions-list"
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
      <SearchBar onSearch={setSearchText} />

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
