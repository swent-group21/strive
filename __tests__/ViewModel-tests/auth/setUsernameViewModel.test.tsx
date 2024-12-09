import { renderHook, act } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import SetUsernameViewModel from "@/src/viewmodels/auth/SetUsernameViewModel";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      setName: jest.fn(),
      setProfilePicture: jest.fn(),
      getChallengeDescription: jest.fn().mockResolvedValueOnce({
        title: "Challenge Title",
        description: "Challenge Description",
        endDate: new Date(2024, 1, 1, 0, 0, 0, 0),
      }),
    };
  });
});
const mockFirestoreCtrl = new FirestoreCtrl();

// Mock ImagePicker
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    All: "All",
  },
}));

describe("SetUsernameViewModel", () => {
  const mockUser: DBUser = {
    uid: "mock-uid",
    email: "test@example.com",
    name: "",
    image_id: "",
    createdAt: new Date(),
  };

  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  it("should update username when handleUsernameChange is called", () => {
    const { result } = renderHook(() =>
      SetUsernameViewModel(mockUser, mockFirestoreCtrl, mockSetUser),
    );

    act(() => {
      result.current.handleUsernameChange("newUsername");
    });

    expect(result.current.username).toBe("newUsername");
  });

  it("should update image when pickImage is called", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      cancelled: false,
      assets: [{ uri: "mock-image-uri" }],
    });

    const { result } = renderHook(() =>
      SetUsernameViewModel(mockUser, mockFirestoreCtrl, mockSetUser),
    );

    await act(async () => {
      await result.current.pickImage();
    });

    expect(result.current.image).toBe("mock-image-uri");
  });

  it("should set errorMessage if image picking fails", async () => {
    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockRejectedValueOnce(
      new Error("ImagePickerError"),
    );

    const { result } = renderHook(() =>
      SetUsernameViewModel(mockUser, mockFirestoreCtrl, mockSetUser),
    );

    await act(async () => {
      await result.current.pickImage();
    });

    expect(result.current.errorMessage).toBe("Failed to pick image.");
  });

  it("should set errorMessage if username is not entered", async () => {
    const { result } = renderHook(() =>
      SetUsernameViewModel(mockUser, mockFirestoreCtrl, mockSetUser),
    );

    await act(async () => {
      await result.current.upload();
    });

    expect(result.current.errorMessage).toBe("Please enter a username.");
  });

  it("should call FirestoreCtrl methods and reset errorMessage on successful upload", async () => {
    (mockFirestoreCtrl.setName as jest.Mock).mockResolvedValueOnce(null);
    (mockFirestoreCtrl.setProfilePicture as jest.Mock).mockResolvedValueOnce(
      null,
    );

    const { result } = renderHook(() =>
      SetUsernameViewModel(mockUser, mockFirestoreCtrl, mockSetUser),
    );

    act(() => {
      result.current.handleUsernameChange("testUsername");
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(mockFirestoreCtrl.setName).toHaveBeenCalledWith(
      "mock-uid",
      "testUsername",
      mockSetUser,
    );
    expect(mockFirestoreCtrl.setProfilePicture).not.toHaveBeenCalled();
    expect(result.current.errorMessage).toBeNull();
  });

  it("should handle errors during upload and set errorMessage", async () => {
    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    (mockFirestoreCtrl.setName as jest.Mock).mockRejectedValueOnce(
      new Error("FirestoreError"),
    );

    const { result } = renderHook(() =>
      SetUsernameViewModel(mockUser, mockFirestoreCtrl, mockSetUser),
    );

    act(() => {
      result.current.handleUsernameChange("testUsername");
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(result.current.errorMessage).toBe(
      "Failed to update profile. Please try again.",
    );
  });
});
