import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { RequestList } from "@/src/views/components/friends/request_list";

// Mock du ViewModel
jest.mock("@/src/viewmodels/components/friends/RequestListViewModel", () => ({
  useRequestListViewModel: jest.fn(),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  acceptFriend: jest.fn(),
  rejectFriend: jest.fn(),
}));

describe("RequestList Component", () => {
  const mockUseRequestListViewModel =
    require("@/src/viewmodels/components/friends/RequestListViewModel").useRequestListViewModel;

  const uid = "current-user-id";
  const requests = [
    { uid: "user1", name: "John", image_id: "avatar1" },
    { uid: "user2", name: "Jane", image_id: "avatar2" },
  ];

  it("renders the list of requests correctly", () => {
    mockUseRequestListViewModel.mockReturnValue({
      handleAccept: jest.fn(),
      handleDecline: jest.fn(),
    });

    const { getByTestId } = render(
      <RequestList requests={requests} uid={uid} />,
    );

    expect(getByTestId("friend-request-list")).toBeTruthy();
    expect(getByTestId("friend-request-buttons-0")).toBeTruthy(); // John's request
    expect(getByTestId("friend-request-buttons-1")).toBeTruthy(); // Jane's request
  });

  it("calls the right methods button is pressed", async () => {
    const mockHandleAccept = jest.fn();
    const mockHandleDecline = jest.fn();

    mockUseRequestListViewModel.mockReturnValue({
      handleAccept: mockHandleAccept,
      handleDecline: mockHandleDecline,
    });

    const { getByTestId } = render(
      <RequestList requests={requests} uid={uid} />,
    );

    const acceptButton = getByTestId("accept-button-0");
    const declineButton = getByTestId("decline-button-1");
    fireEvent.press(acceptButton);
    fireEvent.press(declineButton);

    await waitFor(() => expect(mockHandleAccept).toHaveBeenCalledWith("user1"));

    await waitFor(() =>
      expect(mockHandleDecline).toHaveBeenCalledWith("user2"),
    );
  });
});
