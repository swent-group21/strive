import { waitFor, renderHook, act } from "@testing-library/react-native";
import { useListOfFilteredUsersViewModel } from "@/src/viewmodels/components/friends/ListOfFilteredUsersViewModel";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import { isFriend, isRequested } from "@/src/models/firebase/GetFirestoreCtrl";
import {
  addFriend,
  removeFriendRequest,
} from "@/src/models/firebase/SetFirestoreCtrl";

// Mock FirestoreCtrl methods
jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  isFriend: jest.fn((uid, friendId) => Promise.resolve(friendId === "1")), // John is a friend
  isRequested: jest.fn(() => Promise.resolve(false)),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  addFriend: jest.fn(() => Promise.resolve()),
  removeFriendRequest: jest.fn(() => Promise.resolve()),
}));

const mockFilteredUsers: DBUser[] = [
  {
    uid: "1",
    name: "John Doe",
    image_id: "https://example.com/avatar1.png",
    email: "john@example.com",
    createdAt: new Date(),
  },
  {
    uid: "2",
    name: "Jane Smith",
    image_id: null,
    email: "jane@example.com",
    createdAt: new Date(),
  },
];

// Mock du ViewModel
describe("ListOfFilteredUsers ViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "info").mockImplementation(() => {});
  });

  it("gets the correct statuses from filtered users", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useListOfFilteredUsersViewModel({
        filteredUsers: mockFilteredUsers,
        uid: "user-uid",
      }),
    );

    await waitFor(() => {
      expect(result.current.userStatuses).toBeDefined();
    });

    expect(isFriend).toHaveBeenCalledWith("user-uid", "1");
    expect(isRequested).toHaveBeenCalledWith("user-uid", "2");

    // Wait for the promise to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.userStatuses).toEqual({
      "1": { isFriendB: true, isRequestedB: false },
      "2": { isFriendB: false, isRequestedB: false },
    });
  });

  it("handles adding a friend", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useListOfFilteredUsersViewModel({
        filteredUsers: mockFilteredUsers,
        uid: "user-uid",
      }),
    );

    await act(async () => {
      await result.current.handleAdd("2");
    });

    expect(addFriend).toHaveBeenCalledWith("user-uid", "2");
  });

  it("handles removing a friend", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useListOfFilteredUsersViewModel({
        filteredUsers: mockFilteredUsers,
        uid: "user-uid",
      }),
    );

    await act(async () => {
      await result.current.handleRemove("1");
    });

    expect(removeFriendRequest).toHaveBeenCalledWith("user-uid", "1");
  });
});
