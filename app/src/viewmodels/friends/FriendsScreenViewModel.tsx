import { useEffect, useState } from "react";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import {
  getAllUsers,
  getFriendRequests,
  getFriendSuggestions,
  getFriends,
} from "@/src/models/firebase/GetFirestoreCtrl";

/**
 * View model for the Friends screen.
 * @param uid : the user's ID
 * @returns : searchText, setSearchText, users, friends, requests, filteredUsers, handleFriendPress
 */
export function useFriendsScreenViewModel(uid: string): {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  users: DBUser[];
  friends: DBUser[];
  requests: DBUser[];
  filteredUsers: DBUser[];
  suggestions: DBUser[];
  handleFriendPress: (friendId: DBUser) => void;
} {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<DBUser[]>([]);
  const [friends, setFriends] = useState<DBUser[]>([]);
  const [requests, setRequests] = useState<DBUser[]>([]);

  const [suggestions, setSuggestions] = useState<DBUser[]>([]);

  // Fetch friend suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const suggestions = await getFriendSuggestions(uid);
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching friend suggestions: ", error);
      }
    };
    fetchSuggestions();
  }, [uid]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friends = await getFriends(uid);
        setFriends(friends);
      } catch (error) {
        console.error("Error fetching friends: ", error);
      }
    };
    fetchFriends();
  }, [uid]);

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getFriendRequests(uid);
        setRequests(requests);
      } catch (error) {
        console.error("Error fetching requests: ", error);
      }
    };
    fetchRequests();
  }, [uid]);

  const filteredUsers = searchText
    ? users.filter(
        (user: DBUser) =>
          user.uid &&
          user.uid !== uid &&
          user.name?.toLowerCase().includes(searchText.toLowerCase()),
      )
    : [];

  const handleFriendPress = (friend: DBUser) => {
    console.log("Friend pressed: ", friend);
  };

  return {
    searchText,
    setSearchText,
    users,
    friends,
    requests,
    filteredUsers,
    suggestions,
    handleFriendPress,
  };
}
