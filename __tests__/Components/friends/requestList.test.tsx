import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RequestList from "@/components/friends/RequestList";

describe("RequestList", () => {
  const mockFirestoreCtrl = {
    acceptFriend: jest.fn(),
    rejectFriend: jest.fn(),
  };

  const uid = "current-user-id";
  const requests = [
    { uid: "user1", name: "John", image_id: "avatar1" },
    { uid: "user2", name: "Jane", image_id: "avatar2" },
  ];

  it("renders the list of requests correctly", () => {
    const { getByText } = render(
      <RequestList
        requests={requests}
        firestoreCtrl={mockFirestoreCtrl}
        uid={uid}
      />,
    );

    expect(getByText("John")).toBeTruthy();
    expect(getByText("Jane")).toBeTruthy();
  });

  it("calls acceptFriend when accept button is pressed", () => {
    const { getByTestId } = render(
      <RequestList
        requests={requests}
        firestoreCtrl={mockFirestoreCtrl}
        uid={uid}
      />,
    );

    const acceptButton = getByTestId("accept-button-0");
    fireEvent.press(acceptButton);

    expect(mockFirestoreCtrl.acceptFriend).toHaveBeenCalledWith(uid, "user1");
  });

  it("calls rejectFriend when decline button is pressed", () => {
    const { getByTestId } = render(
      <RequestList
        requests={requests}
        firestoreCtrl={mockFirestoreCtrl}
        uid={uid}
      />,
    );

    const declineButton = getByTestId("decline-button-1");
    fireEvent.press(declineButton);

    expect(mockFirestoreCtrl.rejectFriend).toHaveBeenCalledWith(uid, "user2");
  });

  it("renders empty state when no requests are provided", () => {
    const { queryByText } = render(
      <RequestList requests={[]} firestoreCtrl={mockFirestoreCtrl} uid={uid} />,
    );

    expect(queryByText("John")).toBeNull();
    expect(queryByText("Jane")).toBeNull();
  });
});
