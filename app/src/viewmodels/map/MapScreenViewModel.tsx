import { useEffect, useState } from "react";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import FirestoreCtrl, {
  DBChallenge,
  DBChallengeDescription,
} from "@/src/models/firebase/FirestoreCtrl";
import { GeoPoint } from "firebase/firestore";

/**
 * Default location centered on the city of Nice, France.
 */
const defaultLocation = new GeoPoint(43.6763, 7.0122);

/**
 * View model for the map screen.
 * @param firestoreCtrl : FirestoreCtrl object
 * @param navigation : navigation object
 * @param firstLocation : the user's first location
 * @returns : permission, userLocation, and challengesWithLocation
 */
export function useMapScreenViewModel(
  firestoreCtrl: FirestoreCtrl,
  navigation: any,
  firstLocation: GeoPoint | undefined,
): {
  permission: boolean;
  userLocation: GeoPoint | undefined;
  challengesWithLocation: DBChallenge[];
  navigateGoBack: () => void;
} {
  const [permission, setPermission] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<GeoPoint | undefined>(
    firstLocation,
  );
  const [challengesWithLocation, setChallengesWithLocation] = useState<
    DBChallenge[]
  >([]);

  const navigateGoBack = () => {
    navigation.goBack();
  };

  /**
   * Requests permission to access the user's location and fetches their current location, only if
   * the user's location is not already set.
   */
  useEffect(() => {
    async function getCurrentLocation() {
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
          setPermission(true);
          const location = await getCurrentPositionAsync();
          setUserLocation(
            new GeoPoint(location.coords.latitude, location.coords.longitude),
          );
        } else {
          setPermission(false);
          setUserLocation(defaultLocation);
        }
      } catch (error) {
        console.error("Error getting location permission or location:", error);
        setUserLocation(defaultLocation);
      }
    }
    if (userLocation === undefined) getCurrentLocation();
  }, []);

  // Fetches challenges with valid locations from Firestore.
  useEffect(() => {
    // Fetches the current challenge and its title.
    const fetchCurrentChallenge = async () => {
      try {
        const currentChallengeData =
          await firestoreCtrl.getChallengeDescription();
        return currentChallengeData.title;
      } catch (error) {
        console.error("Error fetching current challenge: ", error);
      }
    };

    // Fetches challenges with valid locations from Firestore.
    const fetchChallenges = async (challengeTitle: string) => {
      try {
        const challengesData =
          await firestoreCtrl.getPostsByChallengeTitle(challengeTitle);
        const filteredChallenges = challengesData.filter(
          (challenge) =>
            challenge.location !== undefined && challenge.location !== null,
        );
        setChallengesWithLocation(filteredChallenges);
      } catch (error) {
        console.error("Error fetching challenges: ", error);
      }
    };

    fetchCurrentChallenge().then((challengeTitle) => {
      fetchChallenges(challengeTitle);
    });
  }, [firestoreCtrl]);

  return {
    permission,
    userLocation,
    challengesWithLocation,
    navigateGoBack,
  };
}
