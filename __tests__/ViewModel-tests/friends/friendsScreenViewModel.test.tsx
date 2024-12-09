import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useFriendsScreenViewModel } from "@/src/viewmodels/friends/FriendsScreenViewModel";

describe("useFriendsScreenViewModel", () => {
  const mockFirestoreCtrl = {
    getAllUsers: jest.fn(),
    getFriends: jest.fn(),
    getFriendRequests: jest.fn(),
  };

  const uid = "current-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and sets users correctly", async () => {
    const mockUsers = [
      { uid: "user1", name: "John Doe" },
      { uid: "user2", name: "Jane Smith" },
    ];
    mockFirestoreCtrl.getAllUsers.mockResolvedValueOnce(mockUsers);

    const { result } = renderHook(() =>
      useFriendsScreenViewModel(mockFirestoreCtrl, uid),
    );

    await waitFor(() => result.current.users.length > 0);

    expect(mockFirestoreCtrl.getAllUsers).toHaveBeenCalled();
    expect(result.current.users).toEqual(mockUsers);
  });

  it("filters users based on searchText", async () => {
    const mockUsers = [
      { uid: "user1", name: "John Doe" },
      { uid: "user2", name: "Jane Smith" },
    ];
    mockFirestoreCtrl.getAllUsers.mockResolvedValueOnce(mockUsers);

    const { result } = renderHook(() =>
      useFriendsScreenViewModel(mockFirestoreCtrl, uid),
    );

    await waitFor(() => result.current.users.length > 0);

    await act(() => {
      result.current.setSearchText("john");
    });

    expect(result.current.filteredUsers).toEqual([
      { uid: "user1", name: "John Doe" },
    ]);
  });

  it("excludes current user from filtered users", async () => {
    const mockUsers = [
      { uid: "user1", name: "John Doe" },
      { uid: "current-user-id", name: "Me" },
    ];
    mockFirestoreCtrl.getAllUsers.mockResolvedValueOnce(mockUsers);

    const { result } = renderHook(() =>
      useFriendsScreenViewModel(mockFirestoreCtrl, uid),
    );

    await waitFor(() => result.current.users.length > 0);

    await act(() => {
      result.current.setSearchText("me");
    });

    expect(result.current.filteredUsers).toEqual([]);
  });

  it("fetches and sets friends correctly", async () => {
    const mockFriends = [{ uid: "friend1", name: "Alice" }];
    mockFirestoreCtrl.getFriends.mockResolvedValueOnce(mockFriends);

    const { result } = renderHook(() =>
      useFriendsScreenViewModel(mockFirestoreCtrl, uid),
    );

    await waitFor(() => result.current.friends.length > 0);

    expect(mockFirestoreCtrl.getFriends).toHaveBeenCalledWith(uid);
    expect(result.current.friends).toEqual(mockFriends);
  });

  it("fetches and sets friend requests correctly", async () => {
    const mockRequests = [{ uid: "request1", name: "Bob" }];
    mockFirestoreCtrl.getFriendRequests.mockResolvedValueOnce(mockRequests);

    const { result } = renderHook(() =>
      useFriendsScreenViewModel(mockFirestoreCtrl, uid),
    );

    await waitFor(() => result.current.requests.length > 0);

    expect(mockFirestoreCtrl.getFriendRequests).toHaveBeenCalledWith(uid);
    expect(result.current.requests).toEqual(mockRequests);
  });

  it("logs the correct message on handleFriendPress", async () => {
    console.log = jest.fn();

    const { result } = renderHook(() =>
      useFriendsScreenViewModel(mockFirestoreCtrl, uid),
    );

    await act(async () => {
      await result.current.handleFriendPress("friend1");
    });

    expect(console.log).toHaveBeenCalledWith(
      "Navigate to friend friend1's profile",
    );
  });
});
