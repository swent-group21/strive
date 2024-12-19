import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FriendsScreen from "@/src/views/friends/friends_screen";
import { useFriendsScreenViewModel } from "@/src/viewmodels/friends/FriendsScreenViewModel";
import { getAuth } from "firebase/auth";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";

// Mock Firebase Auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

// Mock ViewModel
jest.mock("@/src/viewmodels/friends/FriendsScreenViewModel", () => ({
  useFriendsScreenViewModel: jest.fn(),
}));

// Mock FirestoreCtrl methods
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getFriends: jest.fn(),
      getFriendRequests: jest.fn(),
      isFriend: jest.fn(),
      addFriend: jest.fn(),
      acceptFriend: jest.fn(),
      rejectFriend: jest.fn(),
      isRequested: jest.fn(),
    };
  });
});

const mockFilteredUsers: DBUser[] = [
  {
    uid: "user0",
    name: "User 0",
    email: "user1@example.com",
    createdAt: new Date(),
  },
];

const mockUser: DBUser = {
  uid: "test-user-id",
  name: "Tester",
  email: "tester@test.com",
  createdAt: new Date(),
};

describe("FriendsScreen Tests - Various Scenarios", () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockFirestoreCtrl = new FirestoreCtrl();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders FriendsScreen with no requests and no friends", () => {
    // Mock ViewModel for no requests and no friends
    (useFriendsScreenViewModel as jest.Mock).mockReturnValue({
      searchText: "",
      setSearchText: jest.fn(),
      friends: [],
      requests: [],
      filteredUsers: mockFilteredUsers,
      handleFriendPress: jest.fn(),
    });

    const { getByText } = render(
      <FriendsScreen
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
        user={mockUser}
      />,
    );

    expect(getByText("Your friends")).toBeTruthy();
    expect(getByText("Requests")).toBeTruthy();
    expect(getByText("No friends request for now")).toBeTruthy();
  });

  it("renders FriendsScreen with one friend and no requests", () => {
    // Mock ViewModel for one friend and no requests
    (useFriendsScreenViewModel as jest.Mock).mockReturnValue({
      searchText: "",
      setSearchText: jest.fn(),
      friends: [
        { uid: "friend1", name: "Friend 1", email: "friend1@example.com" },
      ],
      requests: [],
      filteredUsers: mockFilteredUsers,
      handleFriendPress: jest.fn(),
    });

    const { getByText } = render(
      <FriendsScreen
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
        user={mockUser}
      />,
    );

    expect(getByText("Your friends")).toBeTruthy();
    expect(getByText("Friend 1")).toBeTruthy();
    expect(getByText("Requests")).toBeTruthy();
    expect(getByText("No friends request for now")).toBeTruthy();
  });

  it("renders FriendsScreen with all sections and no errors", () => {
    // Mock ViewModel for no requests and no friends
    (useFriendsScreenViewModel as jest.Mock).mockReturnValue({
      searchText: "",
      setSearchText: jest.fn(),
      friends: [],
      requests: [],
      filteredUsers: mockFilteredUsers,
      handleFriendPress: jest.fn(),
    });

    const { getByText } = render(
      <FriendsScreen
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
        user={mockUser}
      />,
    );

    expect(getByText("Strive is better with friends")).toBeTruthy();
    expect(getByText("Your friends")).toBeTruthy();
    expect(getByText("Requests")).toBeTruthy();
    expect(getByText("Suggestions for you")).toBeTruthy();
  });

  it("renders FriendsScreen with suggestions", () => {
    // Mock ViewModel with suggestions
    (useFriendsScreenViewModel as jest.Mock).mockReturnValue({
      searchText: "",
      setSearchText: jest.fn(),
      friends: [],
      requests: [],
      filteredUsers: mockFilteredUsers,
      suggestions: [
        {
          uid: "user1",
          name: "User 1",
          email: "user1@example.com",
          image: null,
          createdAt: new Date(),
        },
        {
          uid: "user2",
          name: "User 2",
          email: "user2@example.com",
          image: null,
          createdAt: new Date(),
        },
      ],
      handleFriendPress: jest.fn(),
    });

    const { getByText } = render(
      <FriendsScreen
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
        user={mockUser}
      />,
    );

    // Vérifie que les suggestions sont affichées
    expect(getByText("Suggestions for you")).toBeTruthy();
    expect(getByText("User 1")).toBeTruthy();
    expect(getByText("User 2")).toBeTruthy();
  });

  it("renders FriendsScreen with no suggestions", () => {
    // Mock ViewModel with no suggestions
    (useFriendsScreenViewModel as jest.Mock).mockReturnValue({
      searchText: "",
      setSearchText: jest.fn(),
      friends: [],
      requests: [],
      filteredUsers: mockFilteredUsers,
      suggestions: [],
      handleFriendPress: jest.fn(),
    });

    const { getByText } = render(
      <FriendsScreen
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
        user={mockUser}
      />,
    );

    expect(getByText("Suggestions for you")).toBeTruthy();
  });
});
