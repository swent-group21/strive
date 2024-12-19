import { useEffect, useState } from "react";
import {
  DBChallenge,
  DBUser,
  DBGroup,
} from "@/src/models/firebase/TypeFirestoreCtrl";
import { GeoPoint } from "firebase/firestore";
import {
  getAllPostsOfGroup,
  getGroupsByUserId,
  getImageUrl,
} from "@/src/models/firebase/GetFirestoreCtrl";

/**
 * View model for the group screen.
 * @param user : the user object
 * @param route : the route object
 * @returns : groupChallenges, otherGroups, groupName, groupChallengeTitle, and groupId
 */
export default function useGroupScreenViewModel(
  user: DBUser,
  route: any,
): {
  groupChallenges: DBChallenge[];
  otherGroups: DBGroup[];
  groupName: string;
  groupChallengeTitle: string;
  groupId: string;
  groupCenter: GeoPoint;
  groupRadius: number;
  icon: string;
} {
  const [groupChallenges, setGroupChallenges] = useState<DBChallenge[]>([]);
  const [otherGroups, setOtherGroups] = useState<DBGroup[]>([]);
  const group: DBGroup = route.params?.currentGroup;
  const [icon, setIcon] = useState<string>("person-circle-outline");
  const groupId = group.gid ?? "";

  useEffect(() => {
    if (user.uid) {
      const fetchGroupChallenges = async () => {
        try {
          await getAllPostsOfGroup(groupId).then((challenge: DBChallenge[]) => {
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
  }, [user.uid, groupId]);

  useEffect(() => {
    const fetchGroups = async (uid) => {
      try {
        const groups = await getGroupsByUserId(uid);
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
  }, [user.uid, group]);

  useEffect(() => {
    const fetchImgUrl = async (img) => {
      return getImageUrl(img);
    };
    if (user.image_id) {
      fetchImgUrl(user.image_id).then(setIcon);
    }
  }, [user]);

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
    icon,
  };
}
