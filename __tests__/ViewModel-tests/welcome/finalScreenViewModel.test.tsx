import { renderHook, act } from "@testing-library/react-native";
import { signInAsGuest } from "@/types/Auth";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";
import WelcomeFinalViewModel from "@/src/viewmodels/welcome/FinalScreenViewModel";

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => ({}));
});
const mockFirestoreCtrl = new FirestoreCtrl();

// Mock Auth functions
jest.mock("@/types/Auth", () => ({
  signInAsGuest: jest.fn(),
}));

describe("WelcomeFinalViewModel", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  it("should navigate to SignIn when navigateToSignIn is called", () => {
    const { result } = renderHook(() =>
      WelcomeFinalViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        setUser: mockSetUser,
      }),
    );

    act(() => {
      result.current.navigateToSignIn();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("SignIn");
  });

  it("should navigate to SignUp when navigateToSignUp is called", () => {
    const { result } = renderHook(() =>
      WelcomeFinalViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        setUser: mockSetUser,
      }),
    );

    act(() => {
      result.current.navigateToSignUp();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("SignUp");
  });

  it("should call signInAsGuest when continueAsGuest is called", async () => {
    const { result } = renderHook(() =>
      WelcomeFinalViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        setUser: mockSetUser,
      }),
    );

    await act(async () => {
      await result.current.continueAsGuest();
    });

    expect(signInAsGuest).toHaveBeenCalledWith(
      mockFirestoreCtrl,
      mockNavigation,
      mockSetUser,
    );
  });

  it("should handle errors in continueAsGuest gracefully", async () => {
    console.error = jest.fn();

    (signInAsGuest as jest.Mock).mockRejectedValueOnce(
      new Error("SignInError"),
    );

    const { result } = renderHook(() =>
      WelcomeFinalViewModel({
        firestoreCtrl: mockFirestoreCtrl,
        navigation: mockNavigation,
        setUser: mockSetUser,
      }),
    );

    await act(async () => {
      await result.current.continueAsGuest();
    });

    expect(alert).toHaveBeenCalledWith("Failed to continue as guest.");
    jest.restoreAllMocks();
  });
});
