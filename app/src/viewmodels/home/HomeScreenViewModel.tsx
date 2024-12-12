import { useEffect, useState } from "react";
import FirestoreCtrl, {
  DBChallenge,
  DBUser,
  DBGroup,
  DBChallengeDescription,
} from "@/src/models/firebase/FirestoreCtrl";

/**
 * View model for the home screen.
 * @param user : the user object
 * @param firestoreCtrl : FirestoreCtrl object
 * @param navigation : navigation object
 * @returns : userIsGuest, challenges, groups, and titleChallenge
 */
export function useHomeScreenViewModel(
  user: DBUser,
  firestoreCtrl: FirestoreCtrl,
  navigation: any,
): {
  userIsGuest: boolean;
  challenges: DBChallenge[];
  groups: DBGroup[];
  titleChallenge: DBChallengeDescription;
  navigateToProfile: () => void;
  navigateToMap: () => void;
  navigateToCamera: () => void;
  navigateToFriends: () => void;
  challengesFromFriends: DBChallenge[];
} {
  const userIsGuest = user.name === "Guest";

  const [challenges, setChallenges] = useState<DBChallenge[]>([]);
  const [groups, setGroups] = useState<DBGroup[]>([]);
  const [titleChallenge, setTitleChallenge] = useState<DBChallengeDescription>({
    title: "Challenge Title",
    description: "Challenge Description",
    endDate: new Date(2024, 1, 1, 0, 0, 0, 0),
  });
  const navigateToProfile = () => navigation.navigate("Profile");
  const navigateToMap = () => navigation.navigate("MapScreen");
  const navigateToCamera = () => navigation.navigate("Camera");
  const navigateToFriends = () => navigation.navigate("Friends");

  // Fetch the current challenge
  useEffect(() => {
    const fetchCurrentChallenge = async () => {
      try {
        const currentChallengeData =
          await firestoreCtrl.getChallengeDescription();
        setTitleChallenge(currentChallengeData);
      } catch (error) {
        console.error("Error fetching current challenge: ", error);
      }
    };

    fetchCurrentChallenge();
  }, [firestoreCtrl]);

  // Fetch the challenges
  useEffect(() => {
    if (user.uid) {
      const fetchChallenges = async () => {
        try {
          const challengesData = await firestoreCtrl.getKChallenges(100);
          setChallenges(challengesData);
        } catch (error) {
          console.error("Error fetching challenges: ", error);
        }
      };
      fetchChallenges();
    }
  }, [firestoreCtrl]);

  // Fetch the groups
  useEffect(() => {
    if (user.uid) {
      const fetchGroups = async () => {
        try {
          const groupsData = await firestoreCtrl.getGroupsByUserId(user.uid);
          setGroups(groupsData);
        } catch (error) {
          console.error("Error fetching groups: ", error);
        }
      };
      fetchGroups();
    }
  }, [user.uid, firestoreCtrl]);

  // Filter challenges to only include those from friends
  const challengesFromFriends = challenges.filter((challenge) =>
    user.friends?.includes(challenge.uid),
  );

  return {
    userIsGuest,
    challenges,
    groups,
    titleChallenge,
    navigateToProfile,
    navigateToMap,
    navigateToCamera,
    navigateToFriends,
    challengesFromFriends,
  };
}
