import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  renderHook,
  act,
} from "@testing-library/react-native";
import { useListOfFilteredGroupsViewModel } from "@/src/viewmodels/components/groups/ListOfFilteredGroupsViewModel";
import FirestoreCtrl, {
  DBUser,
  DBGroup,
} from "@/src/models/firebase/FirestoreCtrl";

// Mocked data
const mockUser: DBUser = {
  uid: "tester-uid",
  name: "John Doe",
  image_id: "https://example.com/avatar1.png",
  email: "",
  createdAt: new Date(),
};

const mockFilteredGroups: DBGroup[] = [
  {
    gid: "1",
    name: "Group Test 1",
    challengeTitle: "Challenge Test 1",
    members: [],
    updateDate: new Date(),
    location: null,
    radius: 0,
  },
  {
    gid: "2",
    name: "Group Test 2",
    challengeTitle: "Challenge Test 2",
    members: ["tester-uid"],
    updateDate: new Date(),
    location: null,
    radius: 0,
  },
];

// Mock FirestoreCtrl methods
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getGroup: jest.fn(() => Promise.resolve(mockFilteredGroups[0])),
      addGroupToUser: jest.fn(() => {
        mockUser.groups = ["Group Test 1"];
        Promise.resolve();
      }),
      addMemberToGroup: jest.fn(() => {
        mockFilteredGroups[0].members.push("tester-uid");
        Promise.resolve();
      }),
      updateGroup: jest.fn(() => Promise.resolve()),
    };
  });
});

/**
 * Test Suite for ListOfFilteredGroups ViewModel
 */
describe("ListOfFilteredGroups ViewModel", () => {
  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "info").mockImplementation(() => {});
  });

  it("gets the correct statuses from filtered groups", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useListOfFilteredGroupsViewModel({
        filteredGroups: mockFilteredGroups,
        firestoreCtrl: mockFirestoreCtrl,
        uid: "tester-uid",
        navigation: mockNavigation,
      }),
    );

    await waitFor(() => {
      expect(result.current.groupStatuses).toBeDefined();
    });

    // Wait for the promise to resolve
    await act(async () => {
      await Promise.resolve();
    });

    // Expects to be member of group 2
    expect(result.current.groupStatuses).toEqual({
      "1": { isJoined: false },
      "2": { isJoined: true },
    });
  });

  it("handles joining a group", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useListOfFilteredGroupsViewModel({
        filteredGroups: mockFilteredGroups,
        firestoreCtrl: mockFirestoreCtrl,
        uid: "tester-uid",
        navigation: mockNavigation,
      }),
    );

    await act(async () => {
      await result.current.handleJoin("1");
    });

    expect(mockFirestoreCtrl.getGroup).toHaveBeenCalledWith("1");
    expect(mockFirestoreCtrl.addGroupToUser).toHaveBeenCalledWith(
      "tester-uid",
      "Group Test 1",
    );
    expect(mockFirestoreCtrl.addMemberToGroup).toHaveBeenCalledWith(
      "1",
      "tester-uid",
    );

    expect(mockFilteredGroups[0].members).toContain("tester-uid");
    expect(mockUser.groups).toContain("Group Test 1");
  });
});
