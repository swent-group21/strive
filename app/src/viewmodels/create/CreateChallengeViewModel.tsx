import { useState, useEffect } from "react";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from "expo-location";
import { createChallenge } from "@/types/ChallengeBuilder";
import FirestoreCtrl, { DBGroup } from "@/src/models/firebase/FirestoreCtrl";

/**
 * View model for the create challenge screen.
 * @param firestoreCtrl : FirestoreCtrl object
 * @param navigation : navigation object
 * @param route : route object
 * @returns : challengeName, setChallengeName, description, setDescription, location, isLocationEnabled, toggleLocation, and makeChallenge
 */
export default function CreateChallengeViewModel({
  firestoreCtrl,
  navigation,
  route,
}: {
  firestoreCtrl: FirestoreCtrl;
  navigation: any;
  route: any;
}): {
  challengeName: string;
  setChallengeName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  location: LocationObject | null;
  isLocationEnabled: boolean;
  toggleLocation: () => void;
  makeChallenge: () => Promise<void>;
} {
  const [challengeName, setChallengeName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);

  const imageId = route.params?.image_id;
  const group_id = route.params?.group_id;
  console.info("group_id in create :", group_id);

  // Toggle location switch
  const toggleLocation = () => setIsLocationEnabled((prev) => !prev);

  // Fetch the current location
  useEffect(() => {
    async function fetchLocation() {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setIsLocationEnabled(false);
        return;
      }
      let currentLocation = await getCurrentPositionAsync();
      setLocation(currentLocation);
    }
    fetchLocation();
  }, []);

  // Create the challenge
  const makeChallenge = async () => {
    try {
      const date = new Date();
      await createChallenge(
        firestoreCtrl,
        challengeName,
        description,
        isLocationEnabled ? location : null,
        group_id,
        date,
        imageId,
      );
      if (group_id == "" || group_id == "home") {
        navigation.navigate("Home");
      } else {
        const group: DBGroup = await firestoreCtrl.getGroup(group_id);
        console.log("group in create challenge: ", group);
        navigation.navigate("GroupScreen", { currentGroup: group });
      }
    } catch (error) {
      console.error("Unable to create challenge", error);
      return error;
    }
  };

  return {
    challengeName,
    setChallengeName,
    description,
    setDescription,
    location,
    isLocationEnabled,
    toggleLocation,
    makeChallenge,
  };
}
