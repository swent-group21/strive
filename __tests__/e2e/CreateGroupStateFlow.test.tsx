import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirestoreCtrl, {
  DBUser,
  DBChallenge,
  DBChallengeDescription,
  DBGroup,
} from "@/src/models/firebase/FirestoreCtrl";
import HomeScreen from "@/src/views/home/home_screen";
import CreateGroupScreen from "@/src/views/group/CreateGroupScreen";
import GroupScreen from "@/src/views/group/GroupScreen";

const Stack = createNativeStackNavigator();

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUser: jest.fn(() => {
        return mockTester;
      }),

      // Mock functions used in group creation
      newGroup: jest.fn((group) => {
        mockFetchedGroups.push(group);
      }),
      addGroupToMemberGroups: jest.fn((id, group_name) => {
        mockTester.groups.push(group_name);
      }),

      // Mock functions used in home and group screens
      getGroupsByUserId: jest.fn((id) => {
        return new Promise<DBGroup[]>((resolve) => {
          resolve(mockFetchedGroups);
        });
      }),

      getAllPostsOfGroup: jest.fn((id) => {
        return mockGroupPosts;
      }),
      getChallengeDescription: jest.fn((id) => {
        return mockCurrentChallenge;
      }),
      getPostsByChallengeTitle: jest.fn((title) => {
        return mockHomePosts;
      }),
    };
  });
});
const mockFirestoreCtrl = new FirestoreCtrl();

// Mock groups fetched in HomeScreen
let mockFetchedGroups = [];

// Mock user testing
let mockTester: DBUser = {
  uid: "123",
  email: "test@example.com",
  name: "TestUser",
  image_id: "uri",
  createdAt: new Date(),
  groups: [],
};
const mockSetTester = jest.fn((user) => {
  mockTester = user;
});

// Mock posts for HomeScreen and GroupScreen
const mockHomePosts: DBChallenge[] = [
  {
    caption: "Home Challenge Test Caption",
    uid: "123",
    challenge_description: "Current Test Challenge Title",
  },
];
const mockGroupPosts: DBChallenge[] = [
  {
    caption: "Group Challenge Test Caption",
    uid: "123456",
    challenge_description: "",
  },
];

const mockCurrentChallenge: DBChallengeDescription = {
  title: "Current Test Challenge Title",
  description: "test Challenge Description",
  endDate: new Date(2099, 1, 1, 0, 0, 0, 0),
};

// Mock location permissions and current position
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }),
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 0,
        longitude: 0,
      },
    }),
  ),
}));

jest.mock("firebase/firestore", () => ({
  GeoPoint: jest.fn((latitude, longitude) => {
    return { latitude, longitude };
  }),
}));

// Create a test component to wrap HomeScreen with navigation
const HomeTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              firestoreCtrl={mockFirestoreCtrl}
              user={mockTester}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="CreateGroup">
          {(props) => (
            <CreateGroupScreen
              {...props}
              firestoreCtrl={mockFirestoreCtrl}
              user={mockTester}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="GroupScreen">
          {(props) => (
            <GroupScreen
              {...props}
              firestoreCtrl={mockFirestoreCtrl}
              user={mockTester}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * Test the flow of creating a group and navigating to it
 */
describe("Create a group and navigate to it", () => {
  it("Creates a group and navigates to it", async () => {
    // Render the test app
    const { getByTestId } = render(<HomeTest />);

    // Verify the user was passed to HomeScreen by the navigation stack
    expect(mockTester).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "TestUser",
      image_id: "uri",
      createdAt: expect.any(Date),
      groups: [],
    });

    // Verify the HomeScreen is diplayed
    expect(getByTestId("home-screen")).toBeTruthy();

    // Simulate user pressing the create group button ("+")
    fireEvent.press(getByTestId("create-group-pressable-button"));

    // Wait for the navigation to CreateGroupScreen
    await waitFor(() => {
      expect(getByTestId("create-group-screen")).toBeTruthy();
    });

    // Make sure the location is authorized and the screen is ready to create a group
    await waitFor(() => {
      expect(getByTestId("Create-Challenge-Text")).toBeTruthy();
    });

    // Simulate user entering a group name
    fireEvent.changeText(getByTestId("Group-Name-Input"), "TestGroup");
    // Simulate user entering a challenge title
    fireEvent.changeText(
      getByTestId("Description-Input"),
      "Challenge Description of Test Group",
    );

    // Simulate user pressing the create group button
    const createPostButton = getByTestId("bottom-right-icon-arrow-forward");
    fireEvent.press(createPostButton);

    // Wait for the navigation to HomeScreen
    await waitFor(() => {
      expect(getByTestId("home-screen")).toBeTruthy();
    });

    // Wait for the new group to be displayed
    await waitFor(() => {
      expect(getByTestId("group-id-TestGroup")).toBeTruthy();
    });

    // Simulate user pressing the new group button
    fireEvent.press(getByTestId("group-pressable-button-TestGroup"));

    // Wait for the navigation to GroupScreen
    await waitFor(() => {
      expect(getByTestId("group-screen")).toBeTruthy();
    });

    // Verify it is the right group
    expect(getByTestId("description-id-TestGroup")).toBeTruthy();
  });
});
