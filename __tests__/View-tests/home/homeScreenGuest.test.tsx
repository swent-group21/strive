import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import HomeScreen from "@/src/views/home/home_screen";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

// Mock du ViewModel
jest.mock("@/src/viewmodels/home/HomeScreenViewModel", () => ({
  useHomeScreenViewModel: jest.fn(),
}));

jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => ({
    getChallengeDescription: jest.fn().mockResolvedValue({
      Title: "Mock Challenge",
      Description: "Mock Description",
      endDate: new Date(2024, 1, 1),
    }),
    getKChallenges: jest.fn().mockResolvedValue([
      {
        uid: "1",
        challenge_name: "Challenge 1",
        description: "Description 1",
        challenge_id: "1",
      },
      {
        uid: "2",
        challenge_name: "Challenge 2",
        description: "Description 2",
        challenge_id: "2",
      },
    ]),
    getGroupsByUserId: jest
      .fn()
      .mockResolvedValue([{ id: "1", name: "Group 1" }]),
    updateLikesOf: jest.fn(),
  }));
});

const mockNavigation = { navigate: jest.fn() };
const mockFirestoreCtrl = new FirestoreCtrl();
const mockUseHomeScreenViewModel =
  require("@/src/viewmodels/home/HomeScreenViewModel").useHomeScreenViewModel;

describe("HomeScreen - Guest User", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHomeScreenViewModel.mockReturnValue({
      userIsGuest: true,
      challenges: [
        ...Array(10).fill({
          uid: "user1",
          challenge_name: "Challenge",
          description: "Challenge Description",
          challenge_id: "1",
        }),
      ],
      groups: [],
      titleChallenge: {
        title: "Current Challenge",
        description: "Current Challenge Description",
        endDate: new Date(2024, 1, 1),
      },
    });
  });

  it("renders the guest footer after 10 challenges", async () => {
    const { getByText, queryByTestId } = render(
      <HomeScreen
        user={{ name: "Guest", uid: "", email: "", createdAt: new Date() }}
        navigation={mockNavigation}
        firestoreCtrl={mockFirestoreCtrl}
      />,
    );

    await waitFor(() => {
      // Vérifie que 10 challenges sont affichés
      expect(queryByTestId("challenge-id-9")).toBeTruthy();
      expect(queryByTestId("challenge-id-10")).toBeFalsy();

      // Vérifie la présence du bouton "Create an Account"
      expect(getByText("Sign Up")).toBeTruthy();
    });

    // Simule un clic sur le bouton
    fireEvent.press(getByText("Sign Up"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("SignUp");
  });
});
