import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ListOfFilteredUsers from "@/src/views/components/friends/list_of_filtered_users";

// Mock du ViewModel
jest.mock("@/src/viewmodels/components/friends/ListOfFilteredUsersViewModel", () => ({
  useListOfFilteredUsersViewModel: jest.fn(),
}));

describe("ListOfFilteredUsers Component", () => {
  const mockUseListOfFilteredUsersViewModel =
  require("@/src/viewmodels/components/friends/ListOfFilteredUsersViewModel").useListOfFilteredUsersViewModel;
  
  const mockFilteredUsers = [
    { uid: "1", name: "John Doe", image_id: "https://example.com/avatar1.png" },
    { uid: "2", name: "Jane Smith", image_id: null },
  ];
  const mockFirestoreCtrl = {
    isFriend: jest.fn((uid, friendId) => Promise.resolve(friendId === "1")), // John is a friend
    isRequested: jest.fn(() => Promise.resolve(false)),
    addFriend: jest.fn(() => Promise.resolve()),
    removeFriendRequest: jest.fn(() => Promise.resolve()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "info").mockImplementation(() => {});
  });


  it("renders filtered users with correct statuses", async () => {
    mockUseListOfFilteredUsersViewModel.mockReturnValue({
      userStatuses: {
        "1": { isFriend: true, isRequested: false },
        "2": { isFriend: true, isRequested: false },
      },
      handleAdd: jest.fn(),
      handleRemove: jest.fn(),
    });


    const { getByText } = render(
      <ListOfFilteredUsers
        filteredUsers={mockFilteredUsers}
        searchText="John"
        firestoreCtrl={mockFirestoreCtrl}
        uid="user-uid"
      />,
    );

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("Jane Smith")).toBeTruthy();
  });


  it("handles adding a friend", async () => {
    const mockHandleAdd = jest.fn();
    mockUseListOfFilteredUsersViewModel.mockReturnValue({
      userStatuses: {
        "1": { isFriend: true, isRequested: false },
        "2": { isFriend: true, isRequested: false },
      },
      handleAdd: mockHandleAdd,
      handleRemove: jest.fn(),
    });
    
    const { getByTestId } = render(
      <ListOfFilteredUsers
        filteredUsers={mockFilteredUsers}
        searchText="Jane"
        firestoreCtrl={mockFirestoreCtrl}
        uid="user-uid"
      />,
    );

    const addButton = getByTestId("add-button-Jane Smith");
    fireEvent.press(addButton);

    await waitFor(() =>
      expect(mockHandleAdd).toHaveBeenCalledWith("user-uid", "2"),
    );
  });
});
