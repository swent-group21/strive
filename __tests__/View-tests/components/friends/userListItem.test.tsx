import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { UserListItem } from "@/src/views/components/friends/user_list_items";

// Mock des ViewModel
jest.mock("@/src/viewmodels/components/friends/FriendIconViewModel", () => ({
  useFriendIconViewModel: jest.fn(),
}));
jest.mock("@/src/viewmodels/components/friends/UserListItemViewModel", () => ({
  useUserListItemViewModel: jest.fn(),
}));

describe("UserListItem", () => {
  const mockUseFriendIconViewModel =
    require("@/src/viewmodels/components/friends/FriendIconViewModel").useFriendIconViewModel;
  const mockUserListItemViewModel =
    require("@/src/viewmodels/components/friends/UserListItemViewModel").useUserListItemViewModel;

  const mockOnAdd = jest.fn();
  const mockOnCancelRequest = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockUseFriendIconViewModel.mockReturnValue({
      firstLetter: "J",
    });

    mockUserListItemViewModel.mockReturnValue({
      handlePress: mockOnPress,
      status: "ADD",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with the correct texts", () => {
    const { getByText, getByTestId } = render(
      <UserListItem
        name="John Doe"
        avatar={undefined}
        isFriend={false}
        isRequested={false}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    expect(getByText("J")).toBeTruthy();
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByTestId("handle-button-John Doe")).toBeTruthy();
    expect(getByText("ADD")).toBeTruthy();
  });

  it("renders the correct check when user is a friend", () => {
    mockUserListItemViewModel.mockReturnValue({
      handlePress: mockOnPress,
      status: "FRIEND",
    });

    const { getByText } = render(
      <UserListItem
        name="John Doe"
        avatar="https://example.com/avatar.jpg"
        isFriend={true}
        isRequested={false}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    expect(getByText("✓")).toBeTruthy();
  });

  it("renders the correct text when requested status", () => {
    mockUserListItemViewModel.mockReturnValue({
      handlePress: mockOnPress,
      status: "REQUESTED",
    });

    const { getByText, getByTestId } = render(
      <UserListItem
        name="John Doe"
        avatar={undefined}
        isFriend={false}
        isRequested={false}
        onAdd={mockOnAdd}
        onCancelRequest={mockOnCancelRequest}
      />,
    );

    expect(getByText("REQUESTED")).toBeTruthy();
  });
});
