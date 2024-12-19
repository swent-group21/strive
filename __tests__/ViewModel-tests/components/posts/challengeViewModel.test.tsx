import { waitFor, renderHook, act } from "@testing-library/react-native";
import { DBChallenge, DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import {
  getUser,
  getLikesOf,
  getCommentsOf,
} from "@/src/models/firebase/GetFirestoreCtrl";
import { updateLikesOf } from "@/src/models/firebase/SetFirestoreCtrl";
import { useChallengeViewModel } from "@/src/viewmodels/components/posts/ChallengeViewModel";

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
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
  getImageUrl: jest.fn(),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  updateLikesOf: jest
    .fn()
    .mockResolvedValue(["challenge123", ["12345", "67890", "user123"]]),
}));

const mockChallenge: DBChallenge = {
  caption: "challengeName",
  challenge_id: "challenge123",
  uid: "user123",
  image_id: "https://example.com/image.jpg",
  likes: ["12345", "67890"],
  challenge_description: "challengeTitle",
};

const currentUser: DBUser = {
  uid: "user123",
  name: "Current User",
  email: "test@test.com",
  createdAt: new Date(),
};

// Test for the use Challenge ViewModel
describe("use Challenge ViewModel", () => {
  // Before each test, mock the console info and clear all mocks
  beforeEach(() => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  // Before all tests, set the system time to a specific date
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1466424490000));
  });

  it("should initialize correctly and fetch user, and likes", async () => {
    // Render the hook with basics values
    const { result } = renderHook(() =>
      useChallengeViewModel({
        challengeDB: mockChallenge,
        currentUser: currentUser,
      }),
    );

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });

    expect(getUser).toHaveBeenCalledWith("user123");
    expect(getLikesOf).toHaveBeenCalledWith("challenge123");
    expect(getCommentsOf).toHaveBeenCalledWith("challenge123");

    expect(result.current.user).toEqual({
      uid: "user123",
      name: "Current User",
      email: "test@test.com",
      createdAt: expect.any(Date),
    });

    expect(result.current.comments).toEqual([
      {
        uid: "12345",
        name: "Test User",
        comment: "This is a test comment",
        created_at: expect.any(Date),
      },
    ]);
  });

  it("should have the right image placeholder", async () => {
    // Render the hook to check default uri
    const { result } = renderHook(() =>
      useChallengeViewModel({
        challengeDB: mockChallenge,
        currentUser: currentUser,
      }),
    );

    await waitFor(() => {
      expect(result.current.image).toBeDefined();
    });

    expect(result.current.image).toEqual(undefined);
  });

  it("handles like actions", async () => {
    const mockHandleLikePress = jest.fn();

    // Render the hook with basics values
    const { result } = renderHook(() =>
      useChallengeViewModel({
        challengeDB: mockChallenge,
        currentUser: currentUser,
      }),
    );

    // Spy on handleLikePress
    const handleLikePressSpy = jest.spyOn(result.current, "handleLikePress");

    await act(async () => {
      await result.current.handleDoubleTap();
      await result.current.handleDoubleTap(); // to call handleLikePress
    });

    expect(updateLikesOf).toHaveBeenCalledWith("challenge123", [
      "12345",
      "67890",
      "user123",
    ]);
  });
});
