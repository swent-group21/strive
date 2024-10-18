import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function WelcomeConceptScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.ovalShapeOne} />
      <View style={styles.ovalShapeTwo} />

      <Text style={styles.title}>Ready to{"\n"}Strive?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonAccount}
          onPress={() => router.push("/screens/auth/sign_in_screen")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* Add some space between the buttons */}
        <Text />
        <TouchableOpacity
          style={styles.buttonAccount}
          onPress={() => router.push("/screens/auth/sign_up_screen")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {/* Add some space between the buttons */}
        <Text />
        <TouchableOpacity onPress={() => alert("Anonymous")}>
          <Text>Continue as guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  ovalShapeOne: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.8,
    left: -SCREEN_WIDTH * 0.3,
    width: SCREEN_WIDTH * 1.3,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: SCREEN_WIDTH * 0.7,
    backgroundColor: "#E6BC95",
  },
  ovalShapeTwo: {
    position: "absolute",
    top: -SCREEN_HEIGHT * 0.4,
    left: SCREEN_WIDTH * 0.3,
    width: SCREEN_WIDTH * 1.3,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: SCREEN_WIDTH * 0.7,
    backgroundColor: "#E6BC95",
  },
  title: {
    paddingTop: SCREEN_HEIGHT * 0.3,
    paddingLeft: SCREEN_WIDTH * 0.05,
    fontSize: 64,
    fontWeight: "900",
    color: "#000",
    lineHeight: 62,
    paddingBottom: SCREEN_HEIGHT * 0.12,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 60,
  },
  buttonAccount: {
    width: "80%",
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "#000",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    color: "#FFF",
  },
});
