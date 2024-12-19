import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { Challenge } from "@/src/views/components/posts/challenge";
import FirestoreCtrl, {
  DBChallenge,
  DBUser,
} from "@/src/models/firebase/FirestoreCtrl";

// Mock du ViewModel
jest.mock("@/src/viewmodels/components/posts/ChallengeViewModel", () => ({
  useChallengeViewModel: jest.fn(),
}));

// Mock FirestoreCtrl methods
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUser: jest.fn().mockResolvedValue({
        uid: "user123",
        name: "Current User",
        email: "test@test.com",
        createdAt: new Date(),
      }),
      getLikesOf: jest.fn().mockResolvedValue(["12345", "67890"]),
      getCommentsOf: jest.fn().mockResolvedValue([
        {
          uid: "12345",
          name: "Test User",
          comment: "This is a test comment",
          created_at: new Date(),
        },
      ]),
      updateLikesOf: jest
        .fn()
        .mockResolvedValue(["challenge123", ["12345", "67890", "user123"]]),
    };
  });
});

const challengeDB: DBChallenge = {
  caption: "challengeName",
  challenge_id: "challenge123",
  uid: "user123",
  image_id: "https://example.com/image.jpg",
  likes: ["12345", "67890"],
  challenge_description: "challengeTitle",
};

describe("Challenge Component", () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockUseChallengeViewModel =
    require("@/src/viewmodels/components/posts/ChallengeViewModel").useChallengeViewModel;
  const mockDate = new Date();

  const mockSetIsOpen = jest.fn();

  const currentUser: DBUser = {
    uid: "user123",
    name: "Current User",
    email: "test@test.com",
    createdAt: mockDate,
  };

  // Reset the mocks and set the default values for the ViewModel before each test
  beforeEach(() => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.clearAllMocks();

    // Mock les valeurs par défaut du ViewModel
    mockUseChallengeViewModel.mockReturnValue({
      isLiked: false,
      user: currentUser,
      comments: [],
      handleDoubleTap: jest.fn(),
      handleLikePress: jest.fn(),
      placeholderImage: "@/assets/images/no-image.svg",
    });
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1466424490000));
  });

  it("renders the Challenge component", async () => {
    const { getByTestId } = render(
      <Challenge
        challengeDB={challengeDB}
        index={0}
        firestoreCtrl={mockFirestoreCtrl}
        navigation={mockNavigation}
        testID="challenge"
        currentUser={currentUser}
      />,
    );

    expect(getByTestId("challenge-id-challengeName")).toBeTruthy();
  });

  it("handles double click to like", async () => {
    const mockHandleDoubleTap = jest.fn();
    mockUseChallengeViewModel.mockReturnValue({
      isLiked: false,
      user: currentUser,
      comments: [],
      handleDoubleTap: mockHandleDoubleTap,
      handleLikePress: jest.fn(),
      placeholderImage: "@/assets/images/no-image.svg",
    });

    render(
      <Challenge
        challengeDB={challengeDB}
        index={0}
        firestoreCtrl={mockFirestoreCtrl}
        navigation={mockNavigation}
        testID="challenge"
        currentUser={currentUser}
      />,
    );

    const touchable = screen.getByTestId("challenge-id-challengeName");

    fireEvent.press(touchable);
    fireEvent.press(touchable); // Simulate double-tap

    expect(mockHandleDoubleTap).toHaveBeenCalled();
  });

  it("handles like by clicking on like button", async () => {
    const mockHandleLikePress = jest.fn();
    mockUseChallengeViewModel.mockReturnValue({
      isLiked: false,
      user: currentUser,
      comments: [],
      handleDoubleTap: jest.fn(),
      handleLikePress: mockHandleLikePress,
      placeholderImage: "@/assets/images/no-image.svg",
    });

    render(
      <Challenge
        challengeDB={challengeDB}
        index={0}
        firestoreCtrl={mockFirestoreCtrl}
        navigation={mockNavigation}
        testID="challenge"
        currentUser={currentUser}
      />,
    );

    const touchable = screen.getByTestId("like-button");

    fireEvent.press(touchable);
    expect(mockHandleLikePress).toHaveBeenCalled();
  });

  it("renders comment", async () => {
    mockUseChallengeViewModel.mockReturnValue({
      isLiked: false,
      user: currentUser,
      comments: [
        {
          uid: "12345",
          name: "Test User",
          comment: "This is a test comment",
          created_at: new Date(),
        },
      ],
      handleDoubleTap: jest.fn(),
      handleLikePress: jest.fn(),
      placeholderImage: "@/assets/images/no-image.svg",
    });

    render(
      <Challenge
        challengeDB={challengeDB}
        index={0}
        firestoreCtrl={mockFirestoreCtrl}
        navigation={mockNavigation}
        testID="challenge"
        currentUser={currentUser}
      />,
    );

    const touchable = screen.getByTestId("firstComment");
    expect(touchable).toBeTruthy();
  });
});
