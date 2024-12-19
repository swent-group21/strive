import { useEffect, useState } from "react";
import FirestoreCtrl, {
  DBChallenge,
  DBUser,
  DBGroup,
} from "@/src/models/firebase/FirestoreCtrl";
import { GeoPoint } from "firebase/firestore";

/**
 * View model for the group screen.
 * @param user : the user object
 * @param firestoreCtrl : FirestoreCtrl object
 * @param route : the route object
 * @returns : groupChallenges, otherGroups, groupName, groupChallengeTitle, and groupId
 */
export function useGroupScreenViewModel({
  user,
  firestoreCtrl,
  route,
}: {
  user: DBUser;
  firestoreCtrl: FirestoreCtrl;
  route: any;
}): {
  groupChallenges: DBChallenge[];
  otherGroups: DBGroup[];
  groupName: string;
  groupChallengeTitle: string;
  groupId: string;
  groupCenter: GeoPoint;
  groupRadius: number;
} {
  const [groupChallenges, setGroupChallenges] = useState<DBChallenge[]>([]);
  const [otherGroups, setOtherGroups] = useState<DBGroup[]>([]);
  const group: DBGroup = route.params?.currentGroup;

  const groupId = group.gid ?? "";

  useEffect(() => {
    if (user.uid) {
      const fetchGroupChallenges = async () => {
        try {
          await firestoreCtrl
            .getAllPostsOfGroup(groupId)
            .then((challenge: DBChallenge[]) => {
              // Sort challenges by date
              const sortedChallenges = challenge.sort((a, b) =>
                a.date && b.date
                  ? new Date(b.date).getTime() - new Date(a.date).getTime()
                  : 0,
              );
              setGroupChallenges(sortedChallenges);
            });
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
  const groupCenter = group.location;
  const groupRadius = group.radius;

  return {
    groupChallenges,
    otherGroups,
    groupName,
    groupChallengeTitle,
    groupId,
    groupCenter,
    groupRadius,
  };
}
