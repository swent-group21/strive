import { useState, useRef, useEffect } from "react";
import {
  CameraType,
  useCameraPermissions,
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView,
} from "expo-camera";
import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { createChallenge } from "@/types/ChallengeBuilder";
import {
  DBGroup,
  DBChallengeDescription,
} from "@/src/models/firebase/TypeFirestoreCtrl";
import {
  getChallengeDescription,
  getGroup,
} from "@/src/models/firebase/GetFirestoreCtrl";
import { uploadImage } from "@/src/models/firebase/SetFirestoreCtrl";

/**
 * ViewModel for the camera screen.
 * @param navigation : navigation object
 * @returns : functions for the camera screen
 */
export default function useCameraViewModel(navigation: any, route: any) {
  // Camera state
  const camera = useRef<CameraView>(null);
  const cameraPictureOptions: CameraPictureOptions = { base64: true };
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [picture, setPicture] = useState<CameraCapturedPicture>();

  const [facing, setFacing] = useState<CameraType>("back");

  const [isFlashEnabled, setIsFlashEnabled] = useState(false);

  // Location state
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);

  // Challenge state
  const [caption, setCaption] = useState("");

  const [descriptionTitle, setDescriptionTitle] =
    useState<DBChallengeDescription>({
      title: "Challenge Title",
      description: "Challenge Description",
      endDate: new Date(2024, 1, 1, 0, 0, 0, 0),
    });

  let group_id = "home";
  let isInHome = true;

  // Go back to the previous screen
  const goBack = () => {
    navigation.navigate("Home");
  };

  // Change the camera state
  const toggleCameraState = () => {
    setIsCameraEnabled((prev) => !prev);
  };

  // Change the camera facing
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Change the flash mode
  const toggleFlashMode = () => {
    setIsFlashEnabled((prev) => !prev);
  };

  // Take a picture with the camera
  const takePicture = async () => {
    if (camera.current) {
      try {
        const capturedPicture =
          await camera.current?.takePictureAsync(cameraPictureOptions);
        setPicture(capturedPicture);
        setIsCameraEnabled(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

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

  // Fetch the description title
  useEffect(() => {
    async function fetchDescriptionTitle() {
      try {
        const currentChallengeData = await getChallengeDescription();

        setDescriptionTitle(currentChallengeData);
      } catch (error) {
        console.error("Error fetching description id");
        return error;
      }
    }

    fetchDescriptionTitle();
  }, []);

  // Create the challenge
  const makeChallenge = async () => {
    try {
      // Check if location is enabled when creating a challenge in a group
      if (group_id != "" && group_id != "home") {
        if (!isLocationEnabled || location == null) {
          alert("You need to enable location to create a challenge in a group");
          navigation.navigate("GroupScreen", { currentGroup: group_id });
          return;
        }

        // Check if the location is within the group's area
        const group: DBGroup = await getGroup(group_id);
        if (!isInGroupArea(location, group)) {
          alert("You need to be in the group's area to create a challenge");
          navigation.navigate("GroupScreen", { currentGroup: group });
          return;
        }
      }

      console.log("Picture URI: ", picture?.uri);
      const imageId = await uploadImage(picture?.uri);
      console.log("image id making challenge: ", imageId);
      await createChallenge(
        caption,
        isLocationEnabled ? location : null,
        group_id,
        descriptionTitle.title ?? "",
        new Date(),
        imageId,
      );
      if (group_id == "" || group_id == "home") {
        navigation.navigate("Home");
      } else {
        const group: DBGroup = await getGroup(group_id);
        navigation.navigate("GroupScreen", { currentGroup: group });
      }
    } catch (error) {
      console.error("Unable to create challenge", error);
      return error;
    }
  };

  return {
    facing,
    permission,
    requestPermission,
    camera,
    picture,
    caption,
    location,
    isCameraEnabled,
    isFlashEnabled,
    isLocationEnabled,
    toggleCameraFacing,
    toggleFlashMode,
    toggleLocation,
    toggleCameraState,
    setCaption,
    takePicture,
    makeChallenge,
    goBack,
    isInHome,
  };
}

/**
 * This function checks if a location is within a group's area.
 *
 * @param location the location object
 * @param group the group object
 * @returns true if the location is within the group's area, false otherwise
 */
function isInGroupArea(location: LocationObject, group: DBGroup) {
  const distance = getDistance(
    location.coords.latitude,
    location.coords.longitude,
    group.location.latitude,
    group.location.longitude,
  );
  console.log("distance: ", distance);
  return distance <= group.radius;
}
/**
 * This function calculates the distance between two points on the earth's surface, given their latitude and longitude.
 * This function was generated by Copilot.
 *
 * @param lat1 the latitude of the first point
 * @param lon1 the longitude of the first point
 * @param lat2 the latitude of the second point
 * @param lon2 the longitude of the second point
 * @returns the distance between the two points in meters
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in m
  return distance;
}

/**
 * This function converts a degree value to a radian value.
 *
 * @param deg the degree value
 * @returns
 */
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
