import { DBChallenge, DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import { GeoPoint } from "@/src/models/firebase/Firebase";
import { LocationObject } from "expo-location";
import { getImageUrl, getUser } from "@/src/models/firebase/GetFirestoreCtrl";
import {
  newChallenge,
  updateGroup,
} from "@/src/models/firebase/SetFirestoreCtrl";

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
    const user: DBUser = await getUser();

    // Convert the location object to a Firestore GeoPoint
    let locationFirebase =
      location === null
        ? null
        : new GeoPoint(location.coords.latitude, location.coords.longitude);

    const challengeData: DBChallenge = {
      caption: caption || "",
      uid: user.uid,
      image_id: image_id,
      likes: likes || [],
      location: locationFirebase,
      group_id: group_id,
      challenge_description: challenge_description,
      date: date,
    };

    //if (image_id) {
    //  const image_url = await getImageUrl(image_id);
    //  console.log("createChallenge image_url: ", image_url);
    //  challengeData.image_id = image_url;
    //}

    // Save the challenge to Firestore
    await newChallenge(challengeData);

    if (group_id !== "" && group_id !== "home") {
      const updateTime = new Date();
      await updateGroup(group_id, updateTime);
    }
  } catch (error) {
    console.error("Error creating challenge: ", error);
  }
};
