import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

// Get screen width and height
const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const router = useRouter();
  return (
    <View style={styles.signInScreen}>
      {/* Background Image */}
      <Image
        source={require("@/assets/images/auth/SignInScreen/bg.png")}
        style={[styles.backgroundImage]}
      />

      {/* Title */}
      <Text style={styles.titleText}>We've missed you</Text>

      <View style={styles.colContainer}>
        {/* Text Inputs */}
        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@your.domain"
          placeholderTextColor="#888"
          autoComplete="email"
          inputMode="email"
          keyboardType="email-address"
          autoCapitalize="none"
          testID="emailInput"
        />

        <Text style={styles.text}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="**********"
          placeholderTextColor="#888"
          secureTextEntry={true}
          autoComplete="password"
          testID="passwordInput"
        />

        {/* SignIn Button */}
        <TouchableOpacity
          style={styles.buttonSignIn}
          onPress={() => alert("Sign In")}
          testID="signInButton"
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity
          style={{ alignSelf: "flex-start" }}
          onPress={() => router.push("/screens/auth/forgot_password_screen")}
          testID="forgotPasswordButton"
        >
          <Text
            style={{
              textDecorationLine: "underline",
              marginBottom: height * 0.05,
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Continue with Google */}
        <TouchableOpacity
          style={styles.buttonContinueWith}
          onPress={() => alert("Sign In with Google")}
          testID="continueWithGoogleButton"
        >
          <View style={styles.buttonContent}>
            <Image
              source={require("@/assets/images/auth/SignInScreen/google.png")}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        {/* Continue with Facebook */}
        <TouchableOpacity
          style={styles.buttonContinueWith}
          onPress={() => alert("Sign In with Facebook")}
          testID="continueWithFacebookButton"
        >
          <View style={styles.buttonContent}>
            <Image
              source={require("@/assets/images/auth/SignInScreen/facebook.png")}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Continue with Facebook</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signInScreen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  backgroundImage: {
    width: "100%",
    height: height * 0.35,
    position: "absolute",
  },
  titleText: {
    fontSize: width * 0.14,
    color: "black",
    fontWeight: "800",
    textAlign: "right",
    paddingTop: height * 0.12,
    paddingBottom: height * 0.05,
  },
  colContainer: {
    width: "83%",
    height: "60%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: height * 0.01,
  },
  input: {
    width: "100%",
    height: height * 0.06,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#ccc",
    paddingLeft: 20,
    marginBottom: height * 0.02,
  },
  text: {
    fontSize: width * 0.04,
    color: "black",
    width: "100%",
    textAlign: "left",
  },
  buttonText: {
    fontSize: width * 0.045,
    color: "black",
  },
  buttonSignIn: {
    width: "100%",
    height: height * 0.05,
    backgroundColor: "#E6BC95",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContinueWith: {
    width: "100%",
    height: height * 0.05,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
