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
      challenge_name: challenge.challenge_name,
      description: challenge.description,
      uid: challenge.uid,
      date: challenge.date,
      location: challenge.location,
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
  challenge_name: string,
  description: string,
  location: LocationObject | null,
  group_id: string,
  date?: Date,
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
      challenge_name: challenge_name,
      description: description || "",
      uid: user.uid,
      image_id: image_id,
      likes: likes || [],
      location: locationFirebase,
      group_id: group_id,
    };

    if (image_id) {
      const image_url = await firestoreCtrl.getImageUrl(image_id);
      newChallenge.image_id = image_url;
    }

    if (date) {
      newChallenge.date = date;
    }

    // Save the challenge to Firestore
    await firestoreCtrl.newChallenge(newChallenge);

    const updateTime = new Date();
    if (group_id !== "" && group_id !== "home") {
      await firestoreCtrl.updateGroup(group_id, updateTime);
    }
  } catch (error) {
    console.error("Error creating challenge: ", error);
  }
};
