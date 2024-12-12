import { FlatList } from "react-native";
import { FriendRequestItem } from "@/components/friends/FriendRequestItem";

/**
 * Request List with all users that have sent a friend request to the current user
 * @param requests : list of users that have sent a friend request
 * @param firestoreCtrl : firestore controller
 * @param uid : current user's id
 */
export default function RequestList({
  requests,
  firestoreCtrl,
  uid,
}: {
  readonly requests: any[];
  readonly firestoreCtrl: any;
  readonly uid: string;
}) {
  const handleAccept = (requestId: string) => {
    firestoreCtrl.acceptFriend(uid, requestId);
  };

  const handleDecline = (requestId: string) => {
    firestoreCtrl.rejectFriend(uid, requestId);
  };

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
          testID={index}
          avatar={item.image_id}
          onAccept={() => handleAccept(item.uid)}
          onDecline={() => handleDecline(item.uid)}
        />
      )}
    />
  );
}
