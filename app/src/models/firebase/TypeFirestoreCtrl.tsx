import { GeoPoint } from "firebase/firestore";

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
