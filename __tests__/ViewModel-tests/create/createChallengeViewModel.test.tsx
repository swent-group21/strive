import { renderHook, act, waitFor } from "@testing-library/react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { createChallenge } from "@/types/ChallengeBuilder";
import CreateChallengeViewModel from "@/src/viewmodels/create/CreateChallengeViewModel";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

// Mock `expo-location`
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "undetermined" }),
  getCurrentPositionAsync: jest.fn(),
}));

// Mock `createChallenge`
jest.mock("@/types/ChallengeBuilder", () => ({
  createChallenge: jest.fn(),
}));

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => ({
    // Mock FirestoreCtrl methods
  }));
});
const mockFirestoreCtrl = new FirestoreCtrl();

const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    image_id: "mock-image-id",
    group_id: "home",
  },
};

describe("CreateChallengeViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() =>
      CreateChallengeViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        route: mockRoute,
      }),
    );

    expect(result.current.challengeName).toBe("");
    expect(result.current.description).toBe("");
    expect(result.current.location).toBe(null);
    expect(result.current.isLocationEnabled).toBe(true);
  });

  it("should toggle location enabled state", () => {
    const { result } = renderHook(() =>
      CreateChallengeViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        route: mockRoute,
      }),
    );

    act(() => {
      result.current.toggleLocation();
    });

    expect(result.current.isLocationEnabled).toBe(false);

    act(() => {
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
      CreateChallengeViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        route: mockRoute,
      }),
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
      CreateChallengeViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        route: mockRoute,
      }),
    );

    await waitFor(() => {
      expect(requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(result.current.isLocationEnabled).toBe(false);
      expect(result.current.location).toBe(null);
    });
  });

  it("should create a challenge and navigate home", async () => {
    (createChallenge as jest.Mock).mockResolvedValueOnce(null);

    const { result } = renderHook(() =>
      CreateChallengeViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        route: mockRoute,
      }),
    );

    act(() => {
      result.current.setChallengeName("Test Challenge");
      result.current.setDescription("Test Description");
    });

    await act(async () => {
      await result.current.makeChallenge();
    });

    expect(createChallenge).toHaveBeenCalledWith(
      mockFirestoreCtrl,
      "Test Challenge",
      "Test Description",
      null, // Location is null by default
      "home",
      expect.any(Date),
      "mock-image-id",
    );
    expect(mockNavigation.navigate).toHaveBeenCalledWith("Home");
  });

  it("should handle errors during challenge creation", async () => {
    const errorMock = new Error("CreationError");
    (createChallenge as jest.Mock).mockRejectedValueOnce(errorMock);

    const { result } = renderHook(() =>
      CreateChallengeViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        route: mockRoute,
      }),
    );

    const error = await act(async () => result.current.makeChallenge());
    expect(error).toBe(errorMock);
    expect(console.error).toHaveBeenCalledWith(
      "Unable to create challenge",
      errorMock,
    );
  });
});
