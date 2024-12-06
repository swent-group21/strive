import { renderHook, act, waitFor } from "@testing-library/react-native";
import { launchImageLibraryAsync } from "expo-image-picker";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";
import { logOut, resetEmail, resetPassword } from "@/types/Auth";
import { useProfileScreenViewModel } from "@/src/viewmodels/home/ProfileScreenViewModel";

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => ({
    getProfilePicture: jest.fn(),
    setName: jest.fn(),
    setProfilePicture: jest.fn(),
  }));
});
const mockFirestoreCtrl = new FirestoreCtrl();

// Mock `expo-image-picker`
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    All: "All",
  },
}));

// Mock Auth functions
jest.mock("@/types/Auth", () => ({
  logOut: jest.fn(),
  resetEmail: jest.fn(),
  resetPassword: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockSetUser = jest.fn();

const mockUser: DBUser = {
  uid: "12345",
  name: "Test User",
  email: "test@example.com",
  image_id: null,
  createdAt: new Date(),
};

describe("useProfileScreenViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    global.alert = jest.fn(); // Mock alert function
  });

  it("should initialize with user's name and image", async () => {
    (mockFirestoreCtrl.getProfilePicture as jest.Mock).mockResolvedValueOnce(
      "test-image-uri",
    );

    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    await waitFor(() => {
      expect(result.current.name).toBe("Test User");
      expect(result.current.image).toBe("test-image-uri");
    });
  });

  it("should update the image when pickImage is called", async () => {
    (launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "new-image-uri" }],
    });

    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    await act(async () => {
      await result.current.pickImage();
    });

    expect(result.current.image).toBe("new-image-uri");
  });

  it("should not update the image if image picking is canceled", async () => {
    (launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: true,
    });

    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    await act(async () => {
      await result.current.pickImage();
    });

    expect(result.current.image).toBe(null);
  });

  it("should upload the name and profile picture", async () => {
    (mockFirestoreCtrl.setName as jest.Mock).mockResolvedValueOnce(null);
    (mockFirestoreCtrl.setProfilePicture as jest.Mock).mockResolvedValueOnce(
      null,
    );

    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    act(() => {
      result.current.setName("Updated Name");
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(mockFirestoreCtrl.setName).toHaveBeenCalledWith(
      "12345",
      "Updated Name",
      mockSetUser,
    );
    expect(mockFirestoreCtrl.setProfilePicture).not.toHaveBeenCalled();
  });

  it("should display an alert if name is not entered during upload", async () => {
    const alertMock = jest.spyOn(global, "alert").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    act(() => {
      result.current.setName("");
    });

    await act(async () => {
      await result.current.upload();
    });

    expect(alertMock).toHaveBeenCalledWith("Please enter a username.");
    alertMock.mockRestore();
  });

  it("should handle log out", () => {
    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    act(() => {
      result.current.handleLogOut();
    });

    expect(logOut).toHaveBeenCalledWith(mockNavigation);
  });

  it("should handle email reset", () => {
    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    act(() => {
      result.current.handleChangeEmail();
    });

    expect(resetEmail).toHaveBeenCalledWith(mockUser.email);
  });

  it("should handle password reset", () => {
    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    act(() => {
      result.current.handleChangePassword();
    });

    expect(resetPassword).toHaveBeenCalledWith(mockUser.email);
  });

  it("should navigate back when navigateGoBack is called", () => {
    const { result } = renderHook(() =>
      useProfileScreenViewModel(
        mockUser,
        mockSetUser,
        mockFirestoreCtrl,
        mockNavigation,
      ),
    );

    act(() => {
      result.current.navigateGoBack();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});