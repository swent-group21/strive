import FirestoreCtrl, {
  DBChallenge,
  DBUser,
} from "@/src/models/firebase/FirestoreCtrl";
import { GeoPoint } from "firebase/firestore";
import { LocationObject } from "expo-location";

/**
 * Function to build a challenge object from Firestore data
 * @param challengeId : the challenge ID
 * @param firestoreCtrl : FirestoreCtrl object
 * @returns : a challenge object
 */
export const buildChallenge = async (
  challengeId: string,
  firestoreCtrl: FirestoreCtrl,
): Promise<DBChallenge> => {
  try {
    // Fetch the challenge data from Firestore
    const challenge = await firestoreCtrl.getChallenge(challengeId);

    if (!challenge) {
      throw console.error("Error: no challenge found when buildChallenge");
    }
    // Fetch additional required data like user's name
    await firestoreCtrl.getName(challenge.uid);

    const challengeData: DBChallenge = {
      caption: challenge.caption,
      uid: challenge.uid,
      image_id: challenge.image_id,
      likes: challenge.likes,
      date: challenge.date,
      location: challenge.location,
      challenge_description: challenge.challenge_description,
      group_id: challenge.group_id,
    };

    return challengeData;
  } catch (error) {
    console.error("Error building challenge: ", error);
    throw error;
  }
};

/**
 * Used to create a Challenge and store it in Firestore DB
 * @param firestoreCtrl : FirestoreCtrl object
 * @param challenge_name : the name of the challenge
 * @param description : the description of the challenge
 * @param location : the location of the challenge
 * @param date : the date of the challenge
 * @param image_id : the image id of the challenge
 * @param likes : the likes of the challenge
 */
export const createChallenge = async (
  firestoreCtrl: FirestoreCtrl,
  caption: string,
  location: LocationObject | null,
  group_id: string,
  challenge_description: string,
  date: Date,
  image_id?: string,
  likes?: string[],
): Promise<void> => {
  try {
    // Prepare the challenge data for Firestore
    const user: DBUser = await firestoreCtrl.getUser();

    // Convert the location object to a Firestore GeoPoint
    let locationFirebase =
      location === null
        ? null
        : new GeoPoint(location.coords.latitude, location.coords.longitude);

    const newChallenge: DBChallenge = {
      caption: caption || "",
      uid: user.uid,
      image_id: image_id,
      likes: likes || [],
      location: locationFirebase,
      group_id: group_id,
      challenge_description: challenge_description,
      date: date,
    };

    // Save the challenge to Firestore
    await firestoreCtrl.newChallenge(newChallenge);

    if (group_id !== "" && group_id !== "home") {
      const updateTime = new Date();
      await firestoreCtrl.updateGroup(group_id, updateTime);
    }
  } catch (error) {
    console.error("Error creating challenge: ", error);
  }
};
