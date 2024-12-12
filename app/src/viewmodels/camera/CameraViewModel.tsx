import { useState, useRef, useCallback } from "react";
import {
  CameraType,
  useCameraPermissions,
  CameraCapturedPicture,
  CameraPictureOptions,
  FlashMode,
  CameraView,
  PermissionResponse,
} from "expo-camera";
import { Platform } from "react-native";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

/**
 * ViewModel for the camera screen.
 * @param firestoreCtrl : FirestoreCtrl object
 * @param navigation : navigation object
 * @param route : route object
 * @returns : functions for the camera screen
 */
export default function useCameraViewModel(
  firestoreCtrl: FirestoreCtrl,
  navigation: any,
  route: any,
): {
  facing: CameraType;
  permission: PermissionResponse | null;
  requestPermission: () => Promise<PermissionResponse>;
  camera: React.RefObject<CameraView>;
  picture: CameraCapturedPicture | undefined;
  isCameraEnabled: boolean;
  flashMode: FlashMode;
  isFlashEnabled: boolean;
  zoom: number;
  toggleCameraFacing: () => void;
  toggleFlashMode: () => void;
  takePicture: () => Promise<void>;
  imageUrlGen: () => Promise<void>;
  setIsCameraEnabled: React.Dispatch<React.SetStateAction<boolean>>;
} {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [lastZoom] = useState(0);

  const group_id = route.params?.group_id;

  const cameraPictureOptions: CameraPictureOptions = { base64: true };

  // Calculate the zoom level
  const calculateZoom = (event: any, velocity: number, outFactor: number) => {
    const scaleFactor = Platform.OS === "ios" ? 0.01 : 25;
    const reduceFactor = Platform.OS === "ios" ? 0.02 : 50;

    if (velocity > 0) {
      return zoom + event.scale * velocity * scaleFactor;
    } else {
      return (
        zoom -
        event.scale * (outFactor || 1) * Math.abs(velocity) * reduceFactor
      );
    }
  };

  // Change the camera facing
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Change the flash mode
  const toggleFlashMode = () => {
    setFlashMode((current) => (current === "off" ? "on" : "off"));
    setIsFlashEnabled((prev) => !prev);
  };

  // Function not used in the current implementation but can be used to zoom in/out
  useCallback(
    (event: any) => {
      const velocity = event.velocity / 20;
      const outFactor = lastZoom * (Platform.OS === "ios" ? 40 : 15);

      let newZoom = calculateZoom(event, velocity, outFactor);

      if (newZoom < 0) newZoom = 0;
      else if (newZoom > 0.7) newZoom = 0.7;

      setZoom(newZoom);
    },
    [zoom, lastZoom],
  );

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

  // Generate an image URL from the picture taken
  const imageUrlGen = async () => {
    const img_id = await firestoreCtrl.uploadImageFromUri(picture?.uri);
    navigation.navigate("CreateChallenge", {
      image_id: img_id,
      group_id: group_id,
    });
  };

  return {
    facing,
    permission,
    requestPermission,
    camera,
    picture,
    isCameraEnabled,
    flashMode,
    isFlashEnabled,
    zoom,
    toggleCameraFacing,
    toggleFlashMode,
    takePicture,
    imageUrlGen,
    setIsCameraEnabled,
  };
}
