import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { RequestList } from "@/src/views/components/friends/request_list";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

// Mock du ViewModel
jest.mock("@/src/viewmodels/components/friends/RequestListViewModel", () => ({
  useRequestListViewModel: jest.fn(),
}));

jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      acceptFriend: jest.fn(),
      rejectFriend: jest.fn(),
    };
  });
});

describe("RequestList Component", () => {
  const mockUseRequestListViewModel =
    require("@/src/viewmodels/components/friends/RequestListViewModel").useRequestListViewModel;

  const mockFirestoreCtrl = new FirestoreCtrl();

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
      <RequestList
        requests={requests}
        firestoreCtrl={mockFirestoreCtrl}
        uid={uid}
      />,
    );

    expect(getByTestId("friend-request-list")).toBeTruthy();
    expect(getByTestId("friend-request-buttons-John")).toBeTruthy(); // John's request
    expect(getByTestId("friend-request-buttons-Jane")).toBeTruthy(); // Jane's request
  });

  it("calls the right methods button is pressed", async () => {
    const mockHandleAccept = jest.fn();
    const mockHandleDecline = jest.fn();

    mockUseRequestListViewModel.mockReturnValue({
      handleAccept: mockHandleAccept,
      handleDecline: mockHandleDecline,
    });

    const { getByTestId } = render(
      <RequestList
        requests={requests}
        firestoreCtrl={mockFirestoreCtrl}
        uid={uid}
      />,
    );

    const acceptButton = getByTestId("accept-button-John");
    const declineButton = getByTestId("decline-button-Jane");
    fireEvent.press(acceptButton);
    fireEvent.press(declineButton);

    await waitFor(() => expect(mockHandleAccept).toHaveBeenCalledWith("user1"));

    await waitFor(() =>
      expect(mockHandleDecline).toHaveBeenCalledWith("user2"),
    );
  });
});
