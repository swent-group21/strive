import React, { act } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/src/views/home/home_screen";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";
import { fireEvent, render } from "@testing-library/react-native";
import Camera from "@/src/views/camera/CameraContainer";

const Stack = createNativeStackNavigator();

// Mock FirestoreCtrl
jest.mock("@/src/models/firebase/FirestoreCtrl", () => {
    return jest.fn().mockImplementation(() => {
      return {
        // Mock FirestoreCtrl methods here
        };
    });
});
const mockFirestoreCtrl = new FirestoreCtrl();

// Mock the route


// Mock user data
const mockUser: DBUser = {
    uid: "123",
    name: "test",
    email: "test@gmail.com",
    createdAt: new Date(),
};

// Mock expo-location
// Mock `expo-location`
jest.mock("expo-location", () => ({
    requestForegroundPermissionsAsync: jest
      .fn()
      .mockResolvedValue({ status: "undetermined" }),
    getCurrentPositionAsync: jest.fn(),
}));

// Render of the E2E test
const E2ePost = ({ setUser }: { setUser: jest.Mock }) => {
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
                user={mockUser}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Camera">
            {(props) => (
              <Camera
                {...props}
                firestoreCtrl={mockFirestoreCtrl}
                user={mockUser}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

describe("E2E Post", () => {
    it("should create a new post from HomeScreen as a user", async () => {
        // Mock expo-camera
        jest.mock("@/src/views/camera/CameraContainer", () => {
            return jest.fn().mockImplementation(() => {
              return {
                requestPermission: jest.fn(() => {
                    return { granted: true };
                }),
                permission: { granted: true },
                };
            });
        });
        
        // Mock setUser
        const setUser = jest.fn();
        const { getByText, getByPlaceholderText, getByTestId } = render(
            <E2ePost setUser={setUser} />
        );
        
        // Navigate to the camera screen
        const cameraButton = getByTestId("bottom-center-icon-camera-outline");

        await act(async () => {
            fireEvent.press(cameraButton);
        });

        expect(getByTestId("camera-screen")).toBeTruthy();

    });
});