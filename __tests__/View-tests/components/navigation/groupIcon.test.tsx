import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import GroupIcon from "@/src/views/components/navigation/group_icon";
import { DBGroup } from "@/src/models/firebase/TypeFirestoreCtrl";

describe("GroupIcon Component", () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockDate = new Date();
  const mockLoc = undefined;

  const mockGroup: DBGroup = {
    name: "groupName",
    gid: "group123",
    challengeTitle: "Group Test Challenge",
    members: [],
    updateDate: mockDate,
    location: mockLoc,
    radius: 100,
  };

  it("renders correctly the component", () => {
    const { getByTestId } = render(
      <GroupIcon
        groupDB={mockGroup}
        navigation={mockNavigation}
        index={0}
        testID="group-icon-test"
      />,
    );

    expect(getByTestId("group-icon-test")).toBeTruthy();
  });

  it("renders correctly the right text when no group", async () => {
    const { getByText } = render(
      <GroupIcon
        groupDB={undefined}
        navigation={mockNavigation}
        index={0}
        testID="group-icon-test"
      />,
    );

    // Check if the text is correct when the groupDB is undefined
    expect(getByText("Loading Group...")).toBeTruthy();
  });

  it("navigates correctly when pressed", async () => {
    const { getByTestId } = render(
      <GroupIcon
        groupDB={mockGroup}
        navigation={mockNavigation}
        index={0}
        testID="group-icon-test"
      />,
    );

    // Press the icons
    await waitFor(() => {
      fireEvent.press(getByTestId("group-pressable-button"));
    });

    // Check if the onPress method has been called
    expect(mockNavigation.navigate).toHaveBeenCalledWith("GroupScreen", {
      currentGroup: mockGroup,
    });
  });
});
