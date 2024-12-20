import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ListOfFilteredGroups from "@/src/views/components/groups/list_of_filtered_groups";
import { DBGroup } from "@/src/models/firebase/TypeFirestoreCtrl";

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

  const mockFilteredGroups: DBGroup[] = [
    {
      gid: "1",
      name: "Group1",
      challengeTitle: "Challenge Group1",
      members: [],
      updateDate: new Date(),
      location: null,
      radius: 0,
    },
    {
      gid: "2",
      name: "Team2",
      challengeTitle: "Challenge Team2",
      members: [],
      updateDate: new Date(),
      location: null,
      radius: 0,
    },
  ];

  const mockHandleJoin = jest.fn();
  const mockNavigation = { navigate: jest.fn() };

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
        uid="tester-uid"
        navigation={mockNavigation}
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
        uid="tester-uid"
        navigation={mockNavigation}
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
        uid="tester-uid"
        navigation={mockNavigation}
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

    const { queryByText } = render(
      <ListOfFilteredGroups
        filteredGroups={[]}
        searchText=""
        uid="tester-uid"
        navigation={mockNavigation}
      />,
    );

    // Make sure the no-group message is not displayed
    expect(queryByText("No group found")).toBeNull();

    // Make sure the groups are not displayed
    expect(queryByText("Group1")).toBeNull();
  });
});
