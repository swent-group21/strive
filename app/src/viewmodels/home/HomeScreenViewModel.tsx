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
  const navigateToCamera = () =>
    navigation.navigate("Camera", { group_id: "home" });
  const navigateToFriends = () => navigation.navigate("Friends");

  // Fetch the current challenge and the challenges
  useEffect(() => {
    // Fetch the current challenge
    const fetchCurrentChallenge = async () => {
      try {
        const currentChallengeData =
          await firestoreCtrl.getChallengeDescription();
        setTitleChallenge(currentChallengeData);
        return currentChallengeData.title;
      } catch (error) {
        console.error("Error fetching current challenge: ", error);
      }
    };

    // Fetch challenges
    const fetchChallenges = async (challengeTitle: string) => {
      try {
        await firestoreCtrl
          .getPostsByChallengeTitle(challengeTitle)
          .then((challenge: DBChallenge[]) => {
            // Sort challenges by date
            const sortedChallenges = challenge.sort((a, b) =>
              a.date && b.date
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : 0,
            );
            setChallenges(sortedChallenges);
          });
      } catch (error) {
        console.error("Error fetching challenges: ", error);
      }
    };

    fetchCurrentChallenge().then((challengeTitle) => {
      console.log("Current challenge fetched : ", challengeTitle);
      if (user.uid) fetchChallenges(challengeTitle);
    });
  }, [user.uid, firestoreCtrl]);


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
