import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ListOfFriends from "@/components/friends/ListOfFriends";
import { DBUser } from "@/src/models/firebase/FirestoreCtrl";

describe("ListOfFriends", () => {
  const mockFriends: DBUser[] = [
    {
      uid: "1",
      name: "John Doe",
      email: "johndoe@gmail.com",
      createdAt: new Date(),
      image_id: "https://example.com/avatar1.png",
    },
    {
      uid: "2",
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      createdAt: new Date(),
      image_id: null,
    },
  ];

  const mockHandleFriendPress = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a list of friends", () => {
    const { getByText } = render(
      <ListOfFriends
        friends={mockFriends}
        handleFriendPress={mockHandleFriendPress}
      />,
    );

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("Jane Smith")).toBeTruthy();
  });

  it("displays a message if no friends are available", () => {
    const { getByText } = render(
      <ListOfFriends friends={[]} handleFriendPress={mockHandleFriendPress} />,
    );

    expect(getByText("You don't have any friends yet")).toBeTruthy();
  });

  it("handles friend press action", () => {
    const { getByTestId } = render(
      <ListOfFriends
        friends={mockFriends}
        handleFriendPress={mockHandleFriendPress}
      />,
    );

    const friendItem = getByTestId("friend-item-John Doe");
    fireEvent.press(friendItem);

    expect(mockHandleFriendPress).toHaveBeenCalledWith("1");
  });

  it("renders friends horizontally", () => {
    const { getByTestId } = render(
      <ListOfFriends
        friends={mockFriends}
        handleFriendPress={mockHandleFriendPress}
      />,
    );

    const flatList = getByTestId("list-of-friends");
    expect(flatList.props.horizontal).toBe(true);
  });
});
