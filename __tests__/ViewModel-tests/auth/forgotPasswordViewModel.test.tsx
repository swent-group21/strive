import { renderHook, act } from "@testing-library/react-native";
import { resetPassword } from "@/types/Auth";
import ForgotPasswordViewModel from "@/src/viewmodels/auth/ForgotPasswordViewModel";

// Mock the `resetPassword` function
jest.mock("@/types/Auth", () => ({
  resetPassword: jest.fn(),
}));

describe("ForgotPasswordViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    global.alert = jest.fn(); // Mock alert function
  });

  it("should update email when handleEmailChange is called", () => {
    const { result } = renderHook(() => ForgotPasswordViewModel());

    act(() => {
      result.current.handleEmailChange("test@example.com");
    });

    expect(result.current.email).toBe("test@example.com");
  });

  it("should set errorMessage when email is empty and handleResetPassword is called", async () => {
    const { result } = renderHook(() => ForgotPasswordViewModel());

    await act(async () => {
      await result.current.handleResetPassword();
    });

    expect(result.current.errorMessage).toBe("Please enter a valid email.");
  });

  it("should call resetPassword and show success alert on valid email", async () => {
    // Mock the `alert` function and error console
    jest.spyOn(global, "alert").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    (resetPassword as jest.Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => ForgotPasswordViewModel());

    act(() => {
      result.current.handleEmailChange("test@example.com");
    });

    await act(async () => {
      await result.current.handleResetPassword();
    });

    expect(resetPassword).toHaveBeenCalledWith("test@example.com");
    expect(window.alert).toHaveBeenCalledWith(
      "A reset password link has been sent to your email.",
    );

    (window.alert as jest.Mock).mockRestore();
  });

  it("should handle errors during resetPassword and set errorMessage", async () => {
    (resetPassword as jest.Mock).mockRejectedValueOnce(new Error("ResetError"));

    const { result } = renderHook(() => ForgotPasswordViewModel());

    act(() => {
      result.current.handleEmailChange("test@example.com");
    });

    await act(async () => {
      await result.current.handleResetPassword();
    });

    expect(result.current.errorMessage).toBe(
      "Failed to reset password. Please try again.",
    );
    expect(resetPassword).toHaveBeenCalledWith("test@example.com");
  });
});
