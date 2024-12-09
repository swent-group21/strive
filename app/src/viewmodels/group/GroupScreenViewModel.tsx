import { useEffect, useState } from "react";
import FirestoreCtrl, {
  DBChallenge,
  DBUser,
  DBGroup,
} from "@/src/models/firebase/FirestoreCtrl";

export default function useGroupScreenViewModel(
  user: DBUser,
  firestoreCtrl: FirestoreCtrl,
  route: any,
) {
  const [groupChallenges, setGroupChallenges] = useState<DBChallenge[]>([]);
  const [otherGroups, setOtherGroups] = useState<DBGroup[]>([]);
  const group: DBGroup = route.params?.currentGroup;

  const groupId = group.gid ?? "";

  useEffect(() => {
    if (user.uid) {
      const fetchGroupChallenges = async () => {
        try {
          const challengesData =
            await firestoreCtrl.getAllPostsOfGroup(groupId);
          setGroupChallenges(challengesData);
        } catch (error) {
          console.error("Error fetching challenges: ", error);
        }
      };
      fetchGroupChallenges();
    }
  }, [user.uid, firestoreCtrl, groupId]);

  useEffect(() => {
    if (user.uid) {
      const fetchGroups = async () => {
        try {
          // Fetch groups
          await firestoreCtrl.getGroupsByUserId(user.uid).then((groups) => {
            const filteredGroups = groups.filter(
              (group) =>
                groupId !== group.gid && group.updateDate !== undefined,
            );
            setOtherGroups(filteredGroups);
          });
        } catch (error) {
          console.error("Error fetching groups: ", error);
        }
      };
      fetchGroups();
    }
  }, [user.uid, firestoreCtrl, group]);

  const groupName = group.name ?? "";
  const groupChallengeTitle = group.challengeTitle ?? "";

  return {
    groupChallenges,
    otherGroups,
    groupName,
    groupChallengeTitle,
    groupId,
  };
}
