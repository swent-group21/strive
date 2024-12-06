import { limit, documentId, GeoPoint } from "firebase/firestore";
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
};

export type DBComment = {
  comment_text: string;
  user_name: string;
  created_at: Date;
  post_id: string;
};

export type DBGroup = {
  group_id: string;
  group_name: string;
  description?: string;
  members: string[];
  creationDate?: Date;
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

      const q = query(groupsRef, where(documentId(), "in", userData.groups));

      const groupSnapshots = await getDocs(q);

      // Map the results into an array of DBGroup
      const dbGroups: DBGroup[] = groupSnapshots.docs.map(
        (doc) =>
          ({
            group_id: doc.id,
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
}