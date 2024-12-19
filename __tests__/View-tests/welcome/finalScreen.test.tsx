import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WelcomeFinalScreen from "@/src/views/welcome/final_screen";

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getUser: jest.fn().mockResolvedValue({
    uid: "user123",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date(),
  }),
}));

describe("WelcomeFinalScreen UI Tests", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockSetUser = jest.fn();

  it("renders the main container", () => {
    const { getByTestId } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const screen = getByTestId("welcome-final-screen");
    expect(screen).toBeTruthy();
  });

  it("renders the background shapes", () => {
    const { getByTestId } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const shapeOne = getByTestId("background-image-1");
    const shapeTwo = getByTestId("background-image-2");

    expect(shapeOne).toBeTruthy();
    expect(shapeTwo).toBeTruthy();
  });

  it("renders the title 'Ready to Strive?'", () => {
    const { getByText } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const title = getByText("Ready to\nStrive?");
    expect(title).toBeTruthy();
  });

  it("renders the 'Sign In' button", () => {
    const { getByText } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const signInButton = getByText("Sign In");
    expect(signInButton).toBeTruthy();
  });

  it("renders the 'Sign Up' button", () => {
    const { getByText } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const signUpButton = getByText("Sign Up");
    expect(signUpButton).toBeTruthy();
  });

  it("renders the 'Continue as guest' button", () => {
    const { getByText } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const guestButton = getByText("Continue as guest");
    expect(guestButton).toBeTruthy();
  });

  it("triggers navigation when 'Sign In' button is pressed", () => {
    const { getByText } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const signInButton = getByText("Sign In");
    fireEvent.press(signInButton);

    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it("triggers navigation when 'Sign Up' button is pressed", () => {
    const { getByText } = render(
      <WelcomeFinalScreen setUser={mockSetUser} navigation={mockNavigation} />,
    );

    const signUpButton = getByText("Sign Up");
    fireEvent.press(signUpButton);

    expect(mockNavigation.navigate).toHaveBeenCalled();
  });
});
