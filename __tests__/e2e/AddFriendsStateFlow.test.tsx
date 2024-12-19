import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirestoreCtrl, {
  DBUser,
  DBChallenge,
  DBChallengeDescription,
  DBGroup,
  DBComment,
} from "@/src/models/firebase/FirestoreCtrl";
import HomeScreen from "@/src/views/home/home_screen";
import FriendsScreen from "@/src/views/friends/friends_screen";
import MaximizeScreen from "@/src/views/home/maximize_screen";

const Stack = createNativeStackNavigator();

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
  return jest.fn().mockImplementation(() => {
    return {
      // Mock functions used in home screen
      getGroupsByUserId: jest.fn((id) => {
        if (id === "123") {
          return new Promise<DBGroup[]>((resolve) => {
            resolve([mockTesterGroup]);
          });
        } else if (id === "456") {
          return new Promise<DBGroup[]>((resolve) => {
            resolve([mockTesterFriendGroup]);
          });
        }
      }),
      getChallengeDescription: jest.fn((id) => {
        return mockCurrentChallenge;
      }),
      getPostsByChallengeTitle: jest.fn((title) => {
        return new Promise<DBChallenge[]>((resolve) => {
          resolve([mockPostTesterFriend]);
        });
      }),

      // Mock functions used in friends screen
      getAllUsers: jest.fn(() => {
        return [mockTester, mockTesterFriend];
      }),
      addFriend: jest.fn((uid, friendUid) => {
        if (uid === "123" && friendUid === "456") {
          mockTester.friends.push(friendUid);
        } else if (uid === "456" && friendUid === "123") {
          mockTesterFriend.friends.push(friendUid);
        }
      }),
      acceptFriend: jest.fn((uid, friendUid) => {
        if (uid === "456" && friendUid === "123") {
          mockTesterFriend.friends.push(friendUid);
        } else if (uid === "123" && friendUid === "456") {
          mockTester.friends.push(friendUid);
        }
      }),
      getFriendSuggestions: jest.fn((uid) => {
        if (uid === "123") {
          return [];
        } else if (uid === "456") {
          return [mockTester];
        }
      }),
      getFriends: jest.fn((uid) => {}),
      getFriendRequests: jest.fn((uid) => {
        if (uid === "456") {
          return [mockTester];
        } else return [];
      }),
      isFriend: jest.fn((uid, friendUid) => {
        if (!isRequestSent) {
          return false;
        } else {
          if (mockTester.friends.includes(friendUid)) {
            return true;
          }
        }
      }),
      isRequested: jest.fn((uid, friendUid) => {
        if (!isRequestSent) {
          return false;
        } else {
          if (uid === "456") {
            return true;
          }
        }
      }),

      // Mock functions used in maximize screen
      getCommentsOf: jest.fn((challenge_id) => {
        return new Promise<DBComment[]>((resolve) => {
          resolve(mockPostComments);
        });
      }),
      addComment: jest.fn(() => {}),
      updateLikesOf: jest.fn((challenge_id, likes) => {
        mockPostLikes = likes;
      }),
      getLikesOf: jest.fn((challenge_id) => {
        return new Promise<string[]>((resolve) => {
          resolve(mockPostLikes);
        });
      }),

      getUser: jest.fn((uid) => {
        if (uid === "123") {
          return new Promise<DBUser[]>((resolve) => {
            resolve([mockTester]);
          });
        } else if (uid === "456") {
          return new Promise<DBUser[]>((resolve) => {
            resolve([mockTesterFriend]);
          });
        }
      }),
    };
  });
});
const mockFirestoreCtrl = new FirestoreCtrl();

// Mock groups fetched in HomeScreen
let mockFetchedGroups = [];

// Mock users testing
let mockTester: DBUser = {
  uid: "123",
  email: "tester@example.com",
  name: "TesterUser",
  image_id: "uri",
  createdAt: new Date(),
  friends: [],
};
let mockTesterFriend: DBUser = {
  uid: "456",
  email: "friend@example.com",
  name: "TesterFriend",
  image_id: "uri",
  createdAt: new Date(),
  friends: [],
};
let isRequestSent = false;

// Mock posts for HomeScreen for users
let mockTesterGroup: DBGroup = {
  name: "TesterGroup",
  challengeTitle: "TesterGroupChallenge",
  members: ["123"],
  updateDate: new Date(),
  location: null,
  radius: 0,
};
let mockTesterFriendGroup: DBGroup = {
  name: "FriendGroup",
  challengeTitle: "TesterFriendGroupChallenge",
  members: ["456"],
  updateDate: new Date(),
  location: null,
  radius: 0,
};

// Mock post for HomeScreen
const mockPostTesterFriend: DBChallenge = {
  caption: "Home Challenge Test Caption",
  uid: "456",
  challenge_description: "Current Test Challenge Title",
};
const mockPostComments: DBComment[] = [];
let mockPostLikes: string[] = [];

// Mock current challenge for HomeScreen
const mockCurrentChallenge: DBChallengeDescription = {
  title: "Current Test Challenge Title",
  description: "test Challenge Description",
  endDate: new Date(2099, 1, 1, 0, 0, 0, 0),
};

// Create a test component to wrap HomeScreen with navigation
// to simulate the navigation of the TesterUser
const TesterNavigation = () => {
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
        <Stack.Screen name="Friends">
          {(props) => (
            <FriendsScreen
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

// Create a test component to wrap HomeScreen with navigation
// to simulate the navigation of the Friend
const FriendNavigation = () => {
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
              user={mockTesterFriend}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Friends">
          {(props) => (
            <FriendsScreen
              {...props}
              firestoreCtrl={mockFirestoreCtrl}
              user={mockTesterFriend}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Create a test component to wrap HomeScreen with navigation
// to simulate the navigation of the TesterUser
const TesterNavigation2 = () => {
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
        <Stack.Screen name="Maximize">
          {(props) => (
            <MaximizeScreen
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
 * Test the flow of sending a friend request and commenting a friend's post
 */
describe("Send a friend request that is accepted and comment a friend's post", () => {
  it("Sends a friend request that is accepted and comments a friend's post", async () => {
    // Render the test app for the tester user
    const testerNavigation = render(<TesterNavigation />);

    // Verify the user was passed to HomeScreen by the navigation stack
    expect(mockTester).toEqual({
      uid: "123",
      email: "tester@example.com",
      name: "TesterUser",
      image_id: "uri",
      createdAt: expect.any(Date),
      friends: [],
    });

    // Verify the HomeScreen is diplayed
    expect(testerNavigation.getByTestId("home-screen")).toBeTruthy();

    // Simulate user pressing the friends button
    fireEvent.press(testerNavigation.getByTestId("topLeftIcon-people-outline"));

    // Wait for the navigation to FriendsScreen
    await waitFor(() => {
      expect(testerNavigation.getByTestId("friendsScreen")).toBeTruthy();
    });

    // Simulate user searching for a friend in the search bar
    fireEvent.changeText(
      testerNavigation.getByTestId("search-bar-input"),
      "TesterFriend",
    );

    // Wait for the right search results to display
    // (make sure the searched user is not suggested to not create testId conflicts)
    await waitFor(() => {
      expect(
        testerNavigation.getByTestId("user-list-item-TesterFriend"),
      ).toBeTruthy();
    });

    // Simulate user adding the friend
    fireEvent.press(testerNavigation.getByTestId("handle-button-TesterFriend"));
    isRequestSent = true;

    // Render the test app for the friend user
    const friendNavigation = render(<FriendNavigation />);

    // Verify the user was passed to HomeScreen by the navigation stack
    expect(mockTesterFriend).toEqual({
      uid: "456",
      email: "friend@example.com",
      name: "TesterFriend",
      image_id: "uri",
      createdAt: expect.any(Date),
      friends: [],
    });

    // Verify the HomeScreen is diplayed
    expect(friendNavigation.getByTestId("home-screen")).toBeTruthy();

    // Simulate friend user pressing the friends button
    fireEvent.press(friendNavigation.getByTestId("topLeftIcon-people-outline"));

    // Wait for the navigation to FriendsScreen
    await waitFor(() => {
      expect(friendNavigation.getByTestId("friendsScreen")).toBeTruthy();
    });

    // Simulate friend user accepting the request from tester user
    fireEvent.press(friendNavigation.getByTestId("accept-button-TesterUser"));

    // Render again the test app for the tester user
    const testerNavigation2 = render(<TesterNavigation2 />);

    // Wait for the useEffects to run
    await act(async () => {
      await Promise.resolve();
    });

    // Verify the user was passed to HomeScreen by the navigation stack
    expect(mockTester).toEqual({
      uid: "123",
      email: "tester@example.com",
      name: "TesterUser",
      image_id: "uri",
      createdAt: expect.any(Date),
      friends: ["456"],
    });

    // Verify the HomeScreen is diplayed
    expect(testerNavigation2.getByTestId("home-screen")).toBeTruthy();

    // Simulate user displaying only its friends' posts
    fireEvent.press(testerNavigation2.getByTestId("friends-button"));

    // Verify the Friend's post is displayed
    expect(testerNavigation2.getByTestId("challenge-id-0")).toBeTruthy();

    // Simulate user wanting to comment the friend's post
    fireEvent.press(testerNavigation2.getByTestId("add-a-comment"));

    // Wait for the navigation to MaximizeScreen
    await waitFor(() => {
      expect(testerNavigation2.getByTestId("maximize-screen")).toBeTruthy();
    });

    // Simulate user liking the post
    fireEvent.press(testerNavigation2.getByTestId("like-button"));

    // Simulate user commenting the post
    fireEvent.changeText(
      testerNavigation2.getByTestId("comment-input"),
      "Test Comment",
    );
    // Wait for comment Text to be modified
    await act(async () => {
      await Promise.resolve();
    });

    // Simulate user sending the comment
    fireEvent.press(testerNavigation2.getByTestId("send-comment-button"));

    // Wait for the comment to display
    await waitFor(() => {
      expect(
        testerNavigation2.getByTestId("comment-container-Test Comment"),
      ).toBeTruthy();
    });
  });
});
