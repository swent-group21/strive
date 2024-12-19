import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { GroupListItem } from "@/src/views/components/groups/group_list_item";

/**
 * This test suite is for the GroupListItem component
 * UI-part of the GroupListItem component is tested
 */
describe("GroupListItem Component", () => {
  const mockHandleJoin = jest.fn();

  it("renders the component at first", () => {
    const { getByTestId } = render(
      <GroupListItem
        name="TestGroup"
        challengeTitle="TestChallenge"
        isJoined={false}
        handleJoin={mockHandleJoin}
      />,
    );

    // Check if the component is rendered
    expect(getByTestId("group-list-item-TestGroup")).toBeTruthy();
  });

  it("renders with the icon and its name", () => {
    const { getByTestId, getByText } = render(
      <GroupListItem
        name="TestGroup"
        challengeTitle="TestChallenge"
        isJoined={false}
        handleJoin={mockHandleJoin}
      />,
    );

    // Check if the icon and its name are rendered
    expect(getByTestId("group-icon")).toBeTruthy();
    expect(getByText("TestGroup")).toBeTruthy();
  });

  it("renders the correct challenge", () => {
    const { getByText } = render(
      <GroupListItem
        name="TestGroup"
        challengeTitle="TestChallenge"
        isJoined={false}
        handleJoin={mockHandleJoin}
      />,
    );

    expect(getByText("TestChallenge")).toBeTruthy();
  });

  it("displays the check if group is joined", () => {
    const { getByText } = render(
      <GroupListItem
        name="TestGroup"
        challengeTitle="TestChallenge"
        isJoined={true}
        handleJoin={mockHandleJoin}
      />,
    );

    expect(getByText("Joined ✓")).toBeTruthy();
  });

  it("displays and uses the join button if group is not joined", async () => {
    const { getByTestId, getByText } = render(
      <GroupListItem
        name="TestGroup"
        challengeTitle="TestChallenge"
        isJoined={false}
        handleJoin={mockHandleJoin}
      />,
    );

    expect(getByText("JOIN")).toBeTruthy();
    const joinButton = getByTestId("join-button-TestGroup");

    await waitFor(() => {
      fireEvent.press(joinButton);
    });

    expect(mockHandleJoin).toHaveBeenCalledTimes(1);
  });
});
