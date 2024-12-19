import { useEffect, useState } from "react";
import {
  DBChallenge,
  DBUser,
  DBComment,
} from "@/src/models/firebase/TypeFirestoreCtrl";
import {
  getCommentsOf,
  getImageUrl,
  getLikesOf,
  getUser,
} from "@/src/models/firebase/GetFirestoreCtrl";
import { updateLikesOf } from "@/src/models/firebase/SetFirestoreCtrl";

/**
 * The Challenge viewmodel helps display a challenge.
 * @param challengeDB : the challenge object
 * @param currentUser : the current user object
 * @returns : a viewmodel component for the challenge
 */
export function useChallengeViewModel({
  challengeDB,
  currentUser,
}: {
  readonly challengeDB: DBChallenge;
  readonly currentUser: DBUser;
}) {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [comments, setComments] = useState<DBComment[]>([]);

  // Double-tap logic
  const [lastTap, setLastTap] = useState<number | null>(null);

  const [icon, setIcon] = useState<string>("person-circle-outline");
  const [image, setImage] = useState<string>("https://via.placeholder.com/300");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(challengeDB.uid);
        setUser(userData || null);
        userData.image_id
          ? await getImageUrl(userData.image_id).then(setIcon)
          : "";
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (challengeDB.uid) {
      fetchUser();
    }
  }, [challengeDB.uid]);

  // Fetch likes
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const fetchedLikes = await getLikesOf(challengeDB.challenge_id ?? "");
        setIsLiked(fetchedLikes.includes(currentUser.uid));
        setLikes(fetchedLikes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  });

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsOf(
          challengeDB.challenge_id ?? "",
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [challengeDB.challenge_id]);

  const handleLikePress = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);

      const newLikeList = newIsLiked
        ? [...likes, currentUser.uid]
        : likes.filter((userId) => userId !== currentUser.uid);

      setLikes(newLikeList);
      updateLikesOf(challengeDB.challenge_id ?? "", newLikeList);
      console.log("Likes updated successfully");
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  useEffect(() => {
    const fetchImgUrl = async (img: string) => {
      console.log("Using fetch");
      setImage(await getImageUrl(img));
    };

    console.log("challengeDB", challengeDB);
    if (challengeDB.image_id) {
      fetchImgUrl(challengeDB.image_id);
    }
  }, [challengeDB]);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      // Double tap detected
      handleLikePress();
    }
    setLastTap(now);
  };

  return {
    isLiked,
    user,
    comments,
    handleDoubleTap,
    handleLikePress,
    icon,
    image,
  };
}
