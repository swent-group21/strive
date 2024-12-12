import React from "react";
import { StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { ThemedView } from "@/components/theme/ThemedView";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomBar } from "@/components/navigation/BottomBar";
import { ThemedTextInput } from "@/components/theme/ThemedTextInput";
import { ThemedIconButton } from "@/components/theme/ThemedIconButton";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedScrollView } from "@/components/theme/ThemedScrollView";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";
import SetUsernameViewModel from "@/src/viewmodels/auth/SetUsernameViewModel";

const { width, height } = Dimensions.get("window");

/**
 * Screen for setting up the user's profile
 * @param user : user object
 * @param navigation : navigation object
 * @param firestoreCtrl : FirestoreCtrl object
 * @param setUser : function to set the user object
 * @returns : a screen for setting up the user's profile
 */
export default function SetUsernameScreen({
  user,
  navigation,
  firestoreCtrl,
  setUser,
}: {
  readonly user: DBUser;
  readonly navigation: any;
  readonly firestoreCtrl: FirestoreCtrl;
  readonly setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
}) {
  const {
    username,
    image,
    errorMessage,
    handleUsernameChange,
    pickImage,
    upload,
  } = SetUsernameViewModel(user, firestoreCtrl, setUser);

  return (
    <ThemedView style={styles.screenContainer}>
      <ThemedView style={styles.ovalShapeOne} colorType="backgroundSecondary" />

      <TopBar
        leftIcon="arrow-back"
        leftAction={() => navigation.goBack()}
        title="Set up your profile"
      />

      <ThemedScrollView
        style={styles.mainContainer}
        automaticallyAdjustKeyboardInsets={true}
        colorType="transparent"
      >
        <ThemedView style={styles.smallContainer} colorType="transparent">
          <TouchableOpacity
            onPress={pickImage}
            style={styles.smallContainer}
            testID="profilePicButton"
          >
            {!image ? (
              <ThemedIconButton
                name="person-circle-outline"
                size={300}
                color="white"
                onPress={pickImage}
                testID="profile-icon-button"
              />
            ) : (
              <Image
                source={{ uri: image }}
                style={styles.image}
                testID="profilePicImage"
              />
            )}
          </TouchableOpacity>

          <ThemedTextInput
            onChangeText={handleUsernameChange}
            value={username}
            style={styles.input}
            viewWidth="80%"
            placeholder="ex : sandraa"
            testID="usernameInput"
          />
        </ThemedView>

        {Boolean(errorMessage) && (
          <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
        )}

        <ThemedText style={styles.title} type="subtitle">
          What will we see of you?
        </ThemedText>
      </ThemedScrollView>

      <BottomBar
        rightIcon="arrow-forward"
        rightAction={async () => {
          await upload();
          navigation.navigate("Home");
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  ovalShapeOne: {
    position: "absolute",
    top: "79%",
    left: "20%",
    width: "130%",
    height: "70%",
    borderRadius: width * 0.7,
  },

  screenContainer: {
    flex: 1,
  },

  mainContainer: {
    flex: 1,
    width: "100%",
  },

  smallContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: height * 0.09,
  },

  title: {
    textAlign: "center",
  },

  input: {
    fontSize: 20,
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
  },

  image: {
    width: 220,
    height: 220,
    borderRadius: 100,
    marginBottom: 40,
  },

  errorMessage: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
