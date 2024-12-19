import {
  firestore,
  doc,
  getDoc,
  getDocs,
  auth,
  collection,
  query,
  where,
  limit,
} from "@/src/models/firebase/Firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import NetInfo from "@react-native-community/netinfo";
import {
  DBChallenge,
  DBChallengeDescription,
  DBComment,
  DBGroup,
  DBUser,
} from "./TypeFirestoreCtrl";
import { getStoredImageById } from "./LocalStorageCtrl";

/**
 * Retrieves a user document from Firestore by UID.
 * If no userId is provided, it checks for `auth.currentUser`.
 * If there's no `auth.currentUser`, it uses the anonymous user account with a specific ID.
 * @param userId The UID of the user to retrieve.
 * @returns A promise that resolves to the user data or null if not found.
 */
export async function getUser(userId?: string): Promise<DBUser> {
  try {
    let uid: string;
    if (userId != null) {
      uid = userId;
    } else {
      const currUser = auth.currentUser;
      if (currUser != null) {
        uid = currUser.uid;
      } else {
        // Use the anonymous user account ID
        uid = "rhf9LyQ4r1UGZWtepzFENAjJQfo2";
      }
    }
    const userRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as DBUser;
    } else {
      console.error("User not found.");
    }
  } catch (error) {
    throw new Error("Error getting user");
  }
}

/**
 * Get the url of an image
 * @param id_picture The id of the image
 * @returns The download URL of the image.
 */
export async function getImageUrl(id_picture: string): Promise<string> {
  console.log("Inside URL:", id_picture);
  const networkState = await NetInfo.fetch();
  if (networkState.isConnected) {
    console.log("Getting Firestore Image: ");
    const storageRef = ref(getStorage(), "images/" + id_picture);
    const url = await getDownloadURL(storageRef);
    console.log("Getting Firestore Image: ", url);
    return url;
  } else {
    console.log("Getting Stored Image: ");
    const url = await getStoredImageById(id_picture);
    console.log("Getting Stored Image: ", url);
    return url;
  }
}

/**
 * Get the name of a user by their UID.
 * @param id The UID of the user.
 * @returns The name of the user.
 */
export async function getName(id: string): Promise<string | undefined> {
  try {
    const user = await getUser(id);
    return user?.name;
  } catch (error) {
    console.error("Error getting name: ", error);
  }
}

/**
 * Get the profile picture of a user by their UID.
 * @param id The UID of the user.
 * @returns The ID of the image.
 */
export async function getProfilePicture(
  id: string,
): Promise<string | undefined> {
  try {
    const user = await getUser(id);
    return user?.image_id;
  } catch (error) {
    console.error("Error getting profile picture: ", error);
  }
}

/**
 * Create a challenge using the challenge_id and DBChallenge
 * @param challengeId The ID of the challenge to update.
 * @returns A promise that resolves when the challenge is updated.
 */
export async function getChallenge(challengeId: string): Promise<DBChallenge> {
  try {
    const challengeRef = doc(firestore, "challenges", challengeId);
    const docSnap = await getDoc(challengeRef);
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        date: docSnap.data().date.toDate(),
      } as DBChallenge;
    } else {
      throw new Error("Challenge not found.");
    }
  } catch (error) {
    console.log("Error getting Challenge: ", error);
    throw error;
  }
}

/**
 * Retrieves all challenges created by a specific user.
 * @param uid The UID of the user whose challenges are to be fetched.
 * @returns A promise that resolves to an array of challenges.
 */
export async function getChallengesByUserId(
  uid: string,
): Promise<DBChallenge[]> {
  try {
    const challengesRef = collection(firestore, "challenges");
    const q = query(challengesRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);
    const challenges = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        challenge_id: doc.id,
        date: data.date.toDate(),
      } as DBChallenge;
    });
    return challenges;
  } catch (error) {
    console.error("Error getting challenges by user ID: ", error);
    throw error;
  }
}

/**
 * Retrieves the first k challenges from Firestore.
 * @param k The number of challenges to retrieve.
 * @returns A promise that resolves to an array of challenges.
 */
export async function getKChallenges(k: number): Promise<DBChallenge[]> {
  try {
    const challengesRef = collection(firestore, "challenges");
    const q = query(challengesRef, limit(k));
    const querySnapshot = await getDocs(q);
    const challenges = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        challenge_id: doc.id,
        date: data.date.toDate(),
      } as DBChallenge;
    });
    return challenges;
  } catch (error) {
    console.error("Error getting challenges: ", error);
    throw error;
  }
}

/**
 * Retrieves all comments of a specific challenge.
 * @param challengeId The ID of the challenge to get comments for.
 * @returns A promise that resolves to an array of comments.
 */
export async function getCommentsOf(challengeId: string): Promise<DBComment[]> {
  try {
    const commentsRef = collection(firestore, "comments");
    const q = query(commentsRef, where("post_id", "==", challengeId));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        comment_id: doc.id,
        comment_text: data.comment_text,
        user_name: data.user_name,
        created_at: data.created_at.toDate(),
        post_id: data.post_id,
        uid: data.uid,
      } as DBComment;
    });
    return comments;
  } catch (error) {
    console.error("Error getting comments: ", error);
    throw error;
  }
}

/**
 * Retrieves all groups assigned to a specific user.
 * @param uid The UID of the user whose groups are to be fetched.
 * @returns A promise that resolves to an array of groups.
 */
export async function getGroupsByUserId(uid: string): Promise<DBGroup[]> {
  try {
    const userRef = doc(firestore, "users", uid);
    const userDoc = await getDoc(userRef);

    const userData = userDoc.data() as DBUser;

    if (!userData.groups || userData.groups.length === 0) {
      return [];
    }

    // Retrieve all groups using the group IDs
    const groupsRef = collection(firestore, "groups");

    const q = query(groupsRef, where("name", "in", userData.groups));

    const groupSnapshots = await getDocs(q);

    // Map the results into an array of DBGroup
    const dbGroups: DBGroup[] = groupSnapshots.docs.map(
      (doc) =>
        ({
          gid: doc.id,
          ...doc.data(),
        }) as DBGroup,
    );

    return dbGroups;
  } catch (error) {
    console.error("Error getting groups by user ID: ", error);
    throw error;
  }
}

/**
 * Retrieves all members assigned to a specific group.
 * @param uid The UID of the group whose members are to be fetched.
 * @returns A promise that resolves to an array of groups.
 */
export async function getUsersInGroup(gid: string): Promise<DBUser[]> {
  try {
    const groupRef = doc(firestore, "groups", gid);
    const groupDoc = await getDoc(groupRef);

    const userData = groupDoc.data() as DBGroup;

    if (!userData.members || userData.members.length === 0) {
      return [];
    }

    // Retrieve all users using the user IDs
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("uid", "in", userData.members));

    const usersSnapshots = await getDocs(q);

    // Map the results into an array of DBUser
    const dbUsers: DBUser[] = usersSnapshots.docs.map(
      (doc) =>
        ({
          uid: doc.id,
          ...doc.data(),
        }) as DBUser,
    );

    return dbUsers;
  } catch (error) {
    console.error("Error getting groups by user ID: ", error);
    throw error;
  }
}

/**
 * Retrieves all posts of a specific group.
 * @param groupId The ID of the group to get posts for.
 * @returns A promise that resolves to an array of posts.
 */
export async function getAllPostsOfGroup(
  groupId: string,
): Promise<DBChallenge[]> {
  try {
    const postsRef = collection(firestore, "challenges");
    const q = query(postsRef, where("group_id", "==", groupId));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        challenge_id: doc.id,
        date: data.date.toDate(),
      } as DBChallenge;
    });
    return posts;
  } catch (error) {
    console.error("Error getting posts: ", error);
    throw error;
  }
}

/**
 * Get a group from firestore
 * @param gid The ID of the group to get.
 * @returns A promise that resolves to the group data.
 */
export async function getGroup(gid: string): Promise<DBGroup> {
  try {
    const groupRef = doc(firestore, "groups", gid);
    const docSnap = await getDoc(groupRef);
    if (docSnap.exists()) {
      return docSnap.data() as DBGroup;
    } else {
      throw new Error("Group not found.");
    }
  } catch (error) {
    console.log("Error getting Group: ", error);
    throw error;
  }
}

/**
 * Retrieves the likes of a challenge.
 * @param challengeId The ID of the challenge to get likes for.
 * @returns A promise that resolves to an array of user IDs.
 */
export async function getLikesOf(challengeId: string): Promise<string[]> {
  try {
    const challenge = await getChallenge(challengeId);
    return challenge.likes || [];
  } catch (error) {
    console.error("Error getting likes: ", error);
    throw error;
  }
}

/**
 * Retrieves the current challenge description from Firestore
 * @returns A promise that resolves to the current challenge description.
 */
export async function getChallengeDescription(): Promise<DBChallengeDescription> {
  try {
    const challengeDescrpitionRef = collection(
      firestore,
      "challenge_description",
    );
    const q = query(challengeDescrpitionRef);
    const querySnapshot = await getDocs(q);
    const challengeDescription: DBChallengeDescription[] =
      querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          title: data.Title,
          description: data.Description,
          endDate: data.Date.toDate(),
        } as DBChallengeDescription;
      });
    return challengeDescription[0];
  } catch (error) {
    console.error("Error getting challenge description: ", error);
    throw error;
  }
}

/**
 * Retrieves all users from Firestore.
 * @returns A promise that resolves to an array of users.
 * */
export async function getAllUsers(): Promise<DBUser[]> {
  try {
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(usersRef);
    const users: DBUser[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
      } as DBUser;
    });

    return users;
  } catch (error) {
    console.error("Error getting all users: ", error);
    throw error;
  }
}

/**
 *Retrieve the friends of a user.
 * @param userId The UID of the user.
 * @returns The friends of the user.
 */
export async function getFriends(userId: string): Promise<DBUser[]> {
  try {
    const user = await getUser(userId);
    const friends = await Promise.all(
      user.friends?.map(async (id) => await getUser(id)) || [],
    );
    return friends;
  } catch (error) {
    console.error("Error getting friends: ", error);
  }
}

/**
 *Retrieve the users that the user has requested to be friends with.
 * @param userId The UID of the user.
 * @returns The users that the user has requested to be friends with.
 */
export async function getRequestedFriends(userId: string): Promise<DBUser[]> {
  try {
    const user = await getUser(userId);
    const friends = await Promise.all(
      user.userRequestedFriends?.map(async (id) => await getUser(id)) || [],
    );
    return friends;
  } catch (error) {
    console.error("Error getting requested friends: ", error);
    throw error;
  }
}

/**
 *Retrieve the friends requests of a user.
 * @param userId The UID of the user.
 * @returns The friend requests of the user.
 */
export async function getFriendRequests(userId: string): Promise<DBUser[]> {
  try {
    const user = await getUser(userId);
    const friends = await Promise.all(
      user.friendsRequestedUser?.map(async (id) => await getUser(id)) || [],
    );
    return friends;
  } catch (error) {
    console.error("Error getting friends requested user: ", error);
    throw error;
  }
}

/**
 * Retrieves the posts of a specific challenge.
 *
 * @param challengeTitle The title of the challenge to get posts for.
 * @returns A promise that resolves to an array of posts.
 */
export async function getPostsByChallengeTitle(
  challengeTitle: string,
): Promise<DBChallenge[]> {
  try {
    const postsRef = collection(firestore, "challenges");
    const q = query(
      postsRef,
      where("challenge_description", "==", challengeTitle),
    );

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        challenge_id: doc.id,
        date: data.date.toDate(),
      } as DBChallenge;
    });
    return posts;
  } catch (error) {
    console.error("Error getting posts by challenge: ", error);
    throw error;
  }
}

/**
 * Check if a user is a friend of another user.
 * @param userId The UID of the user.
 * @param friendId The UID of the friend to check.
 * @returns if the user is a friend of another user.
 */
export async function isFriend(
  userId: string,
  friendId: string,
): Promise<boolean> {
  try {
    const user = await getUser(userId);
    return user.friends?.includes(friendId);
  } catch (error) {
    console.error("Error checking if friend: ", error);
  }
}

/**
 * Check if a user has requested to be friends with another user.
 * @param userId The UID of the user.
 * @param friendId The UID of the friend to check.
 * @returns if the user has requested to be friends with another user.
 */
export async function isRequested(
  userId: string,
  friendId: string,
): Promise<boolean> {
  try {
    const user = await getUser(userId);
    return user.userRequestedFriends?.includes(friendId);
  } catch (error) {
    console.error("Error checking if requested: ", error);
    throw error;
  }
}

/**
 * Get friend suggestions for a user.
 * @param uid The UID of the user.
 * @returns An array of user suggestions.
 */
export async function getFriendSuggestions(uid: string): Promise<DBUser[]> {
  const allUsers = await getAllUsers();
  const userFriends = await getFriends(uid);

  const friendSuggestions: DBUser[] = [];

  // get friends of friends
  for (const friend of userFriends) {
    const friendsOfFriend = await getFriends(friend.uid);
    for (const fof of friendsOfFriend) {
      if (fof.uid !== uid && !userFriends.some((f) => f.uid === fof.uid)) {
        friendSuggestions.push(fof);
      }
    }
  }

  // complete with random users
  const neededSuggestions = 10 - friendSuggestions.length;
  if (neededSuggestions > 0) {
    const randomUsers = allUsers
      .filter(
        (user) =>
          user.uid !== uid &&
          user.name !== "Guest" &&
          !userFriends.some((f) => f.uid === user.uid) &&
          !Array.from(friendSuggestions).some((f) => f.uid === user.uid),
      )
      .slice(0, neededSuggestions);

    randomUsers.forEach((user) => friendSuggestions.push(user));
  }

  return friendSuggestions.slice(0, 10);
}
