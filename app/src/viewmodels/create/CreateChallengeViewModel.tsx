import { useState, useEffect } from "react";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from "expo-location";
import { createChallenge } from "@/types/ChallengeBuilder";
import FirestoreCtrl, { DBGroup, DBChallengeDescription } from "@/src/models/firebase/FirestoreCtrl";

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
}) {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [caption, setCaption] = useState("");

  const [descriptionTitle, setDescriptionTitle] =
    useState<DBChallengeDescription>({
      title: "Challenge Title",
      description: "Challenge Description",
      endDate: new Date(2024, 1, 1, 0, 0, 0, 0),
    });

  const [postImage, setPostImage] = useState<string>("");

  const group_id = route.params?.group_id;

  // Toggle location switch
  const toggleLocation = () => setIsLocationEnabled((prev) => !prev);

  // Fetch the current location
  useEffect(() => {
    async function fetchLocation() {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        //console.log("Permission to access location denied");
        setIsLocationEnabled(false);
        return;
      }
      let currentLocation = await getCurrentPositionAsync();
      setLocation(currentLocation);
    }
    fetchLocation();
  }, []);

  // Fetch the image URL
  useEffect(() => {
    async function getImage(image_id: string) {
      try {
        const url = await firestoreCtrl.getImageUrl(image_id);
        setPostImage(url);
      } catch (error) {
        console.log("Error fetching image");
        throw error;
      }
    }
    getImage(route.params?.image_id);
  }, []);

  // Fetch the description title
  useEffect(() => {
    async function fetchDescriptionTitle() {
      try {
        const currentChallengeData =
          await firestoreCtrl.getChallengeDescription();

        setDescriptionTitle(currentChallengeData);
        console.log("Description title: ", currentChallengeData.title);
      } catch (error) {
        console.log("Error fetching description id");
        return error;
      }
    }

    fetchDescriptionTitle();
  }, []);

  // Create the challenge
  const makeChallenge = async () => {
    try {
      const date = new Date();
      await createChallenge(
        firestoreCtrl,
        caption,
        isLocationEnabled ? location : null,
        group_id,
        descriptionTitle.title ?? "",
        date,
        postImage,
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
    caption,
    setCaption,
    postImage,
    location,
    isLocationEnabled,
    toggleLocation,
    makeChallenge,
  };
}
