import useCameraViewModel from "@/src/viewmodels/camera/CameraViewModel";
import { createChallenge } from "@/types/ChallengeBuilder";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useCameraPermissions } from "expo-camera";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";

// Mock `expo-location`
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "undetermined" }),
  getCurrentPositionAsync: jest.fn(),
}));

// Mock `expo-camera`
jest.mock("expo-camera", () => ({
  useCameraPermissions: jest.fn(),
  CameraType: {
    BACK: "back",
    FRONT: "front",
  },
  FlashMode: {
    ON: "on",
    OFF: "off",
  },
}));

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getGroup: jest.fn(),
  createChallenge: jest.fn(),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  uploadImage: jest.fn(async () => "mock-image-id"),
}));

// Mock `createChallenge`
jest.mock("@/types/ChallengeBuilder", () => ({
  createChallenge: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    group_id: "mock-group-id",
  },
};

describe("useCameraViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { status: "granted" },
      jest.fn(),
    ]);
  });

  it("should initialize with default states", async () => {
    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await waitFor(() => {
      expect(result.current.facing).toBe("back");
      expect(result.current.isFlashEnabled).toBe(false);
      expect(result.current.isCameraEnabled).toBe(true);
      expect(result.current.picture).toBeUndefined();
      expect(result.current.isLocationEnabled).toBe(true);
      expect(result.current.caption).toBe("");
    });
  });

  it("should toggle camera facing", async () => {
    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.toggleCameraFacing();
    });

    expect(result.current.facing).toBe("front");

    await act(async () => {
      result.current.toggleCameraFacing();
    });

    expect(result.current.facing).toBe("back");
  });

  it("should toggle flash mode", async () => {
    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.toggleFlashMode();
    });

    expect(result.current.isFlashEnabled).toBe(true);

    await act(async () => {
      await result.current.toggleFlashMode();
    });

    expect(result.current.isFlashEnabled).toBe(false);
  });

  it("should toggle location enabled state", async () => {
    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.toggleLocation();
    });

    expect(result.current.isLocationEnabled).toBe(false);

    await act(() => {
      result.current.toggleLocation();
    });

    expect(result.current.isLocationEnabled).toBe(true);
  });

  it("should fetch location if permissions are granted", async () => {
    (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "granted",
    });
    (getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
      coords: { latitude: 48.8566, longitude: 2.3522 },
    });

    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await waitFor(() => {
      expect(requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(getCurrentPositionAsync).toHaveBeenCalled();
      expect(result.current.location).toEqual({
        coords: { latitude: 48.8566, longitude: 2.3522 },
      });
    });
  });

  it("should disable location if permissions are denied", async () => {
    (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "denied",
    });

    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await waitFor(() => {
      expect(result.current.isLocationEnabled).toBe(false);
    });
  });

  it("should handle errors during challenge creation", async () => {
    console.error = jest.fn();
    (createChallenge as jest.Mock).mockRejectedValueOnce("mock-error");

    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.makeChallenge();
    });

    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it("should request camera permissions", async () => {
    const mockRequestPermission = jest.fn();
    (useCameraPermissions as jest.Mock).mockReturnValue([
      null,
      mockRequestPermission,
    ]);

    const { result } = renderHook(() =>
      useCameraViewModel(mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(mockRequestPermission).toHaveBeenCalled();
  });
});
