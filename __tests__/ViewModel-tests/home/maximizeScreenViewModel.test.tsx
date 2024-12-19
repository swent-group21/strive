import { renderHook, act, waitFor } from "@testing-library/react-native";
import { DBChallenge, DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import { useMaximizeScreenViewModel } from "@/src/viewmodels/home/MaximizeScreenViewModel";
import * as GetFirestoreCtrl from "@/src/models/firebase/GetFirestoreCtrl";
import * as SetFirestoreCtrl from "@/src/models/firebase/SetFirestoreCtrl";

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getUser: jest.fn().mockResolvedValue({
    uid: "12345",
    name: "Test User",
    email: "test@example.com",
  }),
  getLikesOf: jest.fn().mockResolvedValue(["12345", "67890"]),
  getCommentsOf: jest.fn().mockResolvedValue([
    {
      comment_text: "This is a test comment",
      user_name: "Test User",
      created_at: new Date(),
      post_id: "1",
    },
  ]),
  getImageUrl: jest.fn(),
}));

jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  updateLikesOf: jest.fn(),
  appendComment: jest.fn().mockResolvedValue(true),
}));

// Mock user and challenge
const mockUser: DBUser = {
  uid: "12345",
  name: "Test User",
  email: "test@example.com",
  createdAt: new Date(),
};
const mockChallenge: DBChallenge = {
  challenge_id: "1",
  caption: "Test Challenge",
  uid: "54321",
  date: new Date(),
  image_id: "test-image-id",
  challenge_description: "Challenge description",
};

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe("useMaximizeScreenViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize correctly and fetch user, comments, and likes", async () => {
    const { result } = renderHook(() =>
      useMaximizeScreenViewModel(mockUser, mockChallenge, mockNavigation),
    );

    await waitFor(() => {
      expect(result.current.postUser).toBeDefined();
    });

    expect(GetFirestoreCtrl.getUser).toHaveBeenCalledWith("54321");
    expect(GetFirestoreCtrl.getCommentsOf).toHaveBeenCalledWith("1");
    expect(GetFirestoreCtrl.getLikesOf).toHaveBeenCalledWith("1");

    expect(result.current.postUser).toEqual({
      uid: "12345",
      name: "Test User",
      email: "test@example.com",
    });

    expect(result.current.commentList).toEqual([
      {
        comment_text: "This is a test comment",
        user_name: "Test User",
        created_at: expect.any(Date),
        post_id: "1",
      },
    ]);

    expect(result.current.likeList).toEqual(["12345", "67890"]);
    expect(result.current.isLiked).toBe(true);
  });

  it("should toggle like and update the like list", async () => {
    const { result } = renderHook(() =>
      useMaximizeScreenViewModel(mockUser, mockChallenge, mockNavigation),
    );

    await waitFor(() => {
      result.current.toggleLike();
    });

    expect(result.current.isLiked).toBe(true);
    expect(result.current.likeList).toEqual(["12345", "67890"]);

    await waitFor(() => {
      result.current.toggleLike();
    });

    expect(result.current.isLiked).toBe(false);
    expect(result.current.likeList).toEqual(["67890"]);
    expect(SetFirestoreCtrl.updateLikesOf).toHaveBeenCalledWith("1", ["12345"]);
  });

  it("should add a comment and update the comment list", async () => {
    jest
      .spyOn(SetFirestoreCtrl, "appendComment")
      .mockImplementationOnce((): Promise<any> => Promise.resolve(undefined));

    const { result } = renderHook(() =>
      useMaximizeScreenViewModel(mockUser, mockChallenge, mockNavigation),
    );

    act(() => {
      result.current.setCommentText("New comment");
    });

    await act(async () => {
      await result.current.addComment();
    });

    expect(SetFirestoreCtrl.appendComment).toHaveBeenCalledWith({
      comment_text: "New comment",
      user_name: "Test User",
      created_at: expect.any(Date),
      post_id: "1",
      uid: "12345",
    });

    expect(result.current.commentList).toEqual([
      {
        comment_text: "New comment",
        user_name: "Test User",
        created_at: expect.any(Date),
        post_id: "1",
        uid: "12345",
      },
    ]);

    expect(result.current.commentText).toBe("");
  });

  it("should handle navigation correctly with navigateGoBack", async () => {
    const { result } = renderHook(() =>
      useMaximizeScreenViewModel(mockUser, mockChallenge, mockNavigation),
    );

    await waitFor(() => {
      result.current.navigateGoBack();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("should handle no comments gracefully", async () => {
    jest
      .spyOn(GetFirestoreCtrl, "getCommentsOf")
      .mockImplementationOnce((): Promise<any> => Promise.resolve([]));

    const { result } = renderHook(() =>
      useMaximizeScreenViewModel(mockUser, mockChallenge, mockNavigation),
    );

    await waitFor(() => {
      expect(result.current.commentList).toEqual([]);
    });
  });

  it("should handle no likes gracefully", async () => {
    jest
      .spyOn(GetFirestoreCtrl, "getLikesOf")
      .mockImplementationOnce((): Promise<any> => Promise.resolve([]));

    const { result } = renderHook(() =>
      useMaximizeScreenViewModel(mockUser, mockChallenge, mockNavigation),
    );

    await waitFor(() => {
      expect(result.current.likeList).toEqual([]);
      expect(result.current.isLiked).toBe(false);
    });
  });

  it("should update post details correctly", async () => {
    const { result } = renderHook(() =>
      useMaximizeScreenViewModel(mockUser, mockChallenge, mockNavigation),
    );

    await waitFor(() => {
      expect(result.current.postCaption).toBe("Test Challenge");
      expect(result.current.postDate).toBe(mockChallenge.date);
    });
  });
});
