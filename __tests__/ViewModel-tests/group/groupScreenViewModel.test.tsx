import { renderHook, waitFor } from "@testing-library/react-native";
import useGroupScreenViewModel from "@/src/viewmodels/group/GroupScreenViewModel";
import {
  getAllPostsOfGroup,
  getGroupsByUserId,
} from "@/src/models/firebase/GetFirestoreCtrl";
import * as GetFirestoreCtrl from "@/src/models/firebase/GetFirestoreCtrl";
import { GeoPoint } from "firebase/firestore";

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getAllPostsOfGroup: jest.fn(),
  getGroupsByUserId: jest.fn(() =>
    Promise.resolve([
      { gid: "group-1", name: "Group 1", updateDate: new Date() },
      { gid: "group-2", name: "Group 2", updateDate: new Date() },
    ]),
  ),
}));

jest.mock("firebase/firestore", () => {
  return {
    GeoPoint: jest.fn().mockImplementation((lat, lng) => ({
      latitude: lat,
      longitude: lng,
      isEqual: (other) => lat === other.latitude && lng === other.longitude,
      toJSON: () => ({ latitude: lat, longitude: lng }),
    })),
  };
});

describe("useGroupScreenViewModel", () => {
  const mockUser = {
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

  it("should fetch group challenges and set state", async () => {
    const mockChallenges = [
      { caption: "caption 1", uid: "1", challenge_description: "desc 1" },
      { caption: "caption 2", uid: "2", challenge_description: "desc 2" },
    ];

    jest
      .spyOn(GetFirestoreCtrl, "getAllPostsOfGroup")
      .mockResolvedValue(mockChallenges);

    const { result } = renderHook(() =>
      useGroupScreenViewModel(mockUser, mockRoute),
    );

    // Wait for the state to update after the first useEffect runs
    await waitFor(() => {
      expect(result.current.groupChallenges.length).toBeGreaterThan(0);
    });

    expect(getAllPostsOfGroup).toHaveBeenCalledWith("test-group-id");
    expect(result.current.groupChallenges).toEqual(mockChallenges);
  });

  it("should fetch groups and set state", async () => {
    const mockGroups = [
      {
        gid: "group-1",
        name: "Group 1",
        challengeTitle: "Title 1",
        members: ["1", "2"],
        updateDate: new Date(),
        location: new GeoPoint(48.8566, 2.3522),
        radius: 100,
      },
      {
        gid: "group-2",
        name: "Group 2",
        challengeTitle: "Title 2",
        members: ["1", "2"],
        updateDate: new Date(),
        location: new GeoPoint(48.8566, 2.3522),
        radius: 100,
      },
    ];

    jest
      .spyOn(GetFirestoreCtrl, "getGroupsByUserId")
      .mockResolvedValue(mockGroups);

    const { result } = renderHook(() =>
      useGroupScreenViewModel(mockUser, mockRoute),
    );

    // Wait for the state to update after the second useEffect runs
    await waitFor(() => {
      expect(result.current.otherGroups.length).toBeGreaterThan(0);
    });

    expect(getGroupsByUserId).toHaveBeenCalledWith("test-user-id");
    expect(result.current.otherGroups).toEqual(
      mockGroups.filter((group) => group.gid !== "test-group-id"),
    );
  });

  it("should handle errors when fetching group challenges", async () => {
    const errorMessage = "Error fetching challenges";

    jest
      .spyOn(GetFirestoreCtrl, "getAllPostsOfGroup")
      .mockRejectedValue(new Error(errorMessage));

    jest.spyOn(console, "error").mockImplementation();

    renderHook(() => useGroupScreenViewModel(mockUser, mockRoute));

    expect(getAllPostsOfGroup).toHaveBeenCalledWith("test-group-id");

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching challenges: ",
        expect.any(Error),
      );
    });
  });

  it("should handle errors when fetching groups", async () => {
    const errorMessage = "Error fetching groups";

    jest
      .spyOn(GetFirestoreCtrl, "getGroupsByUserId")
      .mockRejectedValue(new Error(errorMessage));

    jest.spyOn(console, "error").mockImplementation();

    renderHook(() => useGroupScreenViewModel(mockUser, mockRoute));

    expect(getGroupsByUserId).toHaveBeenCalledWith("test-user-id");
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching groups: ",
        expect.any(Error),
      );
    });
  });

  it("should return correct group details", async () => {
    const { result } = renderHook(() =>
      useGroupScreenViewModel(mockUser, mockRoute),
    );

    await waitFor(() => {
      expect(result.current.groupName).toBe("Test Group");
      expect(result.current.groupChallengeTitle).toBe("Test Challenge");
      expect(result.current.groupId).toBe("test-group-id");
    });
  });

  it("should sort the challenges by latest first", async () => {
    const mockDate1 = new Date(2021, 1, 1, 0, 0, 0, 0);
    const mockDate2 = new Date(2023, 1, 2, 0, 0, 0, 0);

    const mockChallenges = [
      { challenge_id: "1", challenge_name: "Challenge 1", date: mockDate1 },
      { challenge_id: "2", challenge_name: "Challenge 2", date: mockDate2 },
    ];

    jest.spyOn(GetFirestoreCtrl, "getAllPostsOfGroup").mockImplementationOnce(
      (): Promise<any> =>
        Promise.resolve([
          { challenge_id: "1", challenge_name: "Challenge 1", date: mockDate1 },
          { challenge_id: "2", challenge_name: "Challenge 2", date: mockDate2 },
        ]),
    );

    const { result } = renderHook(() =>
      useGroupScreenViewModel(mockUser, mockRoute),
    );

    await waitFor(() => {
      expect(result.current.groupChallenges).toEqual([
        { challenge_id: "2", challenge_name: "Challenge 2", date: mockDate2 },
        { challenge_id: "1", challenge_name: "Challenge 1", date: mockDate1 },
      ]);
    });
  });
});
