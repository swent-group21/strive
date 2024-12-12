import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Camera from "@/src/views/camera/CameraContainer";
import useCameraViewModel from "@/src/viewmodels/camera/CameraViewModel";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

// Mock de useCameraViewModel
jest.mock("@/src/viewmodels/camera/CameraViewModel");
jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => [true]),
  isLoaded: jest.fn(() => true),
}));

jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      // FirestoreCtrl mock functions
    };
  });
});

describe("Camera Component UI Tests", () => {
  const mockToggleCameraFacing = jest.fn();
  const mockToggleFlashMode = jest.fn();
  const mockTakePicture = jest.fn();
  const mockSetIsCameraEnabled = jest.fn();
  const mockFirestoreCtrl = new FirestoreCtrl();

  beforeEach(() => {
    // Mock le retour de useCameraViewModel
    (useCameraViewModel as jest.Mock).mockReturnValue({
      facing: "back",
      permission: { granted: true },
      requestPermission: jest.fn(),
      camera: { current: null },
      picture: null,
      isCameraEnabled: true,
      flashMode: "off",
      isFlashEnabled: false,
      zoom: 0,
      toggleCameraFacing: mockToggleCameraFacing,
      toggleFlashMode: mockToggleFlashMode,
      takePicture: mockTakePicture,
      imageUrlGen: jest.fn(),
      setIsCameraEnabled: mockSetIsCameraEnabled,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the CameraView when isCameraEnabled is true", () => {
    const { getByTestId } = render(
      <Camera navigation={{}} firestoreCtrl={mockFirestoreCtrl} route={{}} />,
    );

    const cameraView = getByTestId("camera-view");
    expect(cameraView).toBeTruthy();
  });

  it("renders the flash button and toggles flash mode when pressed", () => {
    const { getByTestId } = render(
      <Camera navigation={{}} firestoreCtrl={mockFirestoreCtrl} route={{}} />,
    );

    const flashButton = getByTestId("Flash-Button");
    fireEvent.press(flashButton);

    expect(mockToggleFlashMode).toHaveBeenCalled();
  });

  it("renders the capture button and triggers takePicture when pressed", () => {
    const { getByTestId } = render(
      <Camera navigation={{}} firestoreCtrl={mockFirestoreCtrl} route={{}} />,
    );

    const captureButton = getByTestId("Camera-Button");
    fireEvent.press(captureButton);

    expect(mockTakePicture).toHaveBeenCalled();
  });

  it("renders the toggle camera button and toggles camera facing when pressed", () => {
    const { getByTestId } = render(
      <Camera navigation={{}} firestoreCtrl={mockFirestoreCtrl} route={{}} />,
    );

    const toggleButton = getByTestId("Switch-Button");
    fireEvent.press(toggleButton);

    expect(mockToggleCameraFacing).toHaveBeenCalled();
  });

  it("does not render CameraView when isCameraEnabled is false", () => {
    // Mock `isCameraEnabled` à false
    (useCameraViewModel as jest.Mock).mockReturnValueOnce({
      facing: "back",
      permission: { granted: true },
      requestPermission: jest.fn(),
      camera: { current: null },
      picture: null,
      isCameraEnabled: false,
      flashMode: "off",
      isFlashEnabled: false,
      zoom: 0,
      toggleCameraFacing: jest.fn(),
      toggleFlashMode: jest.fn(),
      takePicture: jest.fn(),
      imageUrlGen: jest.fn(),
      setIsCameraEnabled: jest.fn(),
    });

    const { queryByTestId } = render(
      <Camera navigation={{}} firestoreCtrl={mockFirestoreCtrl} route={{}} />,
    );

    const cameraView = queryByTestId("camera-view");
    expect(cameraView).toBeNull();
  });

  it("renders the permission request if permission is not granted", () => {
    // Mock `permission.granted` à false
    (useCameraViewModel as jest.Mock).mockReturnValueOnce({
      facing: "back",
      permission: { granted: false },
      requestPermission: jest.fn(),
      camera: { current: null },
      picture: null,
      isCameraEnabled: true,
      flashMode: "off",
      isFlashEnabled: false,
      zoom: 0,
      toggleCameraFacing: jest.fn(),
      toggleFlashMode: jest.fn(),
      takePicture: jest.fn(),
      imageUrlGen: jest.fn(),
      setIsCameraEnabled: jest.fn(),
    });

    const { getByText } = render(
      <Camera navigation={{}} firestoreCtrl={mockFirestoreCtrl} route={{}} />,
    );

    const permissionText = getByText(
      "We need your permission to show the camera",
    );
    expect(permissionText).toBeTruthy();
  });
});
