import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
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
import { PermissionResponse } from "expo-camera";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { GeoPoint } from "firebase/firestore";
import Camera from "@/src/views/camera/CameraContainer";

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
        (mockNewGroup = {
          gid: "new-group-id",
          ...group,
        } as DBGroup),
          mockFetchedGroups.push(mockNewGroup);
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
        return new Promise<DBChallenge[]>((resolve) => {
          resolve(mockGroupPosts);
        });
      }),
      getChallengeDescription: jest.fn((id) => {
        return mockCurrentChallenge;
      }),
      getPostsByChallengeTitle: jest.fn((title) => {
        return mockHomePosts;
      }),

      // Mock functions used in camera screen
      uploadImage: jest.fn(() => {}),
      getImageUrl: jest.fn(() => {
        return "testUrl";
      }),
      getGroup: jest.fn((id) => {
        if (id === "new-group-id") return mockNewGroup;
      }),
      newChallenge: jest.fn((challenge) => {
        if (challenge.group_id === "new-group-id") {
          mockGroupPosts.push(challenge);
        } else mockHomePosts.push(challenge);
      }),
    };
  });
});
const mockFirestoreCtrl = new FirestoreCtrl();

// Mock GeoPoint constructor
jest.mock("firebase/firestore", () => ({
  GeoPoint: jest.fn((latitude, longitude) => {
    return { latitude, longitude };
  }),
}));

// Mock Camera used to post
jest.mock("expo-camera", () => ({
  Camera: jest.fn(() => {
    return {
      takePictureAsync: jest.fn(() => {
        return {
          uri: "testUri",
        };
      }),
    };
  }),
  useCameraPermissions: jest.fn(() => {
    const requestPermission = () => {
      console.log("request permission called");
      return Promise.resolve({ status: "granted" });
    };
    const permission: PermissionResponse = {
      canAskAgain: true,
      expires: null,
      granted: true,
      status: null,
    };
    return [permission, requestPermission];
  }),
  CameraCapturedPicture: jest.fn(() => {
    return {
      uri: "testUri",
    };
  }),
  CameraView: jest.fn(() => <ThemedView />),
}));

// Mock location permissions and current position
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }),
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 46.5231352,
        longitude: 6.5647066,
      },
    }),
  ),
}));

// Mock user testing
let mockTester: DBUser = {
  uid: "123",
  email: "test@example.com",
  name: "TestUser",
  image_id: "uri",
  createdAt: new Date(),
  groups: ["Group Test 1"],
};

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

// Mock current challenge Title fetched from Firestore
const mockCurrentChallenge: DBChallengeDescription = {
  title: "Current Test Challenge Title",
  description: "test Challenge Description",
  endDate: new Date(2099, 1, 1, 0, 0, 0, 0),
};

// Mock groups used for the test
const mockGroup1: DBGroup = {
  gid: "test-group-1-id",
  name: "Group Test 1",
  members: ["456"],
  challengeTitle: "Current Group 1 Test Challenge",
  updateDate: new Date(),
  location: new GeoPoint(46.5186495, 10.5687462),
  radius: 32000,
};
// Mock groups fetched in HomeScreen
let mockFetchedGroups = [mockGroup1];
let mockNewGroup: DBGroup = undefined;

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
        <Stack.Screen name="Camera">
          {(props: any) => (
            <Camera
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
      groups: ["Group Test 1"],
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
    fireEvent.changeText(getByTestId("Group-Name-Input"), "New Group");
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
      expect(getByTestId("group-id-New Group")).toBeTruthy();
    });

    // Simulate user pressing the new group button
    fireEvent.press(getByTestId("group-pressable-button-New Group"));

    // Wait for the navigation to GroupScreen
    await waitFor(() => {
      expect(getByTestId("group-screen")).toBeTruthy();
    });

    // Verify it is the right group
    expect(getByTestId("description-id-New Group")).toBeTruthy();

    // Simulate user pressing the camera button
    fireEvent.press(getByTestId("bottom-center-icon-camera-outline"));

    // Wait for the navigation to CameraScreen
    await waitFor(() => {
      expect(getByTestId("camera-screen")).toBeTruthy();
    });

    // Make sure the location is authorized and camera is enabled at first
    await waitFor(() => {
      expect(getByTestId("camera-container")).toBeTruthy();
    });

    // Simulate user pressing the camera button to take a picture
    fireEvent.press(getByTestId("Camera-Button"));
    // Wait for isCameraEnabled to be set to false
    await act(async () => {
      await Promise.resolve();
    });
    // Verify the camera is disabled and the preview is displayed
    expect(getByTestId("camera-preview")).toBeTruthy();

    // Simulate user changing the caption
    fireEvent.changeText(
      getByTestId("Caption-Input"),
      "Test Challenge Caption",
    );

    // Simulate user pressing the submit button
    fireEvent.press(getByTestId("Submit-Button"));

    // Wait for the navigation to HomeScreen
    await waitFor(() => {
      expect(getByTestId("group-screen")).toBeTruthy();
    });

    // Verify it is the right group
    expect(getByTestId("description-id-New Group")).toBeTruthy();

    // Wait for the new challenge to be fetched
    await act(async () => {
      await Promise.resolve();
    });

    // Verify the new challenge was posted
    expect(getByTestId("challenge-id-Test Challenge Caption")).toBeTruthy();
  });
});
