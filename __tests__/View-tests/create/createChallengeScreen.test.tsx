import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CreateChallengeScreen from "@/src/views/create/create_challenge";
import CreateChallengeViewModel from "@/src/viewmodels/create/CreateChallengeViewModel";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

jest.mock("@/src/viewmodels/create/CreateChallengeViewModel");

describe("CreateChallengeScreen UI Tests", () => {
  const mockSetCaption = jest.fn();
  const mockToggleLocation = jest.fn();
  const mockMakeChallenge = jest.fn();

  beforeEach(() => {
    (CreateChallengeViewModel as jest.Mock).mockReturnValue({
      challengeCaption: "Test Caption",
      setCaption: mockSetCaption,
      postImage: "Test Image",
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


  it("renders the Challenge Image", () => {
    const { getByTestId } = render(
      <CreateChallengeScreen
        navigation={{}}
        route={{}}
        firestoreCtrl={new FirestoreCtrl()}
      />,
    );

    const challengeImage = getByTestId("challenge-image");
    expect(challengeImage).toBeTruthy();
  });

  it("renders the Challenge Name input", () => {
    const { getByTestId } = render(
      <CreateChallengeScreen
        navigation={{}}
        route={{}}
        firestoreCtrl={new FirestoreCtrl()}
      />,
    );

    const captionInput = getByTestId("Caption-Input");
    expect(captionInput).toBeTruthy();

    fireEvent.changeText(captionInput, "Updated Caption");
    expect(mockSetCaption).toHaveBeenCalledWith("Updated Caption");
  });


  it("renders the Location switch ann text", () => {
    const { getByTestId } = render(
      <CreateChallengeScreen
        navigation={{}}
        route={{}}
        firestoreCtrl={new FirestoreCtrl()}
      />,
    );

    const locationSwitch = getByTestId("switch-button");
    expect(locationSwitch).toBeTruthy();
    expect(getByTestId("location-validation")).toBeTruthy();

    fireEvent(locationSwitch, "onValueChange");
    expect(mockToggleLocation).toHaveBeenCalledTimes(1);
  });


  it("creates a challenge", () => {
    const { getByTestId } = render(
      <CreateChallengeScreen
        navigation={{}}
        route={{}}
        firestoreCtrl={new FirestoreCtrl()}
      />,
    );

    const createButton = getByTestId("bottom-right-icon-arrow-forward");
    
    fireEvent.press(createButton);
    expect(mockMakeChallenge).toHaveBeenCalledTimes(1);
  });

});
