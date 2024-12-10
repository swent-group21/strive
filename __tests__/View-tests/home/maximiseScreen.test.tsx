import React from "react";
import { render } from "@testing-library/react-native";
import MaximizeScreen from "@/src/views/home/maximize_screen";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/src/viewmodels/home/MaximizeScreenViewModel", () => ({
  useMaximizeScreenViewModel: jest.fn(),
}));

describe("MaximizeScreen UI Tests", () => {
  const mockNavigation = { goBack: jest.fn(), navigate: jest.fn() };
  const mockFirestoreCtrl = new FirestoreCtrl();
  const mockChallenge = {
    challenge_id: "challenge123",
    uid: "user456",
    caption: "Test Challenge",
    image_id: "test_image",
    created_at: new Date("2024-01-01T00:00:00Z"),
    description: "Test Description",
    group_id: "group123",
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
            created_at: new Date("2024-01-01T00:00:00Z"),
          },
          {
            comment_text: "Another comment",
            user_name: "Another User",
            created_at: new Date("2024-01-01T00:00:00Z"),
          },
        ],
        postUser: { name: "Post User" },
        likeList: ["user123"],
        isLiked: false,
        toggleLike: jest.fn(),
        addComment: jest.fn(),
        postDate: new Date("2024-01-01T00:00:00Z"),
        postImage: "test_image",
        postCaption: "Test Challenge",
        navigateGoBack: jest.fn(),
        userProfilePicture: "test_pp",
      },
    );
  });

  it("renders the MaximizeScreen with comments and likes", () => {
    const { getByText } = render(
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

    expect(getByText("Test Challenge")).toBeTruthy();
    expect(getByText("This is a comment")).toBeTruthy();
    expect(getByText("Another comment")).toBeTruthy();
  });

  // it("handles liking a post", () => {
  //   const { getByText } = render(
  //     <MaximizeScreen
  //       user={{ uid: "12345", name: "Test User", email: "test@gmail.com", createdAt: new Date(), image_id: null }}
  //       navigation={mockNavigation}
  //       route={{ params: { challenge: mockChallenge } }}
  //       firestoreCtrl={mockFirestoreCtrl}
  //     />
  //   );

  //   fireEvent.press(getByText("heart-outline"));
  //   const toggleLike = require("@/src/viewmodels/home/MaximizeScreenViewModel").useMaximizeScreenViewModel()
  //     .toggleLike;
  //   expect(toggleLike).toHaveBeenCalled();
  // });

  // it("handles adding a comment", () => {
  //   const { getByText, getByPlaceholderText } = render(
  //     <MaximizeScreen
  //       user={{ uid: "12345", name: "Test User", email: "test@gmail.com", createdAt: new Date(), image_id: null }}
  //       navigation={mockNavigation}
  //       route={{ params: { challenge: mockChallenge } }}
  //       firestoreCtrl={mockFirestoreCtrl}
  //     />
  //   );

  //   const addComment = require("@/src/viewmodels/home/MaximizeScreenViewModel").useMaximizeScreenViewModel()
  //     .addComment;

  //   const input = getByPlaceholderText("Write a comment...");
  //   fireEvent.changeText(input, "New Comment");
  //   fireEvent.press(getByText("send"));
  //   expect(addComment).toHaveBeenCalled();
  // });

  // it("handles navigation back", () => {
  //   const { getByText } = render(
  //     <MaximizeScreen
  //       user={{ uid: "12345", name: "Test User", email: "test@gmail.com", createdAt: new Date(), image_id: null }}
  //       navigation={mockNavigation}
  //       route={{ params: { challenge: mockChallenge } }}
  //       firestoreCtrl={mockFirestoreCtrl}
  //     />
  //   );

  //   fireEvent.press(getByText("arrow-back-outline"));
  //   expect(mockNavigation.goBack).toHaveBeenCalled();
  // });
});
