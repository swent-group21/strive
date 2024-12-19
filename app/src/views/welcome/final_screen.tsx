import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { ThemedTextButton } from "@/src/views/components/theme/themed_text_button";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import WelcomeFinalViewModel from "@/src/viewmodels/welcome/FinalScreenViewModel";

// Get the window dimensions
const { width, height } = Dimensions.get("window");

/**
 * Welcome final screen
 * @param setUser : function to set the user object
 * @param navigation : navigation object
 * @param firestoreCtrl : FirestoreCtrl object
 * @returns : a screen for the final welcome screen
 */
export default function WelcomeFinalScreen({
  setUser,
  navigation,
}: {
  readonly setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
  readonly navigation: any;
}) {
  const { navigateToSignIn, navigateToSignUp, continueAsGuest } =
    WelcomeFinalViewModel({ navigation, setUser });

  return (
    <ThemedView style={styles.container} testID="welcome-final-screen">
      {/* Background shapes */}
      <ThemedView
        style={styles.ovalShapeOne}
        colorType="backgroundSecondary"
        testID="background-image-1"
      />
      <ThemedView
        style={styles.ovalShapeTwo}
        colorType="backgroundSecondary"
        testID="background-image-2"
      />

      {/* Screen content */}
      <ThemedText
        style={styles.title}
        colorType="textPrimary"
        type="superTitle"
      >
        Ready to{"\n"}Strive?
      </ThemedText>

      {/* Buttons */}
      <ThemedView style={styles.buttonContainer} colorType="transparent">
        <ThemedTextButton
          style={styles.buttonAccount}
          onPress={navigateToSignIn}
          text="Sign In"
          textStyle={styles.buttonText}
          textColorType="textOverLight"
        />
        <ThemedTextButton
          style={styles.buttonAccount}
          onPress={navigateToSignUp}
          text="Sign Up"
          textStyle={styles.buttonText}
          textColorType="textOverLight"
        />
        <ThemedTextButton
          onPress={continueAsGuest}
          text="Continue as guest"
          colorType="transparent"
          textColorType="textPrimary"
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },

  ovalShapeOne: {
    position: "absolute",
    top: "80%",
    left: "-30%",
    width: "130%",
    height: "70%",
    borderRadius: width * 0.7,
  },

  ovalShapeTwo: {
    position: "absolute",
    top: "-40%",
    left: "30%",
    width: "130%",
    height: "70%",
    borderRadius: width * 0.7,
  },

  title: {
    width: "80%",
    alignSelf: "center",
    paddingTop: height * 0.3,
    paddingBottom: height * 0.12,
  },

  buttonContainer: {
    alignItems: "center",
    gap: height * 0.027,
  },

  buttonAccount: {
    width: "80%",
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },

  buttonText: {
    fontWeight: "bold",
  },
});
