import React from "react";
import {
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedTextInput } from "@/src/views/components/theme/themed_text_input";
import { ThemedTextButton } from "@/src/views/components/theme/themed_text_button";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import SignInViewModel from "@/src/viewmodels/auth/SignInViewModel";

const { width, height } = Dimensions.get("window");

/**
 * Screen for signing in
 * @param navigation : navigation object
 * @param setUser : function to set the user object
 * @returns : a screen for signing in
 */
export default function SignInScreen({
  navigation,
  setUser,
}: {
  readonly navigation: any;
  readonly setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
}) {
  const {
    email,
    password,
    errorMessage,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
  } = SignInViewModel(navigation, setUser);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.signInScreen}>
          <ThemedView
            style={styles.ovalShapeTwo}
            colorType="backgroundSecondary"
          />

          <ThemedText
            style={styles.titleText}
            colorType="textPrimary"
            type="title"
          >
            We've missed you
          </ThemedText>

          <ThemedView style={styles.colContainer}>
            <ThemedTextInput
              style={styles.input}
              type="email"
              testID="email-input"
              onChangeText={handleEmailChange}
              value={email}
              viewWidth={"90%"}
              title="Email"
            />

            <ThemedTextInput
              style={styles.input}
              type="password"
              testID="password-input"
              onChangeText={handlePasswordChange}
              value={password}
              viewWidth={"90%"}
              title="Password"
            />

            {errorMessage && (
              <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            )}

            <ThemedTextButton
              style={styles.buttonSignIn}
              onPress={handleSignIn}
              text="Sign In"
              testID="sign-in-button"
              textStyle={{ fontWeight: "600" }}
              textColorType="textOverLight"
            />

            <ThemedTextButton
              style={{ alignItems: "center" }}
              onPress={() => navigation.navigate("ForgotPassword")}
              text="Forgot Password?"
              colorType="transparent"
              textColorType="textPrimary"
            />
          </ThemedView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  signInScreen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  ovalShapeTwo: {
    position: "absolute",
    top: "-40%",
    left: "30%",
    width: "130%",
    height: "70%",
    borderRadius: width * 0.7,
  },

  colContainer: {
    flex: 2,
    width: "90%",
    backgroundColor: "transparent",
    alignItems: "center",
    gap: height * 0.027,
  },

  titleText: {
    flex: 1,
    width: "85%",
    alignSelf: "center",
    textAlign: "right",
    textAlignVertical: "center",
  },

  input: {
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
  },

  buttonSignIn: {
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    borderRadius: 15,
    padding: 8,
  },

  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 14,
  },
});
