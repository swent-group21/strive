import {
  Dimensions,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import {
  logInWithEmail
} from "@/types/Auth";
import { useRouter } from "expo-router";
import FirestoreCtrl from "@/firebase/FirestoreCtrl";
import { ThemedView } from "@/components/theme/ThemedView";
import { ThemedTextInput } from "@/components/theme/ThemedTextInput";
import { ThemedTextButton } from "@/components/theme/ThemedTextButton";
import { ThemedText } from "@/components/theme/ThemedText";

// Get the screen dimensions
const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const router = useRouter();
  const firestoreCtrl = new FirestoreCtrl();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const uri = "@/assets/images/auth/SignInScreen/";
  return (
    <ThemedView style={styles.signInScreen}>
      <ThemedView style={styles.ovalShapeTwo} colorType="backgroundSecondary" />

      <ThemedText style={styles.titleText} colorType="white">We've missed you</ThemedText>

      <ThemedView style={styles.colContainer}>
        <ThemedTextInput style={styles.input}
          type="email"
          onChangeText={(text) => setEmail(text)}
          viewWidth={"90%"}
          title="Email"
        />

        <ThemedTextInput style={styles.input}
          type="password"
          onChangeText={(text) => setPassword(text)}
          viewWidth={"90%"}
          title="Password"
        />

        <ThemedTextButton style={styles.buttonSignIn}
          onPress={() => { logInWithEmail(email, password, firestoreCtrl, router) }}
          text="Sign In"
          textStyle={{ fontWeight: "600" }}
        />

        <ThemedTextButton 
          style={{ alignItems: "center" }}
          onPress={() => router.push("/screens/auth/forgot_password_screen")}
          text="Forgot Password?"
          colorType="transparent"
          textColorType="white"
        />

      </ThemedView>
    </ThemedView>
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
    gap: 20,
    alignItems: "center",
  },

  backgroundImage: {
    width: "100%",
    height: "35%",
    position: "absolute",
  },

  titleText: {
    flex: 1,
    fontSize: 51,
    fontWeight: "800",
    textAlign: "right",
    textAlignVertical: "center",
  },
  
  input: {
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    color: "white",
  },

  buttonSignIn: {
    alignSelf: "center",
    width: "80%",
    borderRadius: 15,
    alignItems: "center",
    padding: 8,
  },
});
