import React from "react";
import { StyleSheet, Dimensions, Switch, Image } from "react-native";
import { ThemedTextInput } from "@/components/theme/ThemedTextInput";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedScrollView } from "@/components/theme/ThemedScrollView";
import { BottomBar } from "@/components/navigation/BottomBar";
import { ThemedView } from "@/components/theme/ThemedView";
import { Colors } from "@/constants/Colors";
import CreateChallengeViewModel from "@/src/viewmodels/create/CreateChallengeViewModel";
import FirestoreCtrl from "@/src/models/firebase/FirestoreCtrl";

const { width, height } = Dimensions.get("window");

/**
 * Screen for creating a new challenge
 * @param navigation : navigation object
 * @param route : route object
 * @param firestoreCtrl : FirestoreCtrl object
 * @returns : a screen for creating a new challenge
 */
export default function CreateChallengeScreen({
  navigation,
  route,
  firestoreCtrl,
}: {
  navigation: any;
  route: any;
  firestoreCtrl: FirestoreCtrl;
}) {
  const {
    caption,
    setCaption,
    postImage,
    isLocationEnabled,
    toggleLocation,
    makeChallenge,
  } = CreateChallengeViewModel({ navigation, route, firestoreCtrl });

  return (
    <ThemedView style={styles.createChallengeScreen}>
      {/* Title */}
      <ThemedText
        style={styles.title}
        colorType="textPrimary"
        type="title"
        testID="Create-Challenge-Text"
      >
        Create a New Challenge
      </ThemedText>

      <ThemedScrollView
        style={styles.containerCol}
        automaticallyAdjustKeyboardInsets={true}
        colorType="transparent"
        //contentContainerStyle={styles.contentContainer}
      >
        <ThemedView
          style={styles.imageContainer}
          colorType="transparent"
          testID="challenge-image"
        >
          <Image
            source={
              postImage
                ? { uri: postImage }
                : require("../../../assets/images/no-image.svg")
            }
            style={styles.image}
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedTextInput
            style={styles.input}
            placeholder="Caption"
            onChangeText={(text) => setCaption(text)}
            viewWidth={"90%"}
            title="Caption"
            testID="Caption-Input"
          />
        </ThemedView>

        {/* Location toggle */}
        <ThemedView style={styles.containerRow}>
          <Switch
            style={styles.switch}
            trackColor={{
              false: Colors.dark.icon,
              true: Colors.light.tabIconDefault,
            }}
            thumbColor={
              isLocationEnabled ? Colors.light.tint : Colors.dark.white
            }
            ios_backgroundColor={Colors.light.tint}
            onValueChange={toggleLocation}
            value={isLocationEnabled}
            testID="switch-button"
          />
          <ThemedText
            colorType="textPrimary"
            style={styles.switchText}
            testID="Location-validation"
          >
            Enable location ?
          </ThemedText>
        </ThemedView>

        {/* Submit button */}
        <BottomBar
          rightIcon="arrow-forward"
          rightAction={makeChallenge}
          testID="bottom-bar"
        />
      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  createChallengeScreen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  containerCol: {
    flex: 3,
    width: "90%",
    backgroundColor: "transparent",
    gap: height * 0.027,
    paddingTop: 27,
  },
  containerRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 25,
  },
  title: {
    flex: 0.45,
    width: "85%",
    alignSelf: "center",
    textAlign: "left",
    textAlignVertical: "bottom",
  },
  input: {
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    borderRadius: 15,
    padding: 16,
  },
  inputContainer: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    paddingTop: 13,
  },
  switch: {
    alignSelf: "flex-start",
    width: "10%",
    borderWidth: 2,
    borderRadius: 15,
  },
  switchText: {
    width: "90%",
    paddingLeft: 15,
    alignSelf: "center",
  },

  image: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 15,
  },

  imageContainer: {
    height: height * 0.4,
    width: width * 0.9,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "white",
    backgroundColor: "transparent",
  },
});
