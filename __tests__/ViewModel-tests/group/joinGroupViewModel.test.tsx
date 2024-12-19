import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useJoinGroupViewModel } from "@/src/viewmodels/groups/JoinGroupViewModel";
import FirestoreCtrl, { DBGroup } from "@/src/models/firebase/FirestoreCtrl";

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

// Mock FirestoreCtrl and its methods
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAllGroups: jest.fn(() => [mockGroup1, mockGroup2]),
      getGroupSuggestions: jest.fn(() => [mockGroup2]),
    };
  });
});

describe("useJoinGroupViewModel", () => {
  const mockFirestoreCtrl = new FirestoreCtrl();
  const uid = "tester-uid";

  // Before each test, mock the console info and clear all mocks
  beforeEach(() => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  it("modifies the searchText according to searched value", async () => {
    const { result } = renderHook(() =>
      useJoinGroupViewModel(mockFirestoreCtrl, uid),
    );

    await act(() => {
      result.current.setSearchText("Team");
    });

    await waitFor(async () => {
      expect(result.current.searchText).toEqual("Team");
    });
  });

  it("gets all the groups and filter them by name with the searchText", async () => {
    const { result } = renderHook(() =>
      useJoinGroupViewModel(mockFirestoreCtrl, uid),
    );

    // base case with empty searchText
    await waitFor(() => {
      expect(result.current.filteredGroups).toEqual([]);
    });

    await act(() => {
      result.current.setSearchText("Group");
    });

    // Check if the filteredGroups have been filtered from allGroups
    expect(result.current.filteredGroups).toEqual([mockGroup1]);
  });

  it("gets the right suggestions", async () => {
    const { result } = renderHook(() =>
      useJoinGroupViewModel(mockFirestoreCtrl, uid),
    );

    await waitFor(() => {
      expect(result.current.suggestions).toBeDefined();
    });

    // Wait for the promise to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.suggestions).toEqual([mockGroup2]);
    expect(result.current.searchText).toEqual("");
  });

  it("gets all the groups and filter them by challenge with the searchText", async () => {
    const { result } = renderHook(() =>
      useJoinGroupViewModel(mockFirestoreCtrl, uid),
    );

    await waitFor(() => {
      expect(result.current.filteredGroups).toEqual([]);
    });

    await act(() => {
      result.current.setSearchText("Challenge T");
    });

    // Check if the filteredGroups have been filtered from allGroups
    expect(result.current.filteredGroups).toEqual([mockGroup2]);
  });

  it("does not display any group if getAllGroups returns an empty array", async () => {
    jest.spyOn(mockFirestoreCtrl, "getAllGroups").mockReturnValue(
      new Promise<DBGroup[]>((resolve) => {
        [];
      }),
    );

    const { result } = renderHook(() =>
      useJoinGroupViewModel(mockFirestoreCtrl, uid),
    );

    await act(() => {
      result.current.setSearchText("Challenge T");
    });

    // Check if the filteredGroups are still empty
    await waitFor(() => {
      expect(result.current.filteredGroups).toEqual([]);
    });
  });

  it("does not display any group if searchText does not match any group", async () => {
    const { result } = renderHook(() =>
      useJoinGroupViewModel(mockFirestoreCtrl, uid),
    );

    await act(() => {
      result.current.setSearchText("I want to search for this group");
    });

    // Check if the filteredGroups are still empty
    await waitFor(() => {
      expect(result.current.filteredGroups).toEqual([]);
    });
  });
});
