import { FlatList } from "react-native";
import { FriendRequestItem } from "@/src/views/components/friends/friend_request_item";
import { useRequestListViewModel } from "@/src/viewmodels/components/friends/RequestListViewModel";

/**
 * Request List with all users that have sent a friend request to the current user
 * @param requests : list of users that have sent a friend request
 * @param firestoreCtrl : firestore controller
 * @param uid : current user's id
 */
export function RequestList({
  requests,
  uid,
}: {
  readonly requests: any[];
  readonly uid: string;
}) {
  const { handleAccept, handleDecline } = useRequestListViewModel({ uid });

  return (
    <FlatList
      data={requests}
      testID="friend-request-list"
      keyExtractor={(item) => item.uid}
      key={requests.length}
      style={{ position: "relative" }}
      renderItem={({ item, index }) => (
        <FriendRequestItem
          name={item.name}
          key={item.uid}
          testID={index.toString()}
          avatar={item.image_id}
          onAccept={() => handleAccept(item.uid)}
          onDecline={() => handleDecline(item.uid)}
        />
      )}
    />
  );
}
