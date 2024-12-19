import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import MapScreen from "@/src/views/map/map_screen";

jest.mock("@/src/viewmodels/map/MapScreenViewModel", () => ({
  useMapScreenViewModel: jest.fn(),
}));

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  const MockMapView = (props) => <View {...props} />;
  const MockMapMarker = (props) => <View {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    MapMarker: MockMapMarker,
  };
});

describe("MapScreen UI Tests", () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };
  const mockDate = new Date();
  const mockUser = {
    uid: "123",
    name: "Test User",
    email: "test@gmail.com",
    createdAt: new Date(),
    image_id: null,
  };

  const mockChallenge1 = {
    challenge_id: "1",
    caption: "Challenge 1",
    date: mockDate,
    location: { latitude: 43.6763, longitude: 7.0122 },
  };
  const mockChallenge2 = {
    challenge_id: "2",
    caption: "Challenge 2",
    date: mockDate,
    location: { latitude: 43.7, longitude: 7.015 },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the ViewModel
    require("@/src/viewmodels/map/MapScreenViewModel").useMapScreenViewModel.mockReturnValue(
      {
        permission: true,
        userLocation: {
          coords: {
            latitude: 43.6763,
            longitude: 7.0122,
          },
        },
        challengesWithLocation: [mockChallenge1, mockChallenge2],
      },
    );
  });

  it("should render the map", async () => {
    const { getByTestId } = render(
      <MapScreen
        user={mockUser}
        navigation={mockNavigation}
        route={{ params: { user: mockUser } }}
      />,
    );

    await waitFor(() => {
      expect(getByTestId("map")).toBeDefined();
    });
  });

  it("should render the map markers", async () => {
    const { getByTestId } = render(
      <MapScreen
        user={mockUser}
        navigation={mockNavigation}
        route={{ params: { user: mockUser } }}
      />,
    );

    await waitFor(() => {
      expect(getByTestId("map-marker-0")).toBeDefined();
      expect(getByTestId("map-marker-1")).toBeDefined();
    });
  });
});
