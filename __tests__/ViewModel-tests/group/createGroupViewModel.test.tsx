import { renderHook, act, waitFor } from "@testing-library/react-native";
import { CreateGroupViewModel } from "@/src/viewmodels/groups/CreateGroupViewModel";
import { createGroup } from "@/types/GroupBuilder";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/types/GroupBuilder", () => ({
  createGroup: jest.fn(),
}));

describe("CreateGroupViewModel", () => {
  const mockUser = {
    uid: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    createdAt: new Date(),
  };
  const mockNavigation = { navigate: jest.fn() };
  const mockFirestoreCtrl = new FirestoreCtrl();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call createGroup with the correct arguments", async () => {
    const { result } = renderHook(() =>
      CreateGroupViewModel({
        user: mockUser,
        navigation: mockNavigation,
        firestoreCtrl: mockFirestoreCtrl,
      }),
    );

    const { setGroupName, setChallengeTitle } = result.current;

    // Update groupName and challengeTitle states
    act(() => {
      setGroupName("Test Group");
      setChallengeTitle("Test Challenge");
    });

    await waitFor(() => {
      expect(result.current.groupName).toBe("Test Group");
      expect(result.current.challengeTitle).toBe("Test Challenge");
    });

    //Update the state
    const { makeGroup } = result.current;

    // Wait for the state to reflect the updated values
    await act(async () => {
      await makeGroup();
    });

    expect(createGroup).toHaveBeenCalledWith(
      mockFirestoreCtrl,
      "Test Group",
      "Test Challenge",
      ["test-user-id"],
      expect.any(Date), // Timestamp or Date
      expect.any(Object), // Location
      2000, // Radius
    );

    expect(mockNavigation.navigate).toHaveBeenCalledWith("Home");
  });

  it("should log an error and return it if createGroup fails", async () => {
    const errorMessage = "Error creating group";
    (createGroup as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() =>
      CreateGroupViewModel({
        user: mockUser,
        navigation: mockNavigation,
        firestoreCtrl: mockFirestoreCtrl,
      }),
    );

    const { makeGroup } = result.current;

    await act(async () => {
      const error = await makeGroup();
      expect(error).toEqual(new Error(errorMessage));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Unable to create challenge",
      expect.any(Error),
    );

    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
