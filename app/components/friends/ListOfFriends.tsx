import { FlatList, Dimensions, StyleSheet } from "react-native";
import { FriendListItem } from "@/components/friends/FriendListItem";
import { ThemedText } from "@/components/theme/ThemedText";

const { height, width } = Dimensions.get("window");

/**
 * List of friends component that displays the list of the current user's friends
 * @param friends : list of friends
 * @param handleFriendPress : function to handle the press on a friend item
 */
export default function ListOfFriends({ friends, handleFriendPress }: any) {
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
          onPress={() => handleFriendPress(item.uid)}
          testID={`friend-item-${item.name}`}
          height={height * 0.2}
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
