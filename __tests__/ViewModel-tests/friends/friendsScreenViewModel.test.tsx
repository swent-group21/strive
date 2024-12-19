import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useFriendsScreenViewModel } from "@/src/viewmodels/friends/FriendsScreenViewModel";
import * as GetFirestoreCtrl from "@/src/models/firebase/GetFirestoreCtrl";

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getAllUsers: jest.fn(),
  getFriends: jest.fn(),
  getFriendRequests: jest.fn(),
}));

describe("useFriendsScreenViewModel", () => {
  const uid = "current-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and sets users correctly", async () => {
    const usersMock = jest
      .spyOn(GetFirestoreCtrl, "getAllUsers")
      .mockImplementationOnce(
        (): Promise<any> =>
          Promise.resolve([
            { name: "John Doe", uid: "user1" },
            { name: "Jane Smith", uid: "user2" },
          ]),
      );

    const { result } = renderHook(() => useFriendsScreenViewModel(uid));

    await waitFor(() => result.current.users.length > 0);

    expect(GetFirestoreCtrl.getAllUsers).toHaveBeenCalled();
    expect(result.current.users).toEqual([
      { name: "John Doe", uid: "user1" },
      { name: "Jane Smith", uid: "user2" },
    ]);
  });

  it("filters users based on searchText", async () => {
    jest.spyOn(GetFirestoreCtrl, "getAllUsers").mockImplementationOnce(
      (): Promise<any> =>
        Promise.resolve([
          { uid: "user1", name: "John Doe" },
          { uid: "user2", name: "Jane Smith" },
        ]),
    );

    const { result } = renderHook(() => useFriendsScreenViewModel(uid));

    await waitFor(() => result.current.users.length > 0);

    await act(() => {
      result.current.setSearchText("john");
    });

    expect(result.current.filteredUsers).toEqual([
      { uid: "user1", name: "John Doe" },
    ]);
  });

  it("excludes current user from filtered users", async () => {
    jest.spyOn(GetFirestoreCtrl, "getAllUsers").mockImplementationOnce(
      (): Promise<any> =>
        Promise.resolve([
          { uid: "user1", name: "John Doe" },
          { uid: "current-user-id", name: "Me" },
        ]),
    );

    const { result } = renderHook(() => useFriendsScreenViewModel(uid));

    await waitFor(() => result.current.users.length > 0);

    await act(() => {
      result.current.setSearchText("me");
    });

    expect(result.current.filteredUsers).toEqual([]);
  });

  it("fetches and sets friends correctly", async () => {
    jest
      .spyOn(GetFirestoreCtrl, "getFriends")
      .mockImplementationOnce(
        (): Promise<any> =>
          Promise.resolve([{ uid: "friend1", name: "Alice" }]),
      );

    const { result } = renderHook(() => useFriendsScreenViewModel(uid));

    await waitFor(() => result.current.friends.length > 0);

    expect(GetFirestoreCtrl.getFriends).toHaveBeenCalledWith(uid);
    expect(result.current.friends).toEqual([{ uid: "friend1", name: "Alice" }]);
  });

  it("fetches and sets friend requests correctly", async () => {
    jest
      .spyOn(GetFirestoreCtrl, "getFriendRequests")
      .mockImplementationOnce(
        (): Promise<any> => Promise.resolve([{ uid: "request1", name: "Bob" }]),
      );

    const { result } = renderHook(() => useFriendsScreenViewModel(uid));

    await waitFor(() => result.current.requests.length > 0);

    expect(GetFirestoreCtrl.getFriendRequests).toHaveBeenCalledWith(uid);
    expect(result.current.requests).toEqual([{ uid: "request1", name: "Bob" }]);
  });
});
