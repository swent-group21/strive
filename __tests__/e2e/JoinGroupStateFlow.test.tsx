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
import JoinGroupScreen from "@/src/views/groups/join_group_screen";
import GroupScreen from "@/src/views/groups/group_screen";
import { GeoPoint } from "firebase/firestore";
import { PermissionResponse } from "expo-modules-core";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import Camera from "@/src/views/camera/CameraContainer";

const Stack = createNativeStackNavigator();

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUser: jest.fn((uid) => {
        if (uid === "123") return mockTester;
        else if (uid === "456") return mockTesterFriend;
      }),

      // Mock functions used in home screen
      getGroupsByUserId: jest.fn((id) => {
        if (id === "123") {
          return new Promise<DBGroup[]>((resolve) => {
            resolve(mockFetchedGroups);
          });
        } else if (id === "456") {
          return new Promise<DBGroup[]>((resolve) => {
            resolve([mockGroup1, mockGroup2]);
          });
        }
      }),
      getChallengeDescription: jest.fn((id) => {
        return mockCurrentChallenge;
      }),
      getPostsByChallengeTitle: jest.fn((title) => {
        return new Promise<DBChallenge[]>((resolve) => {
          resolve(mockHomePosts);
        });
      }),

      // Mock functions used in join group screen
      getGroupSuggestions: jest.fn((uid) => {
        return [mockGroup2];
      }),
      getAllGroups: jest.fn(() => {
        return [mockGroup1, mockGroup2];
      }),

      // Mock functions used in list of filtered groups
      getGroup: jest.fn((gid) => {
        if (gid === "test-group-1-id") return mockGroup1;
        else if (gid === "test-group-2-id") return mockGroup2;
      }),
      addGroupToUser: jest.fn((uid, groupName) => {
        mockTester.groups.push(groupName);
        mockFetchedGroups.push(mockGroup1);
      }),
      addMemberToGroup: jest.fn((gid, uid) => {
        mockGroup1.members.push(uid);
      }),
      updateGroup: jest.fn((gid, date) => {
        mockGroup1.updateDate = date;
      }),

      // Mock functions used in group screen
      getAllPostsOfGroup: jest.fn((id) => {
        return new Promise<DBChallenge[]>((resolve) => {
          resolve(mockGroupPosts);
        });
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
  groups: ["Group Test 2"],
};
const mockTesterFriend: DBUser = {
  uid: "456",
  email: "tester2@example.com",
  name: "TesterFriend",
  image_id: "uri",
  createdAt: new Date(),
  groups: ["Group Test 1", "Group Test 2"],
};

// Mock posts for HomeScreen and GroupScreen
const mockHomePosts: DBChallenge[] = [
  {
    caption: "Home Challenge Test Caption",
    uid: "123",
    challenge_description: "Current Test Challenge Title",
    group_id: "home",
  },
];
const mockGroupPosts: DBChallenge[] = [
  {
    caption: "Group Test 1 Post Caption",
    uid: "456",
    challenge_description: "",
    group_id: "test-group-1-id",
  },
];

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
const mockGroup2: DBGroup = {
  gid: "test-group-2-id",
  name: "Group Test 2",
  members: ["123", "456"],
  challengeTitle: "Current Group 2 Test Challenge",
  updateDate: new Date(),
  location: null,
  radius: 500,
};
// Mock groups fetched in HomeScreen
let mockFetchedGroups: DBGroup[] = [mockGroup2];

const mockCurrentChallenge: DBChallengeDescription = {
  title: "Current Test Challenge Title",
  description: "test Challenge Description",
  endDate: new Date(2099, 1, 1, 0, 0, 0, 0),
};

global.alert = jest.fn();

// Create a test component to wrap HomeScreen with navigation
const Navigation = () => {
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
        <Stack.Screen name="JoinGroup">
          {(props) => (
            <JoinGroupScreen
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
 * Test the flow of joining a group and navigating to it
 * Then, try to create a challenge without being in the group's area
 */
describe("Join a group and fail to post in it", () => {
  it("Joins a group and fails to post in it", async () => {
    // Render the test app
    const { getByTestId } = render(<Navigation />);

    // Verify the user was passed to HomeScreen by the navigation stack
    expect(mockTester).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "TestUser",
      image_id: "uri",
      createdAt: expect.any(Date),
      groups: ["Group Test 2"],
    });

    // Verify the HomeScreen is diplayed
    expect(getByTestId("home-screen")).toBeTruthy();

    // Simulate user pressing the join group button ("+")
    fireEvent.press(getByTestId("join-group-pressable-button"));

    // Wait for the navigation to JoinGroupScreen
    await waitFor(() => {
      expect(getByTestId("join-group-screen")).toBeTruthy();
    });

    // Simulate user searching for a group in the search bar
    fireEvent.changeText(getByTestId("search-bar-input"), "Group Test 1");

    // Wait for the right search results to display
    // (make sure the searched group is not suggested to not create testId conflicts)
    await waitFor(() => {
      expect(getByTestId("group-list-item-Group Test 1")).toBeTruthy();
    });

    // Simulate user joining the group
    fireEvent.press(getByTestId("join-button-Group Test 1"));

    // Wait for the navigation to GroupScreen
    await waitFor(() => {
      expect(getByTestId("group-screen")).toBeTruthy();
    });

    // Verify it is the right group by checking the title
    expect(getByTestId("topTitle-Group Test 1")).toBeTruthy();

    // Simulate user pressing the home button
    fireEvent.press(getByTestId("home-pressable-button"));

    // Wait for the navigation to HomeScreen
    await waitFor(() => {
      expect(getByTestId("home-screen")).toBeTruthy();
    });

    // Verify the user was passed to HomeScreen by the navigation stack
    expect(mockTester).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "TestUser",
      image_id: "uri",
      createdAt: expect.any(Date),
      groups: ["Group Test 2", "Group Test 1"],
    });

    // Wait for the new group to be displayed
    await waitFor(() => {
      expect(getByTestId("group-id-Group Test 1")).toBeTruthy();
    });

    // Simulate user pressing the new group
    fireEvent.press(getByTestId("group-pressable-button-Group Test 1"));

    // Wait for the navigation to GroupScreen
    await waitFor(() => {
      expect(getByTestId("group-screen")).toBeTruthy();
    });
    // Verify it is the right group by checking the title
    expect(getByTestId("topTitle-Group Test 1")).toBeTruthy();

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

    // Wait for the alert to display, saying the user is not in th right location
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "You need to be in the group's area to create a challenge",
      );
    });

    // Wait for the navigation to GroupScreen
    await waitFor(() => {
      expect(getByTestId("group-screen")).toBeTruthy();
    });
  });
});
