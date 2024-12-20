import { useEffect, useState } from "react";
import { createGroup } from "@/types/GroupBuilder";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { GeoPoint } from "firebase/firestore";

/**
 * View model for the create group screen.
 * @param user : the user object
 * @param navigation : navigation object
 * @returns : groupName, setGroupName, challengeTitle, setChallengeTitle, and makeGroup
 */
export default function CreateGroupViewModel({
  user,
  navigation,
}: {
  user: DBUser;
  navigation: any;
}): {
  groupName: string;
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
  challengeTitle: string;
  setChallengeTitle: React.Dispatch<React.SetStateAction<string>>;
  makeGroup: () => Promise<void>;
  setRadius: (radius: number) => void;
  radius: number;
  MIN_RADIUS: number;
  MAX_RADIUS: number;
  permission: string;
  isLoading: boolean;
} {
  type PermissionStatus = "REFUSED" | "AUTHORIZED" | "WAITING";
  const MIN_RADIUS = 2000;
  const MAX_RADIUS = 50000;
  const [groupName, setGroupName] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");
  const [radius, setRadius] = useState(MIN_RADIUS);
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [permission, setPermission] = useState<PermissionStatus>("WAITING");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the user's location
  useEffect(() => {
    async function getCurrentLocation() {
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await getCurrentPositionAsync();
          const geoPoint = new GeoPoint(
            location.coords.latitude,
            location.coords.longitude,
          );
          setLocation(geoPoint);
          setPermission("AUTHORIZED");
        } else {
          setPermission("REFUSED");
        }
      } catch (error) {
        console.error("Error getting location permission or location:", error);
      }
    }

    getCurrentLocation();
  }, []);

  // Create the challenge
  const makeGroup = async () => {
    setIsLoading(true);
    try {
      const creationDate = new Date();
      const members = [user.uid];

      await createGroup(
        groupName,
        challengeTitle,
        members,
        creationDate,
        location,
        radius,
      );

      navigation.navigate("Home");
    } catch (error) {
      console.error("Unable to create challenge", error);
      setIsLoading(false);
      return error;
    }
    setIsLoading(false);
  };

  return {
    groupName,
    setGroupName,
    challengeTitle,
    setChallengeTitle,
    makeGroup,
    setRadius,
    radius,
    MIN_RADIUS,
    MAX_RADIUS,
    permission,
    isLoading,
  };
}
