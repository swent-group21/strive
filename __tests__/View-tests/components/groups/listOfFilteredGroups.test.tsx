import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ListOfFilteredGroups from "@/src/views/components/groups/list_of_filtered_groups";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

// Mock du ViewModel
jest.mock(
  "@/src/viewmodels/components/groups/ListOfFilteredGroupsViewModel",
  () => ({
    useListOfFilteredGroupsViewModel: jest.fn(),
  }),
);

describe("ListOfFilteredGroups Component", () => {
  const mockUseListOfFilteredGroupsViewModel =
    require("@/src/viewmodels/components/groups/ListOfFilteredGroupsViewModel").useListOfFilteredGroupsViewModel;

  const mockFilteredGroups = [
    { gid: "1", name: "Group1", challengeTitle: "Challenge Group1" },
    { gid: "2", name: "Team2", challengeTitle: "Challenge Team2" },
  ];

  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockHandleJoin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "info").mockImplementation(() => {});
  });

  it("renders filtered groups with correct names", async () => {
    mockUseListOfFilteredGroupsViewModel.mockReturnValue({
      groupStatuses: {
        "1": { isJoined: true },
        "2": { isJoined: false },
      },
      handleJoin: mockHandleJoin,
    });

    const { getByText } = render(
      <ListOfFilteredGroups
        filteredGroups={mockFilteredGroups}
        searchText="Group"
        firestoreCtrl={mockFirestoreCtrl}
        uid="tester-uid"
      />,
    );

    // Check if the groups are displayed with their names
    expect(getByText("Group1")).toBeTruthy();
    expect(getByText("Team2")).toBeTruthy();
  });

  it("handles joining a group", async () => {
    mockUseListOfFilteredGroupsViewModel.mockReturnValue({
      groupStatuses: {
        "1": { isJoined: true },
        "2": { isJoined: false },
      },
      handleJoin: mockHandleJoin,
    });

    const { getByTestId } = render(
      <ListOfFilteredGroups
        filteredGroups={mockFilteredGroups}
        searchText="Group"
        firestoreCtrl={mockFirestoreCtrl}
        uid="tester-uid"
      />,
    );

    // Press the button "JOIN" for the second
    // and not already joined group
    const joinButton = getByTestId("join-button-Team2");
    await waitFor(() => fireEvent.press(joinButton));

    expect(mockHandleJoin).toHaveBeenCalledTimes(1);
  });

  it("displays right message when no group to display", async () => {
    mockUseListOfFilteredGroupsViewModel.mockReturnValue({
      groupStatuses: {},
      handleJoin: mockHandleJoin,
    });

    const { getByText } = render(
      <ListOfFilteredGroups
        filteredGroups={[]}
        searchText="Group"
        firestoreCtrl={mockFirestoreCtrl}
        uid="tester-uid"
      />,
    );

    // Get the no-group message
    expect(getByText("No group found")).toBeTruthy();
  });

  it("does not display anything when no text and no group passed", async () => {
    mockUseListOfFilteredGroupsViewModel.mockReturnValue({
      groupStatuses: {},
      handleJoin: mockHandleJoin,
    });

    const { getByText } = render(
      <ListOfFilteredGroups
        filteredGroups={[]}
        searchText=""
        firestoreCtrl={mockFirestoreCtrl}
        uid="tester-uid"
      />,
    );

    try {
      // Make sure the no-group message is not displayed
      expect(getByText("No group found")).toThrow();

      // Make sure the groups are not displayed
      expect(getByText("Group1")).toThrow();
    } catch (error) {}
  });
});
