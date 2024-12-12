import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";
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

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => ({
    getGroup: jest.fn(),
    createChallenge: jest.fn(),
    uploadImageFromUri: jest.fn(async () => "mock-image-id"),
  }));
});
const mockFirestoreCtrl = new FirestoreCtrl();

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
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    await waitFor(() => {
      expect(result.current.facing).toBe("back");
      expect(result.current.isFlashEnabled).toBe(false);
      expect(result.current.isCameraEnabled).toBe(true);
      expect(result.current.picture).toBeUndefined();
      expect(result.current.isLocationEnabled).toBe(true);
      expect(result.current.description).toBe("");
    });
  });

  it("should toggle camera facing", async () => {
    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
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
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
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
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
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
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
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
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    await waitFor(() => {
      expect(result.current.isLocationEnabled).toBe(false);
    });
  });

  it("should create a challenge and navigate home", async () => {
    (createChallenge as jest.Mock).mockResolvedValueOnce(null);
    const mockGroup = { group_id: "mock-group-id" };
    (mockFirestoreCtrl.getGroup as jest.Mock).mockResolvedValue(mockGroup);

    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.makeChallenge();
    });

    expect(mockFirestoreCtrl.uploadImageFromUri).toHaveBeenCalled();
    expect(createChallenge).toHaveBeenCalledWith(
      mockFirestoreCtrl,
      mockRoute.params.group_id,
      "",
      null,
      mockRoute.params.group_id,
      expect.any(Date),
      "mock-image-id",
    );
    expect(mockNavigation.navigate).toHaveBeenCalledWith("GroupScreen", {
      currentGroup: { group_id: "mock-group-id" },
    });
  });

  it("should handle errors during challenge creation", async () => {
    console.error = jest.fn();
    (createChallenge as jest.Mock).mockRejectedValueOnce("mock-error");

    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.makeChallenge();
    });

    expect(createChallenge).toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it("should request camera permissions", async () => {
    const mockRequestPermission = jest.fn();
    (useCameraPermissions as jest.Mock).mockReturnValue([
      null,
      mockRequestPermission,
    ]);

    const { result } = renderHook(() =>
      useCameraViewModel(mockFirestoreCtrl, mockNavigation, mockRoute),
    );

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(mockRequestPermission).toHaveBeenCalled();
  });
});
