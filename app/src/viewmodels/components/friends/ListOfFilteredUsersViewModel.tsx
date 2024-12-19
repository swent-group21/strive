import { useEffect, useState } from "react";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import { isFriend, isRequested } from "@/src/models/firebase/GetFirestoreCtrl";
import {
  addFriend,
  removeFriendRequest,
} from "@/src/models/firebase/SetFirestoreCtrl";

/**
 * List of filtered users ViewModel helps display the component
 * @param filteredUsers : list of users to display
 * @param firestoreCtrl : firestore controller
 * @param uid : user id of the current user
 * @returns ListOfFilteredUsers Component
 */
export function useListOfFilteredUsersViewModel({
  filteredUsers = [],
  uid,
}: {
  readonly filteredUsers: DBUser[];
  readonly uid: string;
}) {
  const [userStatuses, setUserStatuses] = useState<{
    [key: string]: { isFriendB: boolean; isRequestedB: boolean };
  }>({});

  // Fetch user statuses with respect to the current user (friend, requested, or not)
  const fetchUserStatuses = async () => {
    const statuses: {
      [key: string]: { isFriendB: boolean; isRequestedB: boolean };
    } = {};
    for (const user of filteredUsers) {
      const isFriendB = await isFriend(uid, user.uid);
      const isRequestedB = await isRequested(uid, user.uid);
      statuses[user.uid] = { isFriendB, isRequestedB };
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
      await addFriend(uid, userId);
      console.info("Friend request sent");
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], isRequestedB: true },
      }));
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  // Handle remove friend request
  const handleRemove = async (userId: string) => {
    try {
      await removeFriendRequest(uid, userId);
      console.log("Friend request canceled");
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], isRequestedB: false },
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
