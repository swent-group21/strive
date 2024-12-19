import { logInWithEmail, signUpWithEmail } from "@/types/Auth";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "@/src/views/auth/sign_in_screen";
import HomeScreen from "@/src/views/home/home_screen";
import SignUp from "@/src/views/auth/sign_up_screen";
import SetUsernameScreen from "@/src/views/auth/set_up_screen";
import ProfileScreen from "@/src/views/home/profile_screen";
import { setName } from "@/src/models/firebase/SetFirestoreCtrl";

const Stack = createNativeStackNavigator();

jest.mock("@/types/Auth", () => ({
  logInWithEmail: jest.fn((email, password, navigation, setUser) => {
    setUser({
      uid: "123",
      email: email,
      name: "Test User",
      createdAt: new Date(),
    });
    navigation.navigate("Home");
  }),
  signUpWithEmail: jest.fn((name, email, password, navigation, setUser) => {
    setUser({
      uid: "123",
      email: email,
      name: name,
      createdAt: new Date(),
    });
    navigation.navigate("Home");
  }),
  isValidEmail: jest.fn((email) => true),
}));

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/SetFirestoreCtrl", () => ({
  setProfilePicture: jest.fn((id, image_uri, setUser) => {
    setUser({
      ...mockUserFull,
      image_id: image_uri,
    });
  }),
  setName: jest.fn((id, name, setUser) => {
    setUser({
      ...mockUserFull,
      name: name,
    });
  }),
}));

jest.mock("@/src/models/firebase/GetFirestoreCtrl", () => ({
  getProfilePicture: jest.fn((id) => {
    return "uri";
  }),
  getChallengeDescription: jest.fn((id) => {
    return {
      title: "Challenge Title",
      description: "Challenge Description",
      endDate: new Date(2024, 1, 1, 0, 0, 0, 0),
    };
  }),
  getKChallenges: jest.fn((id) => {
    return [];
  }),
  getGroupsByUserId: jest.fn((id) => {
    return [];
  }),
  getImageUrl: jest.fn(),
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(async () => ({
    cancelled: false,
    uri: "mock-image-uri",
  })),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

// Mock user Sign-in Sign-up
let mockUser = {
  uid: "",
  email: "",
  name: "",
  image_id: "",
  createdAt: new Date(),
};

// Mock setUser Sign-in Sign-up
const mockSetUser = jest.fn((user) => {
  mockUser = user;
});

// Mock User full
let mockUserFull = {
  uid: "123",
  email: "test@example.com",
  name: "TestUser",
  image_id: "uri",
  createdAt: new Date(),
};

// Mock setUser full
const mockSetUserFull = jest.fn((user) => {
  mockUserFull = user;
});

// Mock user consistency
let mockUserConsistency = {
  uid: "123",
  email: "test@example.com",
  name: "TestUser",
  image_id: "uri",
  createdAt: new Date(),
};

// Mock setUser consistency
const mockSetUserConsistency = jest.fn((user) => {
  mockUserFull = user;
});

// Create a test component to wrap SignInScreen and HomeScreen with navigation
const SignInTest = ({ setUser }: { setUser: jest.Mock }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn">
          {(props) => <SignInScreen {...props} setUser={setUser} />}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} user={mockUser} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Create a test component to wrap SignUpScreen and HomeScreen with navigation
const SignUpTest = ({ setUser }: { setUser: jest.Mock }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="SignUp"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignUp">
          {(props) => <SignUp {...props} setUser={setUser} />}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} user={mockUser} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Create a test component to wrap SetUsernameScreen and HomeScreen with navigation
const SetUsernameTest = ({ setUser }: { setUser: jest.Mock }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="SetUser"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SetUser">
          {(props) => (
            <SetUsernameScreen
              {...props}
              setUser={setUser}
              user={mockUserFull}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} user={mockUserFull} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Create a test component to wrap HomeScreen with navigation
const HomeTest = ({ setUser }: { setUser: jest.Mock }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} user={mockUserConsistency} />}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {(props) => (
            <ProfileScreen
              {...props}
              user={mockUserConsistency}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("SignInScreen Tests", () => {
  // Reset the mock before each test
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  it("authenticates and passes the user to HomeScreen", async () => {
    // Render the test app
    const { getByTestId } = render(<SignInTest setUser={mockSetUser} />);

    // Simulate user interactions
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");

    fireEvent.press(getByTestId("sign-in-button"));

    // Verify logInWithEmail was called
    expect(logInWithEmail).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
      expect.any(Object),
      mockSetUser,
    );

    // Wait for the navigation to HomeScreen
    await waitFor(() => {
      expect(getByTestId("home-screen")).toBeTruthy();
    });

    // Verify the user was passed to HomeScreen
    expect(mockUser).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "Test User",
      createdAt: expect.any(Date),
    });
  });
});

describe("SignUpScreen Tests", () => {
  it("authenticates and passes the user to HomeScreen", async () => {
    // Render the test app
    const { getByTestId } = render(<SignUpTest setUser={mockSetUser} />);

    // Simulate user interactions
    fireEvent.changeText(getByTestId("name-input"), "Test");
    fireEvent.changeText(getByTestId("surname-input"), "User");
    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");
    fireEvent.changeText(getByTestId("confirm-password-input"), "password123");

    fireEvent.press(getByTestId("sign-up-button"));

    // Verify signUpWithEmail was called
    expect(signUpWithEmail).toHaveBeenCalledWith(
      "Test User",
      "test@example.com",
      "password123",
      expect.any(Object),
      mockSetUser,
    );

    // Wait for the navigation to HomeScreen
    await waitFor(() => {
      expect(getByTestId("home-screen")).toBeTruthy();
    });

    // Verify the user was passed to HomeScreen
    expect(mockUser).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "Test User",
      createdAt: expect.any(Date),
    });
  });
});

describe("SetUsernameScreen Tests", () => {
  it("authenticates and passes the user to HomeScreen", async () => {
    // Render the test app
    const { getByTestId } = render(
      <SetUsernameTest setUser={mockSetUserFull} />,
    );

    // Simulate user interactions
    fireEvent.changeText(getByTestId("usernameInput"), "TestUser2");
    fireEvent.press(getByTestId("bottom-right-icon-arrow-forward"));

    // Verify setName was called
    await waitFor(() => {
      expect(setName).toHaveBeenCalledWith("123", "TestUser2", mockSetUserFull);
    });

    // Wait for the navigation to HomeScreen
    await waitFor(() => {
      expect(getByTestId("home-screen")).toBeTruthy();
    });

    // Verify the user was passed to HomeScreen
    expect(mockUserFull).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "TestUser2",
      image_id: "uri",
      createdAt: expect.any(Date),
    });
  });
});

describe("Consistency between screens", () => {
  it("authenticates and passes the user to HomeScreen", async () => {
    // Render the test app
    const { getByTestId } = render(<HomeTest setUser={mockSetUserFull} />);

    // Verify the user was passed to HomeScreen
    expect(mockUserConsistency).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "TestUser",
      image_id: "uri",
      createdAt: expect.any(Date),
    });

    // Simulate user interactions
    fireEvent.press(getByTestId("topRightIcon-person-circle-outline"));

    // Wait for the navigation to ProfileScreen
    await waitFor(() => {
      expect(getByTestId("profile-screen")).toBeTruthy();
    });

    // Verify the user was passed to ProfileScreen
    expect(mockUserConsistency).toEqual({
      uid: "123",
      email: "test@example.com",
      name: "TestUser",
      image_id: "uri",
      createdAt: expect.any(Date),
    });
  });
});
