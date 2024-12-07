/*describe("MaximiseScreen Component", () => {
  test("always passes", () => {
    expect(true).toBe(true);
  });
});*/

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MaximizeScreen from "@/src/views/home/maximize_screen";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/src/viewmodels/home/MaximizeScreenViewModel", () => ({
  useMaximizeScreenViewModel: jest.fn(),
}));

const mockTimestamp = {
  toDate: jest.fn().mockReturnValue("2024-01-01T00:00:00Z"),
};

describe("MaximizeScreen UI Tests", () => {
  const mockNavigation = { goBack: jest.fn(), navigate: jest.fn() };
  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockChallenge = {
    challenge_id: "challenge123",
    uid: "user456",
    caption: "Test Challenge",
    image_id: "test_image",
    created_at: new Date("2024-01-01T00:00:00Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the ViewModel
    require("@/src/viewmodels/home/MaximizeScreenViewModel").useMaximizeScreenViewModel.mockReturnValue(
      {
        commentText: "",
        setCommentText: jest.fn(),
        commentList: [
          {
            comment_text: "This is a comment",
            user_name: "Test User",
            created_at: mockTimestamp,
          },
        ],
        postUser: { name: "Post User" },
        likeList: ["user123"],
        isLiked: false,
        toggleLike: jest.fn(),
        addComment: jest.fn(),
        postDate: new Date("2024-01-01T00:00:00Z"),
        postTitle: "Test Challenge",
        postCaption: "test_image",
      },
    );
  });

  it("renders the MaximizeScreen with comments and likes", () => {
    const { getByTestId } = render(
      <MaximizeScreen
        user={{
          uid: "12345",
          name: "Test User",
          email: "test@gmail.com",
          createdAt: new Date(),
          image_id: null,
        }}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    expect(getByTestId("caption-id")).toBeTruthy();
    expect(getByTestId("comment-text")).toBeTruthy();
  });

  it("handles liking a post", () => {
    const { getByTestId } = render(
      <MaximizeScreen
        user={{
          uid: "12345",
          name: "Test User",
          email: "test@gmail.com",
          createdAt: new Date(),
          image_id: null,
        }}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    fireEvent.press(getByTestId("like-button"));
    const toggleLike =
      require("@/src/viewmodels/home/MaximizeScreenViewModel").useMaximizeScreenViewModel()
        .toggleLike;
    expect(toggleLike).toHaveBeenCalled();
  });

  it("handles adding a comment", () => {
    const { getByTestId } = render(
      <MaximizeScreen
        user={{
          uid: "12345",
          name: "Test User",
          email: "test@gmail.com",
          createdAt: new Date(),
          image_id: null,
        }}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    const addComment =
      require("@/src/viewmodels/home/MaximizeScreenViewModel").useMaximizeScreenViewModel()
        .addComment;

    const input = getByTestId("comment-input");
    fireEvent.changeText(input, "New Comment");
    fireEvent.press(getByTestId("send-comment"));
    expect(addComment).toHaveBeenCalled();
  });
});
