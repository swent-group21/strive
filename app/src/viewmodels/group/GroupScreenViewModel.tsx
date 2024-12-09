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
    const fetchGroups = async (uid) => {
      try {
        const groups = await firestoreCtrl.getGroupsByUserId(uid);
        return groups.filter(
          (group) => groupId !== group.gid && group.updateDate !== undefined,
        );
      } catch (error) {
        console.error("Error fetching groups: ", error);
        return [];
      }
    };

    if (user.uid) {
      fetchGroups(user.uid).then(setOtherGroups);
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
