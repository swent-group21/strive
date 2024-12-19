import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import FirestoreCtrl, {
  DBUser,
  DBGroup,
} from "@/src/models/firebase/FirestoreCtrl";
import JoinGroupScreen from "@/src/views/groups/join_group_screen";

// Mock ViewModel
jest.mock("@/src/viewmodels/groups/JoinGroupViewModel", () => ({
  useJoinGroupViewModel: jest.fn(),
}));

// Mock groups
const mockGroup1: DBGroup = {
  gid: "1",
  name: "Group1",
  challengeTitle: "Challenge Group1",
  members: ["user1", "user2"],
  updateDate: new Date(),
  location: null,
  radius: 0,
};
const mockGroup2: DBGroup = {
  gid: "2",
  name: "Team2",
  challengeTitle: "Challenge Team2",
  members: [],
  updateDate: new Date(),
  location: null,
  radius: 0,
};

const mockUser: DBUser = {
  uid: "tester-uid",
  name: "Tester",
  email: "",
  createdAt: new Date(),
};

describe("JoinGroupScreen Tests", () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockSetSearchText = jest.fn();

  const mockUseJoinGroupViewModel =
    require("@/src/viewmodels/groups/JoinGroupViewModel").useJoinGroupViewModel;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock ViewModel for each test suite
    mockUseJoinGroupViewModel.mockReturnValue({
      searchText: "",
      setSearchText: mockSetSearchText,
      filteredGroups: [mockGroup1],
      suggestions: [mockGroup2],
    });
  });

  it("renders JoinGroup basic elements with no group", () => {
    mockUseJoinGroupViewModel.mockReturnValue({
      searchText: "",
      setSearchText: mockSetSearchText,
      filteredGroups: [],
      suggestions: [],
    });

    const { getByTestId, getByText } = render(
      <JoinGroupScreen
        user={mockUser}
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    // Title of the screen
    expect(getByText("Join your friends in a group !")).toBeTruthy();

    expect(getByTestId("search-bar")).toBeTruthy();

    // Middle part of the screen
    expect(getByText("Create a new group")).toBeTruthy();
    expect(getByTestId("create-group-button")).toBeTruthy();

    // Suggestions part
    expect(getByText("Group suggestions for you")).toBeTruthy();
  });

  it("renders the right groups in search results and suggestions", () => {
    const { getByTestId } = render(
      <JoinGroupScreen
        user={mockUser}
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    expect(getByTestId("group-list-item-Group1")).toBeTruthy();
    expect(getByTestId("group-list-item-Team2")).toBeTruthy();
  });

  it("calls the right navigation values", async () => {
    const { getByTestId } = render(
      <JoinGroupScreen
        user={mockUser}
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    // Press the button "Create a new group"
    const createGroupButton = getByTestId("create-group-button");
    await waitFor(() => fireEvent.press(createGroupButton));

    expect(mockNavigation.navigate).toHaveBeenCalledWith("CreateGroup");
  });

  it("modifies the searchText when writing in search bar", async () => {
    const { getByPlaceholderText } = render(
      <JoinGroupScreen
        user={mockUser}
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    // Write in the search bar
    const searchBarInput = getByPlaceholderText("Search for a group...");
    await waitFor(() => fireEvent.changeText(searchBarInput, "John"));

    expect(mockSetSearchText).toHaveBeenCalledWith("John");
  });
});
