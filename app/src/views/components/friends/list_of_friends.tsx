import { FlatList, Dimensions, StyleSheet } from "react-native";
import { FriendListItem } from "@/src/views/components/friends/friend_list_item";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";

const { height, width } = Dimensions.get("window");

/**
 * List of friends component that displays the list of the current user's friends
 * @param friends : list of friends
 * @param handleFriendPress : function to handle the press on a friend item
 */
export default function ListOfFriends({
  friends,
  handleFriendPress,
}: {
  readonly friends: DBUser[];
  readonly handleFriendPress: (uid: DBUser) => void;
}) {
  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.uid}
      style={{ padding: 5, maxHeight: height * 0.2 }}
      renderItem={({ item, index }) => (
        <FriendListItem
          name={item.name}
          key={item.uid}
          avatar={item.image_id}
          onPress={() => {}}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      ListEmptyComponent={
        <ThemedText style={styles.noFriends}>
          You don't have any friends yet
        </ThemedText>
      }
      testID="list-of-friends"
    />
  );
}

const styles = StyleSheet.create({
  noFriends: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 20,
    alignSelf: "center",
    marginLeft: width * 0.2,
  },
});
