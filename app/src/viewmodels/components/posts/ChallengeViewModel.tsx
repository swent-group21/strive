import { useEffect, useState } from "react";
import FirestoreCtrl, {
  DBChallenge,
  DBUser,
  DBComment,
} from "@/src/models/firebase/FirestoreCtrl";

/**
 * The Challenge viewmodel helps display a challenge.
 * @param challengeDB : the challenge object
 * @param firestoreCtrl : FirestoreCtrl object
 * @param currentUser : the current user object
 * @returns : a viewmodel component for the challenge
 */
export function useChallengeViewModel({
  challengeDB,
  firestoreCtrl,
  currentUser,
}: {
  readonly challengeDB: DBChallenge;
  readonly firestoreCtrl: FirestoreCtrl;
  readonly currentUser: DBUser;
}) {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [comments, setComments] = useState<DBComment[]>([]);

  // Double-tap logic
  const [lastTap, setLastTap] = useState<number | null>(null);

  const placeholderImage = "https://via.placeholder.com/300";

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await firestoreCtrl.getUser(challengeDB.uid);
        setUser(userData || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (challengeDB.uid) {
      fetchUser();
    }
  }, [challengeDB.uid, firestoreCtrl]);

  // Fetch likes
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const fetchedLikes = await firestoreCtrl.getLikesOf(
          challengeDB.challenge_id ?? "",
        );
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
        const fetchedComments = await firestoreCtrl.getCommentsOf(
          challengeDB.challenge_id ?? "",
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [challengeDB.challenge_id, firestoreCtrl]);

  const handleLikePress = async () => {
    try {
      if (currentUser.name == "Guest") {
        return;
      }

      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);

      const newLikeList = newIsLiked
        ? [...likes, currentUser.uid]
        : likes.filter((userId) => userId !== currentUser.uid);

      setLikes(newLikeList);
      firestoreCtrl.updateLikesOf(challengeDB.challenge_id ?? "", newLikeList);
      console.log("Likes updated successfully");
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

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
    placeholderImage,
  };
}
