import { limit, GeoPoint, updateDoc, arrayUnion } from "firebase/firestore";
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
} from "@/src/models/firebase/Firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

/*
 * The type definition for a user in the Firestore database.
 */
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

/*
 * The type definitions for a challenge in the Firestore database.
 */
export type DBChallenge = {
  challenge_id?: string;
  caption: string;
  uid: string;
  image_id?: string;
  date?: Date;
  likes?: string[]; // User IDs
  location?: GeoPoint | null;
  group_id?: string;
  challenge_description: string;
};

/*
 * The type definitions for a comment in the Firestore database.
 */
export type DBComment = {
  comment_text: string;
  user_name: string;
  created_at: Date;
  post_id: string;
  uid: string;
};

/*
 * The type definitions for a group in the Firestore database.
 */
export type DBGroup = {
  gid?: string;
  name: string;
  challengeTitle: string;
  members: string[];
  updateDate: Date;
  location: GeoPoint;
  radius: number;
};

/*
 * The type definitions for a challenge description in the Firestore database.
 */
export type DBChallengeDescription = {
  title: string;
  description: string;
  endDate: Date;
};

// Unique keys for AsyncStorage
const CHALLENGE_STORAGE_KEY = "@challenges";
const GROUP_STORAGE_KEY = "@groups";
const IMAGE_STORAGE_KEY = "@images";
const COMMENT_STORAGE_KEY = "@comment";

export let uploadTaskScheduled = false;

/*
 * Background checker
 */

export const backgroundTask = async () => {
  while (true) {
    try {
      const networkState = await NetInfo.fetch();
      if (
        networkState.isConnected &&
        networkState.isInternetReachable &&
        uploadTaskScheduled
      ) {
        console.log("Starting scheduled upload task...");
        await scheduleUploadTask();
        uploadTaskScheduled = false; // Reset the flag after task completion
        console.log(
          "Scheduled upload task completed. uploadTaskScheduled set to false.",
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Check every 5 seconds
    } catch (error) {
      console.error("Error in background task:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait even on error to avoid busy loop
    }
  }
};

/*
 * Function to start the uploading task
 */
export const scheduleUploadTask = async () => {
  try {
    // Execute your upload logic here if there is internet connectivity
    console.log("Internet is available. Executing uploads.");
    const firestoreCtrl = new FirestoreCtrl();
    await firestoreCtrl.uploadStoredImages();
    await firestoreCtrl.uploadStoredChallenges();
    await firestoreCtrl.uploadStoredGroups();

    console.log("Background upload task finished successfully");
  } catch (error) {
    console.error("Error in background task:", error);
  }
};

/**
 * The FirestoreCtrl class is used to interact with Firestore.
 */
export default class FirestoreCtrl {
  /**
   * Creates or updates a user document in Firestore.
   * @param userId The UID of the user.
   * @param userData The user data to store or update.
   * @returns A promise that resolves when the user is created or updated.
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

  async getStoredImageUploads(): Promise<any[]> {
    const storedData = await AsyncStorage.getItem(IMAGE_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  async getStoredChallenges(): Promise<DBChallenge[]> {
    const storedData = await AsyncStorage.getItem(CHALLENGE_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  async getStoredGroups(): Promise<DBGroup[]> {
    const storedData = await AsyncStorage.getItem(GROUP_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  async getStoredComments(): Promise<DBComment[]> {
    const storedData = await AsyncStorage.getItem(COMMENT_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  /**
   * Upload an image to Firestore storage.
   * @param imageUri The URI of the image to upload.
   * @returns The ID of the image.
   */
  async uploadImage(imageUri: string, id_picture?: string): Promise<string> {
    try {
      if (!imageUri) {
        throw new Error("No image URI provided.");
      }
      let img_id: string = id_picture;
      if (id_picture === undefined) {
        img_id = (Math.random() + 1).toString(36).substring(2);
        console.log("New id_picture: ", img_id);
      }

      const networkState = await NetInfo.fetch();
      console.log(
        "Network State Image: ",
        networkState.isConnected,
        networkState.isInternetReachable,
      );
      if (networkState.isConnected && networkState.isInternetReachable) {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storageRef = ref(getStorage(), "images/" + img_id);
        await uploadBytes(storageRef, blob);
        console.log("uploaded");
        return img_id;
      }

      console.warn("No internet connection. Skipping image upload.");
      //Store the image locally for background upload
      await this.storeImageLocally(img_id);
      uploadTaskScheduled = true;
      return img_id;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  }

  /**
   * Stores image upload data in AsyncStorage.
   * @param id_picture The id of the image to upload.
   * @returns The download URL of the image.
   */
  async storeImageLocally(id_picture: string): Promise<void> {
    const localUri = `${FileSystem.cacheDirectory}${id_picture}`;
    try {
      const uploadData = { id: id_picture, uri: localUri };
      const storedUploads = (await this.getStoredImageUploads()) || [];
      storedUploads.push(uploadData);
      AsyncStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(storedUploads));
      console.log("Image upload data stored locally:", uploadData);
    } catch (error) {
      console.error("Error storing image upload data:", error);
    }
  }

  /**
   * Uploads all stored images.
   */
  async uploadStoredImages(): Promise<void> {
    const storedUploads = await this.getStoredImageUploads();

    if (storedUploads && storedUploads.length > 0) {
      for (const upload of storedUploads) {
        try {
          //Attempt to upload to firestore
          await this.uploadImage(upload.uri, upload.id);

          // Remove the successfully uploaded image from AsyncStorage
          const updatedUploads = storedUploads.filter(
            (item) => item.id !== upload.id,
          );

          AsyncStorage.setItem(
            IMAGE_STORAGE_KEY,
            JSON.stringify(updatedUploads),
          );
        } catch (error) {
          console.error("Error uploading stored image:", error, upload);
          //If fails to upload because of any reason stop the loop and wait for the next background trigger
          return;
        }
      }
      console.log("Local images uploaded and cleared");
    } else {
      console.log("No stored images to upload.");
    }
  }

  /**
   * Uploads all stored Challenges.
   */
  async uploadStoredChallenges(): Promise<void> {
    const storedChallenges: DBChallenge[] = await this.getStoredChallenges();
    if (storedChallenges && storedChallenges.length > 0) {
      for (const challenge of storedChallenges) {
        try {
          //Attempt to upload to firestore
          await this.newChallenge(challenge);
          console.log("Stored challenge uploaded:", challenge.challenge_id);
          // Remove the successfully uploaded challenge from AsyncStorage
          const updatedChallenges = storedChallenges.filter(
            (item) => item.challenge_id !== challenge.challenge_id,
          );
          AsyncStorage.setItem(
            CHALLENGE_STORAGE_KEY,
            JSON.stringify(updatedChallenges),
          );
        } catch (error) {
          console.error("Error uploading stored challenge:", error, challenge);
          //If fails to upload because of any reason stop the loop and wait for the next background trigger
          return;
        }
      }
      console.log("Local challenges uploaded and cleared");
    } else {
      console.log("No stored challenges to upload.");
    }
  }

  /**
   * Uploads all stored Groups.
   */
  async uploadStoredGroups(): Promise<void> {
    const storedGroups = await this.getStoredGroups();
    if (storedGroups && storedGroups.length > 0) {
      for (const group of storedGroups) {
        try {
          //Attempt to upload to firestore
          await this.newGroup(group);
          console.log("Stored group uploaded:", group.gid);
          // Remove the successfully uploaded group from AsyncStorage
          const updatedGroups = storedGroups.filter(
            (item) => item.gid !== group.gid,
          );
          AsyncStorage.setItem(
            GROUP_STORAGE_KEY,
            JSON.stringify(updatedGroups),
          );
        } catch (error) {
          console.error("Error uploading stored group:", error, group);
          //If fails to upload because of any reason stop the loop and wait for the next background trigger
          return;
        }
      }
      console.log("Local groups uploaded and cleared");
    } else {
      console.log("No stored groups to upload.");
    }
  }

  /**
   * Get the url of an image
   * @param id_picture The id of the image
   * @returns The download URL of the image.
   */
  async getImageUrl(id_picture: string): Promise<string> {
    console.log("getImageUrl id_picture: ", id_picture);
    const storageRef = ref(getStorage(), "images/" + id_picture);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  /**
   * Get the name of a user by their UID.
   * @param id The UID of the user.
   * @returns The name of the user.
   */
  async getName(id: string): Promise<string | undefined> {
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
   * @param id The UID of the user.
   * @param name The name to set.
   * @param setUser The function to set the user.
   * @returns A promise that resolves when the name is set.
   */
  async setName(
    id: string,
    name: string,
    setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
  ): Promise<void> {
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
   * @param id The UID of the user.
   * @returns The ID of the image.
   */
  async getProfilePicture(id: string): Promise<string | undefined> {
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
   * @param id The UID of the user.
   * @param imageUri The URI of the image to set.
   * @param setUser The function to set the user.
   * @returns A promise that resolves when the profile picture is set.
   */
  async setProfilePicture(
    id: string,
    imageUri: string,
    setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
  ): Promise<void> {
    try {
      const user = await this.getUser(id);
      user.image_id = await this.uploadImage(imageUri);
      await this.createUser(id, user);
      setUser(user);
    } catch (error) {
      console.error("Error setting profile picture: ", error);
      throw error;
    }
  }

  /**
   * Create a challenge using the challenge_id and DBChallenge
   * @param challengeData The challenge data to add.
   * @returns A promise that resolves when the challenge is created.
   */
  async newChallenge(challengeData: DBChallenge): Promise<void> {
    try {
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected && networkState.isInternetReachable) {
        console.log(
          "Network State in newChallenge: ",
          networkState.isConnected,
        );
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
        const docRef = await addDoc(
          collection(firestore, "challenges"),
          challengeData,
        );
        console.log("Challenge successfully uploaded to Firestore:", docRef.id);
        return;
      }
      try {
        const storedChallenges = await this.getStoredChallenges();
        storedChallenges.forEach((sChallenge) => {
          if (sChallenge.challenge_id == challengeData.challenge_id) {
            console.log("Challenge already stored.");
            return;
          }
        });

        storedChallenges.push(challengeData);
        await AsyncStorage.setItem(
          CHALLENGE_STORAGE_KEY,
          JSON.stringify(storedChallenges),
        );
        console.log("Challenge stored locally:", challengeData);
        // Schedule background retry
        uploadTaskScheduled = true;
      } catch (storageError) {
        console.error("Error storing challenge locally:", storageError);
      }
    } catch (error) {
      console.error("Error writing challenge document to Firestore:", error);
      throw error;
    }
  }

  /**
   * Create a challenge using the challenge_id and DBChallenge
   * @param challengeId The ID of the challenge to update.
   * @returns A promise that resolves when the challenge is updated.
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
   * @param uid The UID of the user whose groups are to be fetched.
   * @returns A promise that resolves to an array of groups.
   */
  async getGroupsByUserId(uid: string): Promise<DBGroup[]> {
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
   * Create a group in firestore
   * @param groupData The group data to add.
   * @returns A promise that resolves when the group is created.
   */
  async newGroup(groupData: DBGroup): Promise<void> {
    try {
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected && networkState.isInternetReachable) {
        const duplicate_query = query(
          collection(firestore, "groups"),
          where("name", "==", groupData.name),
        );
        const docSnap = await getDocs(duplicate_query);
        if (!docSnap.empty) {
          console.log("Group already exists");
          return;
        }
        const docRef = await addDoc(collection(firestore, "groups"), groupData);
        console.log("Group successfully uploaded to Firestore:", docRef.id);
        return;
      }

      try {
        // 2. Store group data locally for later upload
        const storedGroups: DBGroup[] = await this.getStoredGroups();
        storedGroups.forEach((sGroup) => {
          if (sGroup.gid == groupData.gid) {
            console.log("Group already stored");
            return;
          }
        });

        storedGroups.push(groupData);
        await AsyncStorage.setItem(
          GROUP_STORAGE_KEY,
          JSON.stringify(storedGroups),
        );
        console.log("Group stored locally:", groupData);
        // Schedule background retry if offline
        uploadTaskScheduled = true;
      } catch (storageError) {
        console.error("Error storing group locally:", storageError);
      }
    } catch (error) {
      console.error("Error writing group document to Firestore:", error);
      throw error;
    }
  }

  /**
   * Update a group in firestore with last post date
   * @param gid The ID of the group to update.
   * @param updateTime The time of the last post.
   * @returns A promise that resolves when the group is updated.
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
   * Update a user in firestore with new group
   * @param uid The ID of the user to update.
   * @param group_name The group to add to user's data.
   * @returns A promise that resolves when the group is added to user's info.
   */
  async addGroupToUser(uid: string, group_name: string): Promise<void> {
    try {
      await updateDoc(doc(firestore, "users", uid), {
        groups: arrayUnion(group_name),
      });
    } catch (error) {
      console.error("Error adding group to user's groups: ", error);
      throw error;
    }
  }

  /**
   * Update a group in firetore to add a new member
   * @param gid The ID of the group to update.
   * @param uid The ID of the user to add to the group.
   * @returns A promise that resolves when the user is added to the group.
   */
  async addMemberToGroup(gid: string, uid: string): Promise<void> {
    try {
      await updateDoc(doc(firestore, "groups", gid), {
        members: arrayUnion(uid),
      });
    } catch (error) {
      console.error("Error adding member to group: ", error);
      throw error;
    }
  }

  /**
   * Retrieves the posts of a specific challenge.
   *
   * @param challengeTitle The title of the challenge to get posts for.
   * @returns A promise that resolves to an array of posts.
   */
  async getPostsByChallengeTitle(
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
   * Retrieves all groups from Firestore.
   * @returns A promise that resolves to an array of groups.
   * */
  async getAllGroups(): Promise<DBGroup[]> {
    try {
      const groupsRef = collection(firestore, "groups");
      const querySnapshot = await getDocs(groupsRef);
      const groups = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          gid: doc.id,
          ...data,
        } as DBGroup;
      });

      return groups;
    } catch (error) {
      console.error("Error getting all groups: ", error);
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
        const data = docSnap.data();
        return {
          gid: docSnap.id,
          ...data,
        } as DBGroup;
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
   * @returns A promise that resolves when the comment is added.
   */
  async addComment(commentData: DBComment): Promise<void> {
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
        const storedComments = await this.getStoredComments();
        storedComments.forEach((sComment) => {
          if (sComment.created_at == commentData.created_at) {
            console.log("Comment already stored.");
            return;
          }
        });

        storedComments.push(commentData);
        await AsyncStorage.setItem(
          COMMENT_STORAGE_KEY,
          JSON.stringify(storedComments),
        );
        // Schedule background retry
        uploadTaskScheduled = true;
      } catch (storageError) {
        console.error("Error storing comment locally:", storageError);
      }
    } catch (error) {
      console.error("Error writing comment document to Firestore:", error);
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
   * @returns A promise that resolves to the current challenge description.
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
   * @returns A promise that resolves when the friend is added.
   */
  async addFriend(userId: string, friendId: string): Promise<void> {
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
   * @returns A promise that resolves when the friend request is accepted.
   * */
  async acceptFriend(userId: string, friendId: string): Promise<void> {
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
   * @returns A promise that resolves when the friend request is rejected.
   * */
  async rejectFriend(userId: string, friendId: string): Promise<void> {
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
   * @returns The friends of the user.
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
   * @returns The users that the user has requested to be friends with.
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
   * @returns The friend requests of the user.
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
   * @returns A promise that resolves when the friend is removed.
   */
  async removeFriendRequest(userId: string, friendId: string): Promise<void> {
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
   * @returns if the user is a friend of another user.
   */
  async isFriend(userId: string, friendId: string): Promise<boolean> {
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
  async isRequested(userId: string, friendId: string): Promise<boolean> {
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

  /**
   * Get groups suggestions for a user based on its friends.
   * @param uid The UID of the user.
   * @returns An array of groups suggestions.
   */
  async getGroupSuggestions(uid: string): Promise<DBGroup[]> {
    const allGroups = await this.getAllGroups();
    const userFriends = await this.getFriends(uid);

    const groupsSuggestions = new Set<DBGroup>();

    // get groups of friends
    for (const friend of userFriends) {
      const groupsOfFriend = await this.getGroupsByUserId(friend.uid);
      for (const gof of groupsOfFriend) {
        // if the user is not already in the group and the group is not already suggested
        if (!gof.members.includes(uid)) {
          groupsSuggestions.add(gof);
        }
      }
    }

    // complete with random groups
    const neededSuggestions = 10 - groupsSuggestions.size;
    if (neededSuggestions > 0) {
      const randomGroups = allGroups
        .filter(
          (group) =>
            !group.members.includes(uid) &&
            !Array.from(groupsSuggestions).some((g) => g.gid === group.gid),
        )
        .slice(0, neededSuggestions);

      randomGroups.forEach((user) => groupsSuggestions.add(user));
    }

    return Array.from(groupsSuggestions).slice(0, 10);
  }
}
