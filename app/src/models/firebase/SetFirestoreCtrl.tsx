import {
  firestore,
  doc,
  addDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  getDoc,
  arrayUnion,
  updateDoc,
} from "@/src/models/firebase/Firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import NetInfo from "@react-native-community/netinfo";

import {
  setUploadTaskScheduled,
  getUploadTaskScheduled,
} from "@/src/models/firebase/LocalStorageCtrl";
import { DBUser, DBChallenge, DBComment, DBGroup } from "./TypeFirestoreCtrl";
import {
  storeChallengeLocally,
  storeCommentLocally,
  storeGroupLocally,
  storeImageLocally,
} from "@/src/models/firebase/LocalStorageCtrl";
import { getImageUrl, getUser } from "./GetFirestoreCtrl";

/**
 * Creates or updates a user document in Firestore.
 * @param userId The UID of the user.
 * @param userData The user data to store or update.
 * @returns A promise that resolves when the user is created or updated.
 */
export async function createUser(
  userId: string,
  userData: DBUser,
): Promise<void> {
  try {
    userData.uid = userId;
    await setDoc(doc(firestore, "users", userId), userData);
  } catch (error) {
    console.error("Error writing user document: ", error);
  }
}

/**
 * Upload an image to Firestore storage.
 * @param imageUri The URI of the image to upload.
 * @returns The ID of the image.
 */
export async function uploadImage(
  imageUri?: string,
  id_picture?: string,
): Promise<string> {
  try {
    if (imageUri === undefined) {
      let imageUri = getImageUrl(id_picture);
    }
    let img_id: string = id_picture;
    if (id_picture === undefined) {
      img_id = (Math.random() + 1).toString(36).substring(2);
    }

    const networkState = await NetInfo.fetch();

    if (networkState.isConnected) {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(getStorage(), "images/" + img_id);
      await uploadBytes(storageRef, blob);
      console.log("Uploaded to Firestore");
      return img_id;
    }

    console.warn("No internet connection. Skipping image upload.");
    //Store the image locally for background upload
    await storeImageLocally(img_id);
    setUploadTaskScheduled(true);
    console.log("Uploaded to local storage");
    return img_id;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
}

/**
 * Set the name of a user by their UID.
 * @param id The UID of the user.
 * @param name The name to set.
 * @param setUser The function to set the user.
 * @returns A promise that resolves when the name is set.
 */
export async function setName(
  id: string,
  name: string,
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
): Promise<void> {
  try {
    const user = await getUser(id);
    user.name = name;
    await createUser(id, user);
    setUser(user);
  } catch (error) {
    console.error("Error setting name: ", error);
  }
}

/**
 * Set the profile picture of a user by their UID.
 * @param id The UID of the user.
 * @param imageUri The URI of the image to set.
 * @param setUser The function to set the user.
 * @returns A promise that resolves when the profile picture is set.
 */
export async function setProfilePicture(
  id: string,
  imageUri: string,
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
): Promise<void> {
  try {
    const user = await getUser(id);
    user.image_id = await uploadImage(imageUri);
    console.log("User image: ", user.image_id);
    await createUser(id, user);
    setUser(user);
  } catch (error) {
    console.error("Error setting profile picture: ", error);
  }
}

/**
 * Create a challenge using the challenge_id and DBChallenge
 * @param challengeData The challenge data to add.
 * @returns A promise that resolves when the challenge is created.
 */
export async function newChallenge(challengeData: DBChallenge): Promise<void> {
  try {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected && networkState.isInternetReachable) {
      if (challengeData.challenge_id) {
        const duplicate_query = query(
          collection(firestore, "challenges"),
          where("challenge_id", "==", challengeData.challenge_id),
        );
        const docSnap = await getDocs(duplicate_query);
        if (!docSnap.empty) {
          console.log("Challenge already exists");
          return;
        }
      }
      await addDoc(collection(firestore, "challenges"), challengeData);
      return;
    }
    try {
      // Schedule background retry
      await storeChallengeLocally(challengeData);
      setUploadTaskScheduled(true);
      console.log("getUploadTaskScheduled: ", await getUploadTaskScheduled());
    } catch (storageError) {
      console.error("Error storing challenge locally: ", storageError);
    }
  } catch (error) {
    console.error("Error writing challenge document to Firestore: ", error);
  }
}

/**
 * Create a group in firestore
 * @param groupData The group data to add.
 * @returns A promise that resolves when the group is created.
 */
export async function newGroup(groupData: DBGroup): Promise<void> {
  try {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected && networkState.isInternetReachable) {
      const duplicate_query = query(
        collection(firestore, "groups"),
        where("gid", "==", groupData.gid),
      );
      const docSnap = await getDocs(duplicate_query);
      if (!docSnap.empty) {
        console.log("Group already exists");
        return;
      }
      await addDoc(collection(firestore, "groups"), groupData);
      return;
    }

    try {
      // 2. Store group data locally for later upload
      await storeGroupLocally(groupData);
      // Schedule background retry if offline
      setUploadTaskScheduled(true);
    } catch (storageError) {
      console.error("Error storing group locally: ", storageError);
    }
  } catch (error) {
    console.error("Error writing group document to Firestore: ", error);
  }
}

/**
 * Update a group in firestore with last post date
 * @param gid The ID of the group to update.
 * @param updateTime The time of the last post.
 * @returns A promise that resolves when the group is updated.
 */
export async function updateGroup(
  gid: string,
  updateTime: Date,
): Promise<void> {
  try {
    const groupRef = doc(firestore, "groups", gid);
    const docSnap = await getDoc(groupRef);
    const groupData = docSnap.data() as DBGroup;

    groupData.updateDate = updateTime;
    groupData.gid = gid;

    await setDoc(doc(firestore, "groups", gid), groupData);
  } catch (error) {
    console.error("Error updating group: ", error);
  }
}

/**
 * Update a group in firestore with last post date
 * @param gid The ID of the group to update.
 * @param updateTime The time of the last post.
 * @returns A promise that resolves when the group is updated.
 */
export async function addGroupToMemberGroups(
  uid: string,
  group_name: string,
): Promise<void> {
  try {
    await updateDoc(doc(firestore, "users", uid), {
      groups: arrayUnion(group_name),
    });
  } catch (error) {
    console.error("Error setting name: ", error);
  }
}

/**
 * Add a new comment to a challenge.
 * @param commentData The comment data to add.
 * @returns A promise that resolves when the comment is added.
 */
export async function appendComment(commentData: DBComment): Promise<void> {
  try {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected && networkState.isInternetReachable) {
      const duplicate_query = query(
        collection(firestore, "comments"),
        where("created_at", "==", commentData.created_at),
      );
      const docSnap = await getDocs(duplicate_query);
      if (!docSnap.empty) {
        console.log("Comment already exists");
        return;
      }
      await addDoc(collection(firestore, "comments"), commentData);
      return;
    }
    try {
      storeCommentLocally(commentData);
      // Schedule background retry
      setUploadTaskScheduled(true);
    } catch (error) {
      console.error("Error storing comment locally:", error);
    }
  } catch (error) {
    console.error("Error writing comment document to Firestore:", error);
  }
}

/**
 * Updates the likes of a challenge.
 * @param challengeId The ID of the challenge to update likes for.
 * @param likes The new list of likes to set.
 * @returns A promise that resolves when the likes are updated.
 */
export async function updateLikesOf(
  challengeId: string,
  likes: string[],
): Promise<void> {
  try {
    const challengeRef = doc(firestore, "challenges", challengeId);
    await setDoc(challengeRef, { likes }, { merge: true });
  } catch (error) {
    console.error("Error updating likes: ", error);
  }
}

/**
 * Add a friend to the user's friend list.
 * @param userId The UID of the user.
 * @param friendId The UID of the friend to add.
 * @returns A promise that resolves when the friend is added.
 */
export async function addFriend(
  userId: string,
  friendId: string,
): Promise<void> {
  try {
    const user = await getUser(userId);
    const friend = await getUser(friendId);

    user.userRequestedFriends = user.userRequestedFriends || [];
    friend.friendsRequestedUser = friend.friendsRequestedUser || [];

    if (user.friends?.includes(friendId)) {
      return;
    }

    user.userRequestedFriends?.push(friendId);
    friend.friendsRequestedUser?.push(userId);

    await createUser(userId, user);
    await createUser(friendId, friend);
  } catch (error) {
    console.error("Error adding friend: ", error);
    throw error;
  }
}

/**
 * Accept a friend request.
 * @param userId The UID of the user.
 * @param friendId The UID of the friend to accept.
 * @returns A promise that resolves when the friend request is accepted.
 * */
export async function acceptFriend(
  userId: string,
  friendId: string,
): Promise<void> {
  try {
    const user = await getUser(userId);
    const friend = await getUser(friendId);

    user.friends = user.friends || [];
    friend.friends = friend.friends || [];

    if (user.friends?.includes(friendId)) {
      return;
    }

    user.friends?.push(friendId);
    friend.friends?.push(userId);

    user.friendsRequestedUser = user.friendsRequestedUser?.filter(
      (id) => id !== friendId,
    );
    friend.userRequestedFriends = friend.userRequestedFriends?.filter(
      (id) => id !== userId,
    );

    await createUser(userId, user);
    await createUser(friendId, friend);
  } catch (error) {
    console.error("Error accepting friend: ", error);
  }
}

/**
 * Reject a friend request.
 * @param userId The UID of the user.
 * @param friendId The UID of the user to reject.
 * @returns A promise that resolves when the friend request is rejected.
 * */
export async function rejectFriend(
  userId: string,
  friendId: string,
): Promise<void> {
  try {
    const user = await getUser(userId);
    const friend = await getUser(friendId);

    user.userRequestedFriends = user.userRequestedFriends || [];
    friend.friendsRequestedUser = friend.friendsRequestedUser || [];

    user.friendsRequestedUser = user.friendsRequestedUser?.filter(
      (id) => id !== friendId,
    );
    friend.userRequestedFriends = friend.userRequestedFriends?.filter(
      (id) => id !== userId,
    );

    await createUser(userId, user);
    await createUser(friendId, friend);
  } catch (error) {
    console.error("Error rejecting friend: ", error);
    throw error;
  }
}

/**
 * Remove a friend from the user's friend list.
 * @param userId The UID of the user.
 * @param friendId The UID of the friend to remove.
 * @returns A promise that resolves when the friend is removed.
 */
export async function removeFriendRequest(
  userId: string,
  friendId: string,
): Promise<void> {
  try {
    const user = await getUser(userId);
    const friend = await getUser(friendId);

    user.friendsRequestedUser = user.friendsRequestedUser || [];
    friend.userRequestedFriends = friend.userRequestedFriends || [];

    user.userRequestedFriends = user.userRequestedFriends?.filter(
      (id) => id !== friendId,
    );
    friend.friendsRequestedUser = friend.friendsRequestedUser?.filter(
      (id) => id !== userId,
    );

    await createUser(userId, user);
    await createUser(friendId, friend);
  } catch (error) {
    console.error("Error unadding friend: ", error);
    throw error;
  }
}
