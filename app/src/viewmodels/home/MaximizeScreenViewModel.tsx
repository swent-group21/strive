import { useEffect, useState } from "react";
import {
  DBChallenge,
  DBComment,
  DBUser,
} from "@/src/models/firebase/TypeFirestoreCtrl";
import { GeoPoint } from "firebase/firestore";
import {
  getCommentsOf,
  getGroup,
  getImageUrl,
  getLikesOf,
  getUser,
} from "@/src/models/firebase/GetFirestoreCtrl";
import {
  appendComment,
  updateLikesOf,
} from "@/src/models/firebase/SetFirestoreCtrl";

/**
 * View model for the maximize screen.
 * @param user : the user object
 * @param challenge : the challenge object
 * @param navigation : navigation object
 * @returns : commentText, setCommentText, commentList, postUser, likeList, isLiked, toggleLike, addComment, postDate, postTitle, postImage, and postDescription
 */
export function useMaximizeScreenViewModel(
  user: DBUser,
  challenge: DBChallenge,
  navigation: any,
) {
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState<DBComment[]>([]);
  const [postUser, setPostUser] = useState<DBUser>();
  const [likeList, setLikeList] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [groupCenter, setGroupCenter] = useState<GeoPoint | undefined>();
  const [groupRadius, setGroupRadius] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [icon, setIcon] = useState<string>("person-circle-outline");
  const [image, setImage] = useState<string>("https://via.placeholder.com/300");

  const currentUserId = user.uid;
  const currentUserName = user.name;
  const groupId = challenge.group_id;

  const navigateGoBack = () => {
    navigation.goBack();
  };

  const [showGuestPopup, setShowGuestPopup] = useState<string | null>(null);

  const handleUserInteraction = (
    guestPopUpMsg: string,
    interaction: () => void,
  ) => {
    if (user.name === "Guest") {
      setShowGuestPopup(guestPopUpMsg);
    } else {
      interaction();
    }
  };

  useEffect(() => {
    // Fetch post user data
    const postUid = challenge.uid;
    getUser(postUid).then((user) => {
      setPostUser(user);
    });

    // Fetch comments
    getCommentsOf(challenge.challenge_id ?? "").then((comments) => {
      const sortedComments = comments.sort(
        (a, b) => a.created_at.getTime() - b.created_at.getTime(),
      );
      setCommentList(sortedComments);
    });

    // Fetch likes
    getLikesOf(challenge.challenge_id ?? "").then((likes) => {
      setLikeList(likes);
      setIsLiked(likes.includes(currentUserId));
    });
  }, [challenge, currentUserId]);

  // Gets the challenge's group area, if it exists
  useEffect(() => {
    if (groupId) {
      getGroup(groupId).then((group) => {
        setGroupCenter(group.location);
        setGroupRadius(group.radius);
      });
    }
  }, [groupId]);

  const fetchImgUrl = async (img) => {
    return getImageUrl(img);
  };

  useEffect(() => {
    if (user.image_id !== undefined || user.image_id == null) {
      fetchImgUrl(user.image_id).then(setIcon);
    }
  }, [user]);

  useEffect(() => {
    if (challenge.image_id) {
      fetchImgUrl(challenge.image_id).then(setImage);
    }
  }, [challenge.image_id]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    const updatedLikeList = isLiked
      ? likeList.filter((userId) => userId !== currentUserId)
      : [...likeList, currentUserId];

    setLikeList(updatedLikeList);
    updateLikesOf(challenge.challenge_id ?? "", updatedLikeList);
  };

  const addComment = async () => {
    if (commentText.length > 0) {
      const commentData: DBComment = {
        comment_text: commentText,
        user_name: currentUserName ?? "",
        created_at: new Date(),
        post_id: challenge.challenge_id ?? "",
        uid: currentUserId,
      };
      setIsLoading(true);
      await appendComment(commentData);
      setCommentList([...commentList, commentData]);
      setCommentText("");
      setIsLoading(false);
    }
  };

  const postDate: Date = challenge.date ? challenge.date : new Date();
  const postCaption =
    challenge.caption == "" ? "Secret Challenge" : challenge.caption;

  return {
    commentText,
    setCommentText,
    commentList,
    postUser,
    likeList,
    isLiked,
    toggleLike,
    addComment,
    postDate,
    postCaption,
    navigateGoBack,
    groupCenter,
    groupRadius,
    isLoading,
    icon,
    image,
    showGuestPopup,
    setShowGuestPopup,
    handleUserInteraction,
  };
}
