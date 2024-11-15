import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/RootStackParamList";
import FirestoreCtrl, { DBUser } from "@/firebase/FirestoreCtrl";

// Screens
import WelcomeScreens from "@/app/screens/welcome/welcome_screen";
import WelcomeFinalScreen from "@/app/screens/welcome/final_screen";
import HomeScreen from "@/app/screens/home/home_screen";
import SignUp from "@/app/screens/auth/sign_up_screen";
import SignInScreen from "@/app/screens/auth/sign_in_screen";
import ForgotPasswordScreen from "@/app/screens/auth/forgot_password_screen";
import Camera from "@/app/screens/camera";
import SetUsername from "@/app/screens/auth/set_up_screen";

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>();

interface AppStackProps {
  isLoggedIn: "Welcome" | "Home";
  user?: DBUser | null;
  firestoreCtrl: FirestoreCtrl;
}

export const Nav: React.FC<AppStackProps> = ({
  isLoggedIn,
  user,
  firestoreCtrl,
}) => {
  return (
    <Navigator
      initialRouteName={isLoggedIn}
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
          {(props: any) => <WelcomeScreens {...props} />}
        </Screen>
        <Screen name="WelcomeConcept" options={{ title: "Final Screen" }}>
          {(props: any) => (
            <WelcomeFinalScreen {...props} firestoreCtrl={{ firestoreCtrl }} />
          )}
        </Screen>
        <Screen name="SignUp">
          {(props: any) => (
            <SignUp {...props} firestoreCtrl={{ firestoreCtrl }} />
          )}
        </Screen>
        <Screen name="SignIn">
          {(props: any) => (
            <SignInScreen {...props} firestoreCtrl={{ firestoreCtrl }} />
          )}
        </Screen>
        <Screen name="ForgotPassword">
          {(props: any) => (
            <ForgotPasswordScreen
              {...props}
              firestoreCtrl={{ firestoreCtrl }}
            />
          )}
        </Screen>
        <Screen name="SetUp">
          {(props: any) => (
            <SetUsername {...props} firestoreCtrl={{ firestoreCtrl }} />
          )}
        </Screen>
      </Group>
      <Group>
        <Screen name="Home">
          {(props: any) => (
            <HomeScreen
              {...props}
              user={{ user }}
              firestoreCtrl={{ firestoreCtrl }}
            />
          )}
        </Screen>
        <Screen name="Camera">
          {(props: any) => (
            <Camera {...props} firestoreCtrl={{ firestoreCtrl }} />
          )}
        </Screen>
      </Group>
    </Navigator>
  );
};