import { FlatList, StyleSheet, Text } from "react-native";
import { TopBar } from "@/src/views/components/navigation/top_bar";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { SearchBar } from "@/src/views/components/navigation/search_bar";
import ListOfFilteredGroups from "@/src/views/components/groups/list_of_filtered_groups";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";
import { ThemedTextButton } from "@/src/views/components/theme/themed_text_button";
import { useJoinGroupViewModel } from "@/src/viewmodels/groups/JoinGroupViewModel";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function JoinGroupScreen({
  user,
  navigation,
  firestoreCtrl,
}: {
  readonly user: DBUser;
  readonly navigation: any;
  readonly firestoreCtrl: FirestoreCtrl;
}) {
  const uid = user.uid;

  const {
    searchText,
    setSearchText,
    filteredGroups = [],
    suggestions,
  } = useJoinGroupViewModel(firestoreCtrl, uid);

  // Sections configuration
  const sections = [
    // Search results
    {
      id: "search-results",
      title: null,
      content: (
        <ListOfFilteredGroups
          searchText={searchText}
          uid={uid}
          firestoreCtrl={firestoreCtrl}
          filteredGroups={filteredGroups}
          navigation={navigation}
          testID="search-results"
        />
      ),
    },

    // Create a new group button
    {
      id: "create-group",
      title: "Create a new group",
      content: (
        <ThemedTextButton
          testID="create-group-button"
          style={styles.buttonCreateGroup}
          onPress={() => navigation.navigate("CreateGroup")}
          text="Create a new Group !"
          textStyle={{ fontWeight: "600" }}
          textColorType="textOverLight"
        />
      ),
    },

    // Group suggestions
    {
      id: "suggestions",
      title: "Group suggestions for you",
      content: (
        <ListOfFilteredGroups
          filteredGroups={suggestions}
          searchText=""
          uid={uid}
          firestoreCtrl={firestoreCtrl}
          navigation={navigation}
          testID="group-suggestions"
        />
      ),
    },
  ];

  return (
    <ThemedView style={styles.bigContainer} testID="join-group-screen">
      <TopBar
        title="Join your friends in a group !"
        leftIcon="arrow-back"
        leftAction={navigation.goBack}
      />

      {/* Search bar at first */}
      <SearchBar onSearch={setSearchText} element={"group"} />

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
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginLeft: 10,
    marginBottom: 30,
  },
  bigContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonCreateGroup: {
    alignItems: "center",
    alignSelf: "center",
    width: width * 0.8,
    borderRadius: 15,
    padding: 10,
  },
});
