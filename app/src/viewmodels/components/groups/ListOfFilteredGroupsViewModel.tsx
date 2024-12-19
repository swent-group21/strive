import { useEffect, useState } from "react";
import FirestoreCtrl, { DBGroup } from "@/src/models/firebase/FirestoreCtrl";

/**
 * List of filtered groups ViewModel helps display the component
 * @param filteredGroups : list of groups to display
 * @param firestoreCtrl : firestore controller
 * @param uid : user id of the current user
 * @returns ListOfFilteredGroups Component
 */
export function useListOfFilteredGroupsViewModel({
  filteredGroups = [],
  firestoreCtrl,
  uid,
  navigation,
}: {
  readonly filteredGroups: DBGroup[];
  readonly firestoreCtrl: FirestoreCtrl;
  readonly uid: string;
  readonly navigation: any;
}) {
  const [groupStatuses, setGroupStatuses] = useState<{
    [key: string]: { isJoined: boolean };
  }>({});

  // Fetch group statuses with respect to the current user (joined or not)
  const fetchGroupStatuses = async () => {
    const statuses: {
      [key: string]: { isJoined: boolean };
    } = {};
    for (const group of filteredGroups) {
      const isJoined = group.members.includes(uid);
      statuses[group.gid] = { isJoined };
    }
    setGroupStatuses(statuses);
  };

  // Fetch group statuses when the filtered groups change
  // (i.e. when the user searches for a group or suggestions change)
  useEffect(() => {
    if (filteredGroups.length > 0) {
      fetchGroupStatuses();
    }
  }, [filteredGroups]);

  // Handle joining a group request
  const handleJoin = async (gid: string) => {
    try {
      const group: DBGroup = await firestoreCtrl.getGroup(gid);
      await firestoreCtrl.addGroupToUser(uid, group.name);
      await firestoreCtrl.addMemberToGroup(gid, uid);

      const updateDate = new Date();

      await firestoreCtrl.updateGroup(gid, updateDate);

      // Navigate to the group screen
      navigation.navigate("GroupScreen", { currentGroup: group });
    } catch (error) {
      alert("It seems you cannot join this group for now, try again later...");
      console.error("Error joining group:", error);
    }
  };

  return {
    groupStatuses,
    handleJoin,
  };
}
