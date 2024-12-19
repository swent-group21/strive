import React from "react";
import {
  render,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react-native";
import { useRequestListViewModel } from "@/src/viewmodels/components/friends/RequestListViewModel";
import {
  acceptFriend,
  rejectFriend,
} from "@/src/models/firebase/SetFirestoreCtrl";

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  acceptFriend: jest.fn(),
  rejectFriend: jest.fn(),
}));

describe("RequestList ViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "info").mockImplementation(() => {});
  });

  it("handles accepting a friend", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useRequestListViewModel({
        uid: "user-uid",
      }),
    );

    await act(async () => {
      await result.current.handleAccept("user1");
    });

    expect(acceptFriend).toHaveBeenCalledWith("user-uid", "user1");
  });

  it("handles accepting a friend", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useRequestListViewModel({
        uid: "user-uid",
      }),
    );

    await act(async () => {
      await result.current.handleDecline("user2");
    });

    expect(rejectFriend).toHaveBeenCalledWith("user-uid", "user2");
  });
});
