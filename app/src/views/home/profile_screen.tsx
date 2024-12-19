import React from "react";
import { StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { ThemedTextInput } from "@/src/views/components/theme/themed_text_input";
import { ThemedTextButton } from "@/src/views/components/theme/themed_text_button";
import { ThemedIconButton } from "@/src/views/components/theme/themed_icon_button";
import { TopBar } from "@/src/views/components/navigation/top_bar";
import { Icon } from "react-native-elements";
import { useProfileScreenViewModel } from "@/src/viewmodels/home/ProfileScreenViewModel";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

/**
 * Profile screen
 * @param user : user object
 * @param setUser : function to set the user object
 * @param navigation : navigation object
 * @returns : a screen for the user's profile
 */
export default function ProfileScreen({
  user,
  setUser,
  navigation,
}: {
  readonly user: DBUser;
  readonly setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
  readonly navigation: any;
}) {
  const {
    userIsGuest,
    name,
    sName,
    image,
    pickImage,
    handleLogOut,
    handleChangeEmail,
    handleChangePassword,
    navigateGoBack,
  } = useProfileScreenViewModel(user, setUser, navigation);

  if (userIsGuest) {
    return (
      <ThemedView style={styles.bigContainer}>
        <ThemedText style={styles.notLoggedIn}>
          You are not logged in!
        </ThemedText>
        <ThemedTextButton
          text="Sign In"
          textColorType="white"
          onPress={handleLogOut}
          style={styles.action}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.bigContainer} testID="profile-screen">
      <TopBar
        title="Your profile"
        leftIcon="arrow-back"
        leftAction={() => navigateGoBack()}
      />
      <TouchableOpacity
        onPress={pickImage}
        testID="image-picker"
        style={styles.smallContainer}
      >
        {!image ? (
          <ThemedIconButton
            name="person-circle-outline"
            size={300}
            color="white"
            onPress={pickImage}
          />
        ) : (
          <Image source={{ uri: image }} style={styles.image} />
        )}
      </TouchableOpacity>

      <ThemedTextInput
        style={styles.username}
        value={name}
        onChangeText={sName}
        placeholder="Enter your name"
      />

      <ThemedView style={styles.actionsContainer} testID="actions-container">
        <ThemedView style={styles.row}>
          <ThemedTextButton
            text="Change your email"
            textColorType="textSecondary"
            onPress={handleChangeEmail}
            style={styles.action}
            colorType="transparent"
          />
          <Icon name="email" color="white" size={30} />
        </ThemedView>
        <ThemedView style={styles.row}>
          <ThemedTextButton
            text="Change your password"
            textColorType="textSecondary"
            onPress={handleChangePassword}
            style={styles.action}
            colorType="transparent"
          />
          <Icon name="key" color="white" size={30} />
        </ThemedView>
        <ThemedView style={styles.row}>
          <ThemedTextButton
            text="Log Out"
            textColorType="textSecondary"
            onPress={handleLogOut}
            style={styles.action}
            colorType="transparent"
          />
          <Icon name="logout" color="white" size={30} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    alignItems: "center",
  },
  smallContainer: {
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 100,
    marginBottom: 40,
  },
  username: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  columnInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logOut: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
    borderColor: "red",
    borderWidth: 1,
  },
  logOutView: {
    top: 0,
    alignItems: "center",
  },
  action: {
    alignItems: "flex-start",
    borderRadius: 10,
    borderColor: "transparent",
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    backgroundColor: Colors.light.backgroundSecondary,
  },
  actionsContainer: {
    borderRadius: 10,
    width: "95%",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: Colors.light.backgroundSecondary,
  },
  row: {
    flexDirection: "row",
    backgroundColor: Colors.light.backgroundSecondary,
    width: "100%",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  notLoggedIn: {
    width: "100%",
    alignItems: "center",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
