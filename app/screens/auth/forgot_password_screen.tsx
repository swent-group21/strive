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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <View style={styles.forgotPasswordScreen}>
      {/* Background Image */}
      <Image
        source={require("@/assets/images/auth/ForgotPasswordScreen/bg.png")}
        style={[styles.backgroundImage]}
      />

      {/* Title */}
      <Text style={styles.titleText}>Forgot your Password ?</Text>

      {/* Column Container */}
      <View style={styles.colContainer}>
        {/* Input */}
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

        {/* Row Container */}
        <View style={styles.rowContainer}>
          {/* Back to SignIn */}
          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={() => router.back()}
            testID="cancelButton"
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          {/* Reset Password */}
          <TouchableOpacity
            style={styles.buttonSendEmail}
            onPress={() => alert("Send Email")}
            testID="resetPasswordButton"
          >
            <Text style={{ color: "white" }}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  forgotPasswordScreen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  backgroundImage: {
    width: width * 0.9,
    height: height * 0.39,
    position: "absolute",
    bottom: -30,
    right: 0,
  },
  titleText: {
    fontSize: width * 0.14,
    color: "black",
    fontWeight: "bold",
    textAlign: "justify",
    paddingTop: height * 0.15,
  },
  colContainer: {
    width: "83%",
    height: "40%",
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
    marginBottom: height * 0.01,
  },
  rowContainer: {
    width: "75%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonSendEmail: {
    width: "60%",
    height: height * 0.05,
    backgroundColor: "black",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCancel: {
    width: "35%",
    height: height * 0.05,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
