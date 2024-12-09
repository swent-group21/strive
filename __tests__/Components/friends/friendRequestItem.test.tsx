import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FriendRequestItem } from "@/components/friends/FriendRequestItem";

describe("FriendRequestItem", () => {
  const mockOnAccept = jest.fn();
  const mockOnDecline = jest.fn();

  const defaultProps = {
    name: "John Doe",
    avatar: "https://example.com/avatar.jpg",
    onAccept: mockOnAccept,
    onDecline: mockOnDecline,
    testID: "test-id",
  };

  it("renders the component with an avatar", () => {
    const { getByTestId } = render(<FriendRequestItem {...defaultProps} />);

    expect(getByTestId("friend-avatar-test-id")).toBeTruthy();
    expect(getByTestId("friend-avatar-test-id").props.source.uri).toBe(
      "https://example.com/avatar.jpg",
    );
    expect(getByTestId("friend-name-test-id").props.children).toBe("John Doe");
  });

  it("renders a default avatar when no avatar is provided", () => {
    const { getByTestId } = render(
      <FriendRequestItem {...defaultProps} avatar={null} />,
    );

    expect(getByTestId("friend-avatar-text-test-id").props.children).toBe("J");
  });

  it("calls onAccept when the accept button is pressed", () => {
    const { getByTestId } = render(<FriendRequestItem {...defaultProps} />);

    const acceptButton = getByTestId("accept-button-test-id");
    fireEvent.press(acceptButton);

    expect(mockOnAccept).toHaveBeenCalled();
  });

  it("calls onDecline when the decline button is pressed", () => {
    const { getByTestId } = render(<FriendRequestItem {...defaultProps} />);

    const declineButton = getByTestId("decline-button-test-id");
    fireEvent.press(declineButton);

    expect(mockOnDecline).toHaveBeenCalled();
  });
});
