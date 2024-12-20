import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SignInScreen from "@/src/views/auth/sign_in_screen";
import SignInViewModel from "@/src/viewmodels/auth/SignInViewModel";

jest.mock("@/src/viewmodels/auth/SignInViewModel", () => jest.fn());

describe("SignInScreen Tests", () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock des valeurs retournées par le ViewModel
    (SignInViewModel as jest.Mock).mockReturnValue({
      email: "",
      password: "",
      errorMessage: null,
      handleEmailChange: jest.fn(),
      handlePasswordChange: jest.fn(),
      handleSignIn: jest.fn(),
    });
  });

  it("updates email and password fields", () => {
    const handleEmailChangeMock = jest.fn();
    const handlePasswordChangeMock = jest.fn();

    (SignInViewModel as jest.Mock).mockReturnValue({
      email: "",
      password: "",
      errorMessage: null,
      handleEmailChange: handleEmailChangeMock,
      handlePasswordChange: handlePasswordChangeMock,
      handleSignIn: jest.fn(),
    });

    const { getByTestId } = render(
      <SignInScreen navigation={mockNavigation} setUser={mockSetUser} />,
    );

    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");

    // Simule un changement de texte pour l'email
    fireEvent.changeText(emailInput, "test@example.com");
    expect(handleEmailChangeMock).toHaveBeenCalledWith("test@example.com");

    // Simule un changement de texte pour le mot de passe
    fireEvent.changeText(passwordInput, "password123");
    expect(handlePasswordChangeMock).toHaveBeenCalledWith("password123");
  });

  it("displays an error message", () => {
    (SignInViewModel as jest.Mock).mockReturnValue({
      email: "",
      password: "",
      errorMessage: "Invalid credentials",
      handleEmailChange: jest.fn(),
      handlePasswordChange: jest.fn(),
      handleSignIn: jest.fn(),
    });

    const { getByText } = render(
      <SignInScreen navigation={mockNavigation} setUser={mockSetUser} />,
    );

    // Vérifie la présence du message d'erreur
    const errorMessage = getByText("Invalid credentials");
    expect(errorMessage).toBeTruthy();
  });

  it("calls handleSignIn when sign-in button is pressed", () => {
    const handleSignInMock = jest.fn();

    (SignInViewModel as jest.Mock).mockReturnValue({
      email: "test@example.com",
      password: "password123",
      errorMessage: null,
      handleEmailChange: jest.fn(),
      handlePasswordChange: jest.fn(),
      handleSignIn: handleSignInMock,
    });

    const { getByTestId } = render(
      <SignInScreen navigation={mockNavigation} setUser={mockSetUser} />,
    );

    const signInButton = getByTestId("sign-in-button");

    // Simule un appui sur le bouton de connexion
    fireEvent.press(signInButton);
    expect(handleSignInMock).toHaveBeenCalled();
  });

  it("navigates to ForgotPassword when forgot password button is pressed", () => {
    const { getByText } = render(
      <SignInScreen navigation={mockNavigation} setUser={mockSetUser} />,
    );

    const forgotPasswordButton = getByText("Forgot Password?");

    // Simule un appui sur le bouton mot de passe oublié
    fireEvent.press(forgotPasswordButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("ForgotPassword");
  });

  it("renders loading splash when loading", () => {
    (SignInViewModel as jest.Mock).mockReturnValue({
      email: "",
      password: "",
      errorMessage: null,
      handleEmailChange: jest.fn(),
      handlePasswordChange: jest.fn(),
      handleSignIn: jest.fn(),
      isLoading: true,
    });

    const { getByTestId } = render(
      <SignInScreen navigation={mockNavigation} setUser={mockSetUser} />,
    );

    expect(getByTestId("loading-splash")).toBeTruthy();
  });
});
