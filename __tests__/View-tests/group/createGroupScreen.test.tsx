import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import CreateGroupScreen from "@/src/views/group/CreateGroupScreen";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";

// Mock de useGroupScreenViewModel

const mockSetGroupName = jest.fn();
const mockSetChallengeTitle = jest.fn();
const mockMakeGroup = jest.fn();

jest.mock("@/src/viewmodels/group/CreateGroupViewModel", () =>
  jest.fn(() => ({
    groupName: "Test group",
    setGroupName: mockSetGroupName,
    challengeTitle: "Test challenge title",
    setChallengeTitle: mockSetChallengeTitle,
    makeGroup: mockMakeGroup,
  })),
);

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getUser: jest.fn(),
  getLikesOf: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  updatesLikesOf: jest.fn(),
}));

const mockDate = new Date();

const mockUser: DBUser = {
  uid: "1234",
  name: "Tester",
  email: "email@test.com",
  createdAt: mockDate,
};

describe("Create Group Screen renders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the create group screen", () => {
    const { getByTestId } = render(
      <CreateGroupScreen user={mockUser} navigation={{}} />,
    );
    expect(getByTestId("create-group-screen")).toBeTruthy();
  });

  it("renders the group name input", () => {
    const { getByTestId } = render(
      <CreateGroupScreen user={mockUser} navigation={{}} />,
    );
    expect(getByTestId("Group-Name-Input")).toBeTruthy();

    fireEvent.changeText(getByTestId("Group-Name-Input"), "Test group 2");
    expect(mockSetGroupName).toHaveBeenCalledWith("Test group 2");
  });

  it("renders the group description  input", () => {
    const { getByTestId } = render(
      <CreateGroupScreen user={mockUser} navigation={{}} />,
    );
    expect(getByTestId("Description-Input")).toBeTruthy();

    fireEvent.changeText(getByTestId("Description-Input"), "Test description");
    expect(mockSetChallengeTitle).toHaveBeenCalledWith("Test description");
  });

  it("creates group when arrow is clicked", () => {
    const { getByTestId } = render(
      <CreateGroupScreen user={mockUser} navigation={{}} />,
    );
    expect(getByTestId("bottom-right-icon-arrow-forward")).toBeTruthy();

    fireEvent.press(getByTestId("bottom-right-icon-arrow-forward"));
    expect(mockMakeGroup).toHaveBeenCalled();
  });
});
