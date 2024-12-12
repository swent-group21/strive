import React from "react";
import { StyleSheet, Dimensions, Switch } from "react-native";
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
  readonly navigation: any;
  readonly route: any;
  readonly firestoreCtrl: FirestoreCtrl;
}) {
  const {
    challengeName,
    setChallengeName,
    description,
    setDescription,
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

      {/* Form */}
      <ThemedScrollView
        style={styles.containerCol}
        automaticallyAdjustKeyboardInsets={true}
      >
        <ThemedTextInput
          style={styles.input}
          placeholder="Challenge Name"
          onChangeText={setChallengeName}
          value={challengeName}
          viewWidth="90%"
          title="Challenge Name"
          testID="Challenge-Name-Input"
        />
        <ThemedTextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={setDescription}
          value={description}
          viewWidth="90%"
          title="Description"
          testID="Description-Input"
        />

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
        <BottomBar rightIcon="arrow-forward" rightAction={makeChallenge} />
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
  },
  containerRow: {
    width: "90%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    padding: 15,
  },
  title: {
    flex: 1,
    width: "85%",
    alignSelf: "center",
    textAlign: "left",
    textAlignVertical: "center",
  },
  input: {
    alignSelf: "center",
    width: "100%",
    borderWidth: 2,
    borderRadius: 15,
    padding: 16,
  },
  switch: {
    alignSelf: "flex-start",
    width: "15%",
    borderWidth: 2,
    borderRadius: 15,
  },
  switchText: {
    width: "90%",
    padding: 15,
    alignSelf: "center",
  },
});
