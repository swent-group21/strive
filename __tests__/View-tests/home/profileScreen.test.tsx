import React from "react";
import { render } from "@testing-library/react-native";
import ProfileScreen from "@/src/views/home/profile_screen";

describe("ProfileScreen UI Tests", () => {
  const mockSetUser = jest.fn();
  const mockNavigation = {};
  const mockUser = {
    uid: "12345",
    name: "Test User",
    image_id: null,
    email: "test@gmail.com",
    createdAt: new Date(),
  };

  it("renders the profile screen container", () => {
    const { getByTestId } = render(
      <ProfileScreen
        user={mockUser}
        setUser={mockSetUser}
        navigation={mockNavigation}
      />,
    );

    const container = getByTestId("profile-screen");
    expect(container).toBeTruthy();
  });

  it("renders the profile image picker", () => {
    const { getByTestId } = render(
      <ProfileScreen
        user={mockUser}
        setUser={mockSetUser}
        navigation={mockNavigation}
      />,
    );

    const imagePicker = getByTestId("image-picker");
    expect(imagePicker).toBeTruthy();
  });

  it("renders the username input", () => {
    const { getByPlaceholderText } = render(
      <ProfileScreen
        user={mockUser}
        setUser={mockSetUser}
        navigation={mockNavigation}
      />,
    );

    const usernameInput = getByPlaceholderText("Enter your name");
    expect(usernameInput).toBeTruthy();
  });

  it("renders the actions container", () => {
    const { getByTestId } = render(
      <ProfileScreen
        user={mockUser}
        setUser={mockSetUser}
        navigation={mockNavigation}
      />,
    );

    const actionsContainer = getByTestId("actions-container");
    expect(actionsContainer).toBeTruthy();
  });

  it("renders the 'Change your email' button", () => {
    const { getByText } = render(
      <ProfileScreen
        user={mockUser}
        setUser={mockSetUser}
        navigation={mockNavigation}
      />,
    );

    const emailButton = getByText("Change your email");
    expect(emailButton).toBeTruthy();
  });

  it("renders the 'Change your password' button", () => {
    const { getByText } = render(
      <ProfileScreen
        user={mockUser}
        setUser={mockSetUser}
        navigation={mockNavigation}
      />,
    );

    const passwordButton = getByText("Change your password");
    expect(passwordButton).toBeTruthy();
  });

  it("renders the 'Log Out' button", () => {
    const { getByText } = render(
      <ProfileScreen
        user={mockUser}
        setUser={mockSetUser}
        navigation={mockNavigation}
      />,
    );

    const logoutButton = getByText("Log Out");
    expect(logoutButton).toBeTruthy();
  });
});
