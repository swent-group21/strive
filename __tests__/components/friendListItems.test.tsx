import React from "react";
import { render } from "@testing-library/react-native";
import { FriendListItem } from "@/components/friends/FriendListItem";

describe("FriendListItem Component", () => {
  const mockOnPress = jest.fn();

  it("renders with a custom avatar", () => {
    const { getByTestId } = render(
      <FriendListItem
        name="John Doe"
        avatar="https://example.com/avatar.jpg"
        onPress={mockOnPress}
      />,
    );

    const avatarImage = getByTestId("friend-avatar-image");
    expect(avatarImage.props.source.uri).toBe("https://example.com/avatar.jpg");
  });

  it("renders with a default avatar when no avatar is provided", () => {
    const { getByTestId, getByText } = render(
      <FriendListItem name="Jane Smith" avatar={null} onPress={mockOnPress} />,
    );

    const defaultAvatar = getByTestId("friend-default-avatar");
    const initialText = getByText("J");
    expect(defaultAvatar).toBeTruthy();
    expect(initialText).toBeTruthy();
  });

  it("displays the friend's name correctly", () => {
    const { getByText } = render(
      <FriendListItem
        name="Alice Johnson"
        avatar={null}
        onPress={mockOnPress}
      />,
    );

    const friendName = getByText("Alice Johnson");
    expect(friendName).toBeTruthy();
  });
});
