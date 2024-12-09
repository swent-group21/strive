import React, { act } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GroupScreen from "@/src/views/group/GroupScreen";
import FirestoreCtrl, {
  DBChallenge,
} from "@/src/models/firebase/FirestoreCtrl";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const mockChallenge1: DBChallenge = {
  challenge_name: "Challenge Test 1",
  description: "Description Test 1",
  uid: "1234",
  group_id: "1234",
};
const mockChallenge2: DBChallenge = {
  challenge_name: "Challenge Test 2",
  description: "Description Test 2",
  uid: "12345678",
  group_id: "1234",
};
const mockGroupChallenges: DBChallenge[] = [mockChallenge1, mockChallenge2];

const mockGroup = {
  group_id: "1234_5679",
  group_name: "Group Test 1",
  group_challenge_title: "Challenge Test 1",
};
const mockOtherGroups = [mockGroup];

jest.mock("@/src/viewmodels/group/GroupScreenViewModel", () =>
  jest.fn(() => ({
    groupChallenges: mockGroupChallenges,
    otherGroups: mockOtherGroups,
    groupName: "Test Name",
    groupChallengeTitle: "Title Test",
    groupId: "1234",
  })),
);
jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => [true]),
  isLoaded: jest.fn(() => true),
}));

jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => ({
    getUser: jest.fn(),
    getLikesOf: jest.fn().mockResolvedValue([]),
    updatesLikesOf: jest.fn(),
    getCommentsOf: jest.fn().mockResolvedValue([]),
  }));
});

describe("Group Screen renders challenges", () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockFirestoreCtrl = new FirestoreCtrl();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to home when clicking the home button", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={{}}
        navigation={mockNavigation}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("home-pressable-button"));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("Home");
    expect(getByTestId("home-button")).toBeTruthy();
  });

  it("navigates to group when clicking to specific button", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={{}}
        navigation={mockNavigation}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("group-pressable-button"));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("GroupScreen", {
      currentGroup: mockGroup,
    });
  });

  it("navigate to CreateGroup screen when button + clicked", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={{}}
        navigation={mockNavigation}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("create-group-pressable-button"));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("CreateGroup");
  });

  it("navigates to Camera with group informations when clicked", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={{}}
        navigation={mockNavigation}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("bottom-center-icon-camera-outline"));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("Camera", {
      group_id: "1234",
    });
  });
});
