import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import GroupScreen from "@/src/views/groups/group_screen";
import { useGroupScreenViewModel } from "@/src/viewmodels/groups/GroupScreenViewModel";
import FirestoreCtrl, {
  DBChallenge,
  DBUser,
} from "@/src/models/firebase/FirestoreCtrl";

const mockChallenge1: DBChallenge = {
  caption: "Challenge Test 1",
  uid: "1234",
  group_id: "1234",
  challenge_description: "Title Test",
};
const mockChallenge2: DBChallenge = {
  caption: "Challenge Test 2",
  uid: "12345678",
  group_id: "1234",
  challenge_description: "Title Test",
};
const mockGroupChallenges: DBChallenge[] = [mockChallenge1, mockChallenge2];

const mockGroup = {
  group_id: "1234_5679",
  group_name: "Group Test 1",
  group_challenge_title: "Challenge Test 1",
};
const mockOtherGroups = [mockGroup];

const mockUser: DBUser = {
  uid: "1234",
  name: "Test User",
  email: "test@gmail.com",
  createdAt: new Date(),
};

// Mock the useGroupScreenViewModel hook
jest.mock("@/src/viewmodels/groups/GroupScreenViewModel", () => ({
  useGroupScreenViewModel: jest.fn(),
}));

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
const mockFirestoreCtrl = new FirestoreCtrl();

describe("Group Screen renders challenges", () => {
  const mockUseGroupScreenViewModel =
    require("@/src/viewmodels/groups/GroupScreenViewModel").useGroupScreenViewModel;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGroupScreenViewModel.mockReturnValue({
      groupChallenges: mockGroupChallenges,
      otherGroups: mockOtherGroups,
      groupName: "Test Name",
      groupChallengeTitle: "Title Test",
      groupId: "1234",
      groupCenter: { latitude: 0, longitude: 0 },
      groupRadius: 100,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the group screen", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId("group-screen")).toBeTruthy();
    });
  });

  it("renders the group name", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId("topTitle-Test Name")).toBeTruthy();
    });
  });

  it("renders the home button", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId("home-button")).toBeTruthy();
    });
  });

  it("renders the other groups icons", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId("group-id-0")).toBeTruthy();
    });
  });

  it("renders the create group button", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId("create-group-button")).toBeTruthy();
    });
  });

  it("renders the group challenge title", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId("description-id")).toBeTruthy();
    });
  });

  it("renders all the challenges", async () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId("challenge-id-0")).toBeTruthy();
      expect(getByTestId("challenge-id-1")).toBeTruthy();
    });
  });
});

describe("Group Screen renders challenges", () => {
  const groupChallenges: DBChallenge[] = [];

  beforeEach(() => {
    // Mock the return value of useGroupScreenViewModel
    (useGroupScreenViewModel as jest.Mock).mockReturnValue({
      groupChallenges: [],
      otherGroups: mockOtherGroups,
      groupName: "Group Testing Name",
      groupChallengeTitle: "Group Testing Challenge Title",
      groupId: "1234",
    });
  });

  it("renders correct message when no challenge to display", () => {
    const { getByTestId } = render(
      <GroupScreen
        user={mockUser}
        navigation={{}}
        route={{}}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );
    expect(getByTestId("no-challenge-id")).toBeTruthy();
  });
});
