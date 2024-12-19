import { useEffect, useState } from "react";
import FirestoreCtrl, { DBGroup } from "@/src/models/firebase/FirestoreCtrl";

/**
 * View model for the Join Group screen.
 * @param firestoreCtrl : FirestoreCtrl object
 * @param uid : the user's ID
 * @returns : searchText, setSearchText, users, friends, requests, filteredUsers, handleFriendPress
 */
export function useJoinGroupViewModel(
  firestoreCtrl: FirestoreCtrl,
  uid: string,
): {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  filteredGroups: DBGroup[];
  suggestions: DBGroup[];
} {
  const [searchText, setSearchText] = useState("");
  const [allGroups, setAllGroups] = useState<DBGroup[]>([]);
  const [suggestions, setSuggestions] = useState<DBGroup[]>([]);

  // Fetch groups suggestions based on the user's friends
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const suggestions = await firestoreCtrl.getGroupSuggestions(uid);
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching groups suggestions: ", error);
      }
    };
    fetchSuggestions();
  }, [firestoreCtrl, uid]);

  // Fetch all existing groups to filter the search in them
  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const allGroups = await firestoreCtrl.getAllGroups();
        setAllGroups(allGroups);
      } catch (error) {
        console.error("Error fetching groups: ", error);
      }
    };
    fetchAllGroups();
  }, [firestoreCtrl]);

  // Filter groups based on search text updated by the user
  const filteredGroups = searchText
    ? allGroups.filter(
        (group) =>
          group.gid &&
          !group.members.includes(uid) &&
          group.name?.toLowerCase().includes(searchText.toLowerCase()),
      )
    : [];

  return {
    searchText,
    setSearchText,
    filteredGroups,
    suggestions,
  };
}
