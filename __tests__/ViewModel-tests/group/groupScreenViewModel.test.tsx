import { renderHook, waitFor } from "@testing-library/react-native";
import { useGroupScreenViewModel } from "@/src/viewmodels/groups/GroupScreenViewModel";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAllPostsOfGroup: jest.fn(),
      getGroupsByUserId: jest.fn(() =>
        Promise.resolve([
          { gid: "group-1", name: "Group 1", updateDate: new Date() },
          { gid: "group-2", name: "Group 2", updateDate: new Date() },
        ]),
      ),
    };
  });
});

describe("useGroupScreenViewModel", () => {
  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockUser: DBUser = {
    uid: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    createdAt: new Date(),
  };
  const mockRoute = {
    params: {
      currentGroup: {
        gid: "test-group-id",
        name: "Test Group",
        challengeTitle: "Test Challenge",
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetch group challenges and set state", async () => {
    const mockChallenges = [
      { challenge_id: "1", challenge_name: "Challenge 1" },
      { challenge_id: "2", challenge_name: "Challenge 2" },
    ];
    (mockFirestoreCtrl.getAllPostsOfGroup as jest.Mock).mockResolvedValue(
      mockChallenges,
    );

    const { result } = renderHook(() =>
      useGroupScreenViewModel({
        user: mockUser,
        firestoreCtrl: mockFirestoreCtrl,
        route: mockRoute,
      }),
    );

    // Wait for the state to update after the first useEffect runs
    await waitFor(() => {
      expect(result.current.groupChallenges.length).toBeGreaterThan(0);
    });

    expect(mockFirestoreCtrl.getAllPostsOfGroup).toHaveBeenCalledWith(
      "test-group-id",
    );
    expect(result.current.groupChallenges).toEqual(mockChallenges);
  });

  it("fetch groups and set state", async () => {
    const mockGroups = [
      { gid: "group-1", name: "Group 1", updateDate: new Date() },
      { gid: "group-2", name: "Group 2", updateDate: new Date() },
    ];
    (mockFirestoreCtrl.getGroupsByUserId as jest.Mock).mockResolvedValue(
      mockGroups,
    );

    const { result } = renderHook(() =>
      useGroupScreenViewModel({
        user: mockUser,
        firestoreCtrl: mockFirestoreCtrl,
        route: mockRoute,
      }),
    );

    // Wait for the state to update after the second useEffect runs
    await waitFor(() => {
      expect(result.current.otherGroups.length).toBeGreaterThan(0);
    });

    expect(mockFirestoreCtrl.getGroupsByUserId).toHaveBeenCalledWith(
      "test-user-id",
    );
    expect(result.current.otherGroups).toEqual(
      mockGroups.filter((group) => group.gid !== "test-group-id"),
    );
  });

  it("handle errors when fetching group challenges", async () => {
    const errorMessage = "Error fetching challenges";
    (mockFirestoreCtrl.getAllPostsOfGroup as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    jest.spyOn(console, "error").mockImplementation();

    renderHook(() =>
      useGroupScreenViewModel({
        user: mockUser,
        firestoreCtrl: mockFirestoreCtrl,
        route: mockRoute,
      }),
    );

    expect(mockFirestoreCtrl.getAllPostsOfGroup).toHaveBeenCalledWith(
      "test-group-id",
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching challenges: ",
        expect.any(Error),
      );
    });
  });

  it("handle errors when fetching groups", async () => {
    const errorMessage = "Error fetching groups";
    (mockFirestoreCtrl.getGroupsByUserId as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    jest.spyOn(console, "error").mockImplementation();

    renderHook(() =>
      useGroupScreenViewModel({
        user: mockUser,
        firestoreCtrl: mockFirestoreCtrl,
        route: mockRoute,
      }),
    );

    expect(mockFirestoreCtrl.getGroupsByUserId).toHaveBeenCalledWith(
      "test-user-id",
    );
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching groups: ",
        expect.any(Error),
      );
    });
  });

  it("return correct group details", async () => {
    const { result } = renderHook(() =>
      useGroupScreenViewModel({
        user: mockUser,
        firestoreCtrl: mockFirestoreCtrl,
        route: mockRoute,
      }),
    );

    await waitFor(() => {
      expect(result.current.groupName).toBe("Test Group");
      expect(result.current.groupChallengeTitle).toBe("Test Challenge");
      expect(result.current.groupId).toBe("test-group-id");
    });
  });

  it("sort the challenges by latest first", async () => {
    const mockDate1 = new Date(2021, 1, 1, 0, 0, 0, 0);
    const mockDate2 = new Date(2023, 1, 2, 0, 0, 0, 0);

    const mockChallenges = [
      { challenge_id: "1", challenge_name: "Challenge 1", date: mockDate1 },
      { challenge_id: "2", challenge_name: "Challenge 2", date: mockDate2 },
    ];
    (mockFirestoreCtrl.getAllPostsOfGroup as jest.Mock).mockResolvedValue(
      mockChallenges,
    );
    const { result } = renderHook(() =>
      useGroupScreenViewModel({
        user: mockUser,
        firestoreCtrl: mockFirestoreCtrl,
        route: mockRoute,
      }),
    );

    await waitFor(() => {
      expect(result.current.groupChallenges).toEqual([
        { challenge_id: "2", challenge_name: "Challenge 2", date: mockDate2 },
        { challenge_id: "1", challenge_name: "Challenge 1", date: mockDate1 },
      ]);
    });
  });
});
