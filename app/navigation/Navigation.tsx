import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/RootStackParamList";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
// Screens
import WelcomeScreens from "@/src/views/welcome/welcome_screen";
import WelcomeFinalScreen from "@/src/views/welcome/final_screen";
import HomeScreen from "@/src/views/home/home_screen";
import SignUp from "@/src/views/auth/sign_up_screen";
import SignInScreen from "@/src/views/auth/sign_in_screen";
import ForgotPasswordScreen from "@/src/views/auth/forgot_password_screen";
import Camera from "@/src/views/camera/CameraContainer";
import SetUsername from "@/src/views/auth/set_up_screen";
import MaximizeScreen from "@/src/views/home/maximize_screen";
import ProfileScreen from "@/src/views/home/profile_screen";
import MapScreen from "@/src/views/map/map_screen";
import FriendsScreen from "@/src/views/friends/friends_screen";
import { NavigationContainer } from "@react-navigation/native";
import CreateGroupScreen from "@/src/views/group/CreateGroupScreen";
import GroupScreen from "@/src/views/group/GroupScreen";

const { Navigator, Screen, Group } =
  createNativeStackNavigator<RootStackParamList>();

// Navigation stack for the app
interface AppStackProps {
  isLoggedIn: "Welcome" | "Home";
  user?: DBUser | null;
  setUser?: React.Dispatch<React.SetStateAction<DBUser | null>>;
}

export const Nav: React.FC<AppStackProps> = ({ isLoggedIn, user, setUser }) => {
  return (
    <NavigationContainer>
      <Navigator
        initialRouteName={isLoggedIn}
        id={undefined}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f9f9f9",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Group>
          <Screen name="Welcome" options={{ title: "Login to Strive" }}>
            {(props: any) => <WelcomeScreens {...props} setUser={setUser} />}
          </Screen>

          <Screen name="WelcomeFinal" options={{ title: "Final Screen" }}>
            {(props: any) => (
              <WelcomeFinalScreen {...props} setUser={setUser} />
            )}
          </Screen>

          <Screen name="SignUp">
            {(props: any) => <SignUp {...props} setUser={setUser} />}
          </Screen>

          <Screen name="SignIn">
            {(props: any) => <SignInScreen {...props} setUser={setUser} />}
          </Screen>

          <Screen name="ForgotPassword">
            {(props: any) => <ForgotPasswordScreen {...props} />}
          </Screen>

          <Screen name="SetUser">
            {(props: any) => (
              <SetUsername {...props} user={user} setUser={setUser} />
            )}
          </Screen>
        </Group>

        <Group>
          <Screen name="Home">
            {(props: any) => <HomeScreen {...props} user={user} />}
          </Screen>

          <Screen name="Camera">
            {(props: any) => <Camera {...props} user={user} />}
          </Screen>

          <Screen name="Maximize">
            {(props: any) => <MaximizeScreen {...props} user={user} />}
          </Screen>

          <Screen name="Profile">
            {(props: any) => (
              <ProfileScreen {...props} user={user} setUser={setUser} />
            )}
          </Screen>

          <Screen name="Friends">
            {(props: any) => <FriendsScreen {...props} user={user} />}
          </Screen>

          <Screen name="MapScreen">
            {(props: any) => <MapScreen {...props} user={user} />}
          </Screen>

          <Screen name="GroupScreen">
            {(props: any) => <GroupScreen {...props} user={user} />}
          </Screen>

          <Screen name="CreateGroup">
            {(props: any) => <CreateGroupScreen {...props} user={user} />}
          </Screen>
        </Group>
      </Navigator>
    </NavigationContainer>
  );
};
