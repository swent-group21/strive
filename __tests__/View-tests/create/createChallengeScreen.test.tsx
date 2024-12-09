import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CreateChallengeScreen from "@/src/views/create/create_challenge";
import CreateChallengeViewModel from "@/src/viewmodels/create/CreateChallengeViewModel";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/src/viewmodels/create/CreateChallengeViewModel");

describe("CreateChallengeScreen UI Tests", () => {
  const mockSetChallengeName = jest.fn();
  const mockSetDescription = jest.fn();
  const mockToggleLocation = jest.fn();
  const mockMakeChallenge = jest.fn();

  beforeEach(() => {
    (CreateChallengeViewModel as jest.Mock).mockReturnValue({
      challengeName: "Test Challenge",
      setChallengeName: mockSetChallengeName,
      description: "Test Description",
      setDescription: mockSetDescription,
      isLocationEnabled: true,
      toggleLocation: mockToggleLocation,
      makeChallenge: mockMakeChallenge,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Create Challenge screen", () => {
    const { getByTestId } = render(
      <CreateChallengeScreen
        navigation={{}}
        route={{}}
        firestoreCtrl={new FirestoreCtrl()}
      />,
    );

    const screenTitle = getByTestId("Create-Challenge-Text");
    expect(screenTitle).toBeTruthy();
  });

  it("renders the Challenge Name input", () => {
    const { getByTestId } = render(
      <CreateChallengeScreen
        navigation={{}}
        route={{}}
        firestoreCtrl={new FirestoreCtrl()}
      />,
    );

    const nameInput = getByTestId("Challenge-Name-Input");
    expect(nameInput).toBeTruthy();

    fireEvent.changeText(nameInput, "Updated Challenge Name");
    expect(mockSetChallengeName).toHaveBeenCalledWith("Updated Challenge Name");
  });

  it("renders the Description input", () => {
    const { getByTestId } = render(
      <CreateChallengeScreen
        navigation={{}}
        route={{}}
        firestoreCtrl={new FirestoreCtrl()}
      />,
    );

    const descriptionInput = getByTestId("Description-Input");
    expect(descriptionInput).toBeTruthy();

    fireEvent.changeText(descriptionInput, "Updated Description");
    expect(mockSetDescription).toHaveBeenCalledWith("Updated Description");
  });
});
