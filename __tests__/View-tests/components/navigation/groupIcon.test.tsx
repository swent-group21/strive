import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { ChallengeDescription } from "@/src/views/components/challenge/Challenge_Description";
import { BottomBar } from "@/src/views/components/navigation/bottom_bar";
import { color } from "react-native-elements/dist/helpers";
import GroupIcon from "@/src/views/components/navigation/group_icon";
import FirestoreCtrl, { DBGroup } from "@/src/models/firebase/FirestoreCtrl";
import { GeoPoint } from "firebase/firestore";

describe("GroupIcon Component", () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockFirestoreCtrl = new FirestoreCtrl();
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
        firestoreCtrl={mockFirestoreCtrl}
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
        firestoreCtrl={mockFirestoreCtrl}
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
        firestoreCtrl={mockFirestoreCtrl}
        index={0}
        testID="group-icon-test"
      />,
    );

    // Press the icons
    await waitFor(() => {
      fireEvent.press(getByTestId("group-pressable-button-groupName"));
    });

    // Check if the onPress method has been called
    expect(mockNavigation.navigate).toHaveBeenCalledWith("GroupScreen", {
      currentGroup: mockGroup,
    });
  });
});
