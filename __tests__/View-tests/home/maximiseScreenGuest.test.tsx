import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MaximizeScreen from "@/src/views/home/maximize_screen";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/src/viewmodels/home/MaximizeScreenViewModel", () => ({
  useMaximizeScreenViewModel: jest.fn(),
}));

describe("MaximizeScreen - Guest User Restrictions", () => {
  const mockNavigation = { goBack: jest.fn(), navigate: jest.fn() };
  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockChallenge = {
    challenge_id: "challenge123",
    uid: "user456",
    challenge_name: "Test Challenge",
    description: "Test Description",
    image_id: "test_image",
    created_at: new Date("2024-01-01T00:00:00Z"),
  };
  const mockUser = {
    uid: "user-1",
    name: "Guest",
    email: "guest@gmail.com",
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    require("@/src/viewmodels/home/MaximizeScreenViewModel").useMaximizeScreenViewModel.mockReturnValue(
      {
        commentText: "",
        setCommentText: jest.fn(),
        commentList: [],
        postUser: { name: "Post User" },
        likeList: [],
        isLiked: false,
        toggleLike: jest.fn(),
        addComment: jest.fn(),
        postDate: new Date("2024-01-01T00:00:00Z"),
        postTitle: "Test Challenge",
        postImage: "test_image",
        postDescription: "Test Description",
        showGuestPopup: jest.fn(),
        setShowGuestPopup: jest.fn(),
        handleUserInteraction: jest.fn(),
      },
    );
  });

  it("shows a popup when guest user tries to like", () => {
    jest
      .spyOn(
        require("@/src/viewmodels/home/MaximizeScreenViewModel"),
        "useMaximizeScreenViewModel",
      )
      .mockReturnValue({
        commentText: "",
        setCommentText: jest.fn(),
        commentList: [],
        postUser: { name: "Post User" },
        likeList: [],
        isLiked: false,
        toggleLike: jest.fn(),
        addComment: jest.fn(),
        postDate: new Date("2024-01-01T00:00:00Z"),
        postTitle: "Test Challenge",
        postImage: "test_image",
        postDescription: "Test Description",
        showGuestPopup: "like",
        setShowGuestPopup: jest.fn(),
        handleUserInteraction: jest.fn(),
      });

    const { getByTestId, getByText } = render(
      <MaximizeScreen
        user={mockUser}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    fireEvent.press(getByTestId("like-button"));

    expect(getByText("Sign up to like this post!")).toBeTruthy();
  });

  it("shows a popup when guest user tries to comment", () => {
    const { getByTestId, getByText } = render(
      <MaximizeScreen
        user={mockUser}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    fireEvent.press(getByTestId("send-comment-button"));

    expect(getByText("Sign up to comment on this post!")).toBeTruthy();
  });

  it("navigates to SignUp when clicking 'Sign Up' button in the popup", () => {
    const { getByTestId, getByText } = render(
      <MaximizeScreen
        user={mockUser}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    fireEvent.press(getByTestId("like-button"));
    fireEvent.press(getByText("Sign Up"));

    expect(mockNavigation.navigate).toHaveBeenCalledWith("SignUp");
  });

  it("closes the popup when clicking 'Close' button", () => {
    const { getByTestId, getByText, queryByText } = render(
      <MaximizeScreen
        user={mockUser}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    fireEvent.press(getByTestId("like-button"));
    fireEvent.press(getByText("Close"));

    expect(queryByText("Sign up to like this post!")).toBeNull();
  });

  it("shows a popup when guest tried to double tap like", () => {
    jest
      .spyOn(
        require("@/src/viewmodels/home/MaximizeScreenViewModel"),
        "useMaximizeScreenViewModel",
      )
      .mockReturnValue({
        commentText: "",
        setCommentText: jest.fn(),
        commentList: [],
        postUser: { name: "Post User" },
        likeList: [],
        isLiked: false,
        toggleLike: jest.fn(),
        addComment: jest.fn(),
        postDate: new Date("2024-01-01T00:00:00Z"),
        postTitle: "Test Challenge",
        postImage: "test_image",
        postDescription: "Test Description",
        showGuestPopup: "like",
        setShowGuestPopup: jest.fn(),
        handleUserInteraction: jest.fn(),
      });

    const { getByTestId, getByText } = render(
      <MaximizeScreen
        user={mockUser}
        navigation={mockNavigation}
        route={{ params: { challenge: mockChallenge } }}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    const postImage = getByTestId("post-image");
    fireEvent.press(postImage);
    fireEvent.press(postImage);

    expect(getByText("Sign up to like this post!")).toBeTruthy();
  });
});
