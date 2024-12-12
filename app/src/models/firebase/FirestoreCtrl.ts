import { limit, GeoPoint } from "firebase/firestore";
import {
  firestore,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  auth,
  collection,
  query,
  where,
} from "./Firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type DBUser = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image_id?: string;
  createdAt: Date;
  groups?: string[];
  friends?: string[];
  userRequestedFriends?: string[];
  friendsRequestedUser?: string[];
};

export type DBChallenge = {
  challenge_id?: string; // Add this line
  challenge_name: string;
  description?: string;
  uid: string;
  image_id?: string;
  date?: Date;
  likes?: string[]; // User IDs
  location?: GeoPoint | null;
  group_id?: string;
};

export type DBComment = {
  comment_text: string;
  user_name: string;
  created_at: Date;
  post_id: string;
  uid: string;
};

export type DBGroup = {
  gid?: string;
  name: string;
  challengeTitle: string;
  members: string[];
  updateDate: Date;
};
export type DBChallengeDescription = {
  title: string;
  description: string;
  endDate: Date;
};

export default class FirestoreCtrl {
  /**
   * Creates or updates a user document in Firestore.
   * @param userId The UID of the user.
   * @param userData The user data to store or update.
   */
  async createUser(userId: string, userData: DBUser): Promise<void> {
    try {
      userData.uid = userId;
      await setDoc(doc(firestore, "users", userId), userData);
    } catch (error) {
      console.error("Error writing user document: ", error);
    }
  }

  /**
   * Retrieves a user document from Firestore by UID.
   * If no userId is provided, it checks for `auth.currentUser`.
   * If there's no `auth.currentUser`, it uses the anonymous user account with a specific ID.
   * @param userId The UID of the user to retrieve.
   * @returns A promise that resolves to the user data or null if not found.
   */
  async getUser(userId?: string): Promise<DBUser> {
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
        throw new Error("User not found.");
      }
    } catch (error) {
      console.error("Error getting user: ", error);
      throw error;
    }
  }

  /**
   * Upload an image to Firestore storage.
   */
  async uploadImageFromUri(imageUri: string) {
    try {
      if (!imageUri) {
        throw new Error("No image URI provided.");
      }

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const id_picture = (Math.random() + 1).toString(36).substring(2);
      const storageRef = ref(getStorage(), "images/" + id_picture);

      await uploadBytes(storageRef, blob);

      return id_picture;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  }

  /**
   * Upload an image url to Firestore storage.
   */
  async uploadImageFromUrl(imageUri: string) {
    try {
      if (!imageUri) {
        throw new Error("No image URI provided.");
      }

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const id_picture = (Math.random() + 1).toString(36).substring(2);
      const storageRef = ref(getStorage(), "images/" + id_picture);

      await uploadBytes(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  }

  /**
   * Get the url of an image
   */
  async getImageUrl(id_picture: string) {
    const storageRef = ref(getStorage(), "images/" + id_picture);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  /**
   * Get the name of a user by their UID.
   */
  async getName(id: string) {
    try {
      const user = await this.getUser(id);
      return user?.name;
    } catch (error) {
      console.error("Error getting name: ", error);
      throw error;
    }
  }

  /**
   * Set the name of a user by their UID.
   */
  async setName(
    id: string,
    name: string,
    setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
  ) {
    try {
      const user = await this.getUser(id);
      user.name = name;
      await this.createUser(id, user);
      console.log("User: ", user);
      setUser(user);
    } catch (error) {
      console.error("Error setting name: ", error);
      throw error;
    }
  }

  /**
   * Get the profile picture of a user by their UID.
   */
  async getProfilePicture(id: string) {
    try {
      const user = await this.getUser(id);
      return user?.image_id;
    } catch (error) {
      console.error("Error getting profile picture: ", error);
      throw error;
    }
  }

  /**
   * Set the profile picture of a user by their UID.
   */

  async setProfilePicture(
    id: string,
    imageUri: string,
    setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
  ) {
    try {
      const user = await this.getUser(id);
      user.image_id = await this.uploadImageFromUrl(imageUri);
      await this.createUser(id, user);
      setUser(user);
    } catch (error) {
      console.error("Error setting profile picture: ", error);
      throw error;
    }
  }

  /**
   * Create a challenge using the challenge_id and DBChallenge
   */
  async newChallenge(challengeData: DBChallenge): Promise<void> {
    try {
      const docRef = await addDoc(
        collection(firestore, "challenges"),
        challengeData,
      );
      console.log("Challenge id: ", docRef.id);
    } catch (error) {
      console.error("Error writting challenge document: ", error);
      throw error;
    }
  }

  /**
   * Create a challenge using the challenge_id and DBChallenge
   */
  async getChallenge(challengeId: string): Promise<DBChallenge> {
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
  async getChallengesByUserId(uid: string): Promise<DBChallenge[]> {
    try {
      const challengesRef = collection(firestore, "challenges");
      const q = query(challengesRef, where("uid", "==", uid));

      const querySnapshot = await getDocs(q);
      const challenges = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Challenge data retrieved:", data);
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
   *
   * @param k The number of challenges to retrieve.
   * @returns A promise that resolves to an array of challenges.
   */
  async getKChallenges(k: number): Promise<DBChallenge[]> {
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
      console.log("Challenges retrieved:", challenges);
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
  async getCommentsOf(challengeId: string): Promise<DBComment[]> {
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
   *
   * @param uid The UID of the user whose groups are to be fetched.
   * @returns A promise that resolves to an array of groups.
   */
  async getGroupsByUserId(uid: string): Promise<DBGroup[]> {
    try {
      const userRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userRef);

      const userData = userDoc.data() as DBUser;

      console.log("userGroups [" + uid + "]", userData.groups);
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
   *
   * @param uid The UID of the group whose members are to be fetched.
   * @returns A promise that resolves to an array of groups.
   */
  async getUsersInGroup(gid: string): Promise<DBUser[]> {
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
  async getAllPostsOfGroup(groupId: string): Promise<DBChallenge[]> {
    try {
      const postsRef = collection(firestore, "challenges");
      const q = query(postsRef, where("group_id", "==", groupId));
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          challenge_id: doc.id,
        } as DBChallenge;
      });
      return posts;
    } catch (error) {
      console.error("Error getting posts: ", error);
      throw error;
    }
  }

  /**
   * Create a group in firestore
   * @param groupData The group data to add.
   */
  async newGroup(groupData: DBGroup): Promise<void> {
    try {
      const docRef = await addDoc(collection(firestore, "groups"), groupData);
      console.log("Challenge id: ", docRef.id);
    } catch (error) {
      console.error("Error writting challenge document: ", error);
      throw error;
    }
  }

  /**
   * Update a group in firestore with last post date
   * @param gid The ID of the group to update.
   * @param updateTime The time of the last post.
   */
  async updateGroup(gid: string, updateTime: Date): Promise<void> {
    try {
      const groupRef = doc(firestore, "groups", gid);
      const docSnap = await getDoc(groupRef);
      const groupData = docSnap.data() as DBGroup;

      groupData.updateDate = updateTime;
      groupData.gid = gid;

      await setDoc(doc(firestore, "groups", gid), groupData);
    } catch (error) {
      console.error("Error updating group: ", error);
      throw error;
    }
  }

  /**
   * Update a group in firestore with last post date
   * @param gid The ID of the group to update.
   * @param updateTime The time of the last post.
   */
  async addGroupToMemberGroups(uid: string, group_name: string): Promise<void> {
    try {
      const user = await this.getUser(uid);
      user.groups?.push(group_name);
      await this.createUser(uid, user);
    } catch (error) {
      console.error("Error setting name: ", error);
      throw error;
    }
  }

  /**
   * Get a group from firestore
   * @param gid The ID of the group to get.
   * @returns A promise that resolves to the group data.
   */
  async getGroup(gid: string): Promise<DBGroup> {
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
   * Add a new comment to a challenge.
   * @param commentData The comment data to add.
   */
  async addComment(commentData: DBComment): Promise<void> {
    try {
      await addDoc(collection(firestore, "comments"), commentData);
    } catch (error) {
      console.error("Error writing comment document: ", error);
      throw error;
    }
  }

  /**
   * Updates the likes of a challenge.
   * @param challengeId The ID of the challenge to update likes for.
   * @param likes The new list of likes to set.
   * @returns A promise that resolves when the likes are updated.
   */
  async updateLikesOf(challengeId: string, likes: string[]): Promise<void> {
    try {
      const challengeRef = doc(firestore, "challenges", challengeId);
      await setDoc(challengeRef, { likes }, { merge: true });
    } catch (error) {
      console.error("Error updating likes: ", error);
      throw error;
    }
  }

  /**
   * Retrieves the likes of a challenge.
   * @param challengeId The ID of the challenge to get likes for.
   * @returns A promise that resolves to an array of user IDs.
   */
  async getLikesOf(challengeId: string): Promise<string[]> {
    try {
      const challenge = await this.getChallenge(challengeId);
      return challenge.likes || [];
    } catch (error) {
      console.error("Error getting likes: ", error);
      throw error;
    }
  }

  /**
   * Retrieves the current challenge description from Firestore
   */
  async getChallengeDescription(): Promise<DBChallengeDescription> {
    try {
      const challengeDescrpitionRef = collection(
        firestore,
        "challenge_description",
      );
      const q = query(challengeDescrpitionRef);
      const querySnapshot = await getDocs(q);
      const challengeDescription = querySnapshot.docs.map((doc) => {
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

  async getAllUsers(): Promise<DBUser[]> {
    try {
      const usersRef = collection(firestore, "users");
      const querySnapshot = await getDocs(usersRef);
      const users = querySnapshot.docs.map((doc) => {
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
   * Add a friend to the user's friend list.
   * @param userId The UID of the user.
   * @param friendId The UID of the friend to add.
   */

  async addFriend(userId: string, friendId: string) {
    try {
      const user = await this.getUser(userId);
      const friend = await this.getUser(friendId);

      user.userRequestedFriends = user.userRequestedFriends || [];
      friend.friendsRequestedUser = friend.friendsRequestedUser || [];

      if (user.friends?.includes(friendId)) {
        return;
      }

      user.userRequestedFriends?.push(friendId);
      friend.friendsRequestedUser?.push(userId);

      await this.createUser(userId, user);
      await this.createUser(friendId, friend);
    } catch (error) {
      console.error("Error adding friend: ", error);
      throw error;
    }
  }

  /**
   * Accept a friend request.
   * @param userId The UID of the user.
   * @param friendId The UID of the friend to accept.
   * */
  async acceptFriend(userId: string, friendId: string) {
    try {
      const user = await this.getUser(userId);
      const friend = await this.getUser(friendId);

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

      await this.createUser(userId, user);
      await this.createUser(friendId, friend);
    } catch (error) {
      console.error("Error accepting friend: ", error);
    }
  }

  /**
   * Reject a friend request.
   * @param userId The UID of the user.
   * @param friendId The UID of the user to reject.
   * */

  async rejectFriend(userId: string, friendId: string) {
    try {
      const user = await this.getUser(userId);
      const friend = await this.getUser(friendId);

      user.userRequestedFriends = user.userRequestedFriends || [];
      friend.friendsRequestedUser = friend.friendsRequestedUser || [];

      user.friendsRequestedUser = user.friendsRequestedUser?.filter(
        (id) => id !== friendId,
      );
      friend.userRequestedFriends = friend.userRequestedFriends?.filter(
        (id) => id !== userId,
      );

      await this.createUser(userId, user);
      await this.createUser(friendId, friend);
    } catch (error) {
      console.error("Error rejecting friend: ", error);
      throw error;
    }
  }

  /**
   *Retrieve the friends of a user.
   * @param userId The UID of the user.
   */
  async getFriends(userId: string): Promise<DBUser[]> {
    try {
      const user = await this.getUser(userId);
      const friends = await Promise.all(
        user.friends?.map(async (id) => await this.getUser(id)) || [],
      );
      return friends;
    } catch (error) {
      console.error("Error getting friends: ", error);
      throw error;
    }
  }

  /**
   *Retrieve the users that the user has requested to be friends with.
   * @param userId The UID of the user.
   */
  async getRequestedFriends(userId: string): Promise<DBUser[]> {
    try {
      const user = await this.getUser(userId);
      const friends = await Promise.all(
        user.userRequestedFriends?.map(async (id) => await this.getUser(id)) ||
          [],
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
   */
  async getFriendRequests(userId: string): Promise<DBUser[]> {
    try {
      const user = await this.getUser(userId);
      const friends = await Promise.all(
        user.friendsRequestedUser?.map(async (id) => await this.getUser(id)) ||
          [],
      );
      return friends;
    } catch (error) {
      console.error("Error getting friends requested user: ", error);
      throw error;
    }
  }

  /**
   * Remove a friend from the user's friend list.
   * @param userId The UID of the user.
   * @param friendId The UID of the friend to remove.
   */
  async removeFriendRequest(userId: string, friendId: string) {
    try {
      const user = await this.getUser(userId);
      const friend = await this.getUser(friendId);

      user.friendsRequestedUser = user.friendsRequestedUser || [];
      friend.userRequestedFriends = friend.userRequestedFriends || [];

      user.userRequestedFriends = user.userRequestedFriends?.filter(
        (id) => id !== friendId,
      );
      friend.friendsRequestedUser = friend.friendsRequestedUser?.filter(
        (id) => id !== userId,
      );

      await this.createUser(userId, user);
      await this.createUser(friendId, friend);
    } catch (error) {
      console.error("Error unadding friend: ", error);
      throw error;
    }
  }

  /**
   * Check if a user is a friend of another user.
   * @param userId The UID of the user.
   * @param friendId The UID of the friend to check.
   * @returns
   */
  async isFriend(userId: string, friendId: string) {
    try {
      const user = await this.getUser(userId);
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
  async isRequested(userId: string, friendId: string) {
    try {
      const user = await this.getUser(userId);
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
  async getFriendSuggestions(uid: string): Promise<DBUser[]> {
    const allUsers = await this.getAllUsers();
    const userFriends = await this.getFriends(uid);

    const friendSuggestions = new Set<DBUser>();

    // get friends of friends
    for (const friend of userFriends) {
      const friendsOfFriend = await this.getFriends(friend.uid);
      for (const fof of friendsOfFriend) {
        if (fof.uid !== uid && !userFriends.some((f) => f.uid === fof.uid)) {
          friendSuggestions.add(fof);
        }
      }
    }

    // complete with random users
    const neededSuggestions = 10 - friendSuggestions.size;
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

      randomUsers.forEach((user) => friendSuggestions.add(user));
    }

    return Array.from(friendSuggestions).slice(0, 10);
  }
}
