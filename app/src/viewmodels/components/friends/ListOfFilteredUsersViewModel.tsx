import { useEffect, useState } from "react";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";

/**
 * List of filtered users ViewModel helps display the component
 * @param filteredUsers : list of users to display
 * @param firestoreCtrl : firestore controller
 * @param uid : user id of the current user
 * @returns ListOfFilteredUsers Component
 */
export function useListOfFilteredUsersViewModel({
  filteredUsers = [],
  firestoreCtrl,
  uid,
}: {
  readonly filteredUsers: DBUser[];
  readonly firestoreCtrl: FirestoreCtrl;
  readonly uid: string;
}) {
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
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], isRequested: false },
      }));
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  return {
    userStatuses,
    handleAdd,
    handleRemove,
  };
}
