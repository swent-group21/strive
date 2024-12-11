import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedTextInput } from "@/components/theme/ThemedTextInput";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedScrollView } from "@/components/theme/ThemedScrollView";
import { BottomBar } from "@/components/navigation/BottomBar";
import { ThemedView } from "@/components/theme/ThemedView";
import CreateGroupViewModel from "@/src/viewmodels/group/CreateGroupViewModel";
import { DBUser } from "@/src/models/firebase/FirestoreCtrl";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");

export default function CreateGroupScreen({
  user,
  navigation,
  firestoreCtrl,
}: {
  readonly user: DBUser;
  readonly navigation: any;
  readonly firestoreCtrl: any;
}) {
  const {
    groupName,
    setGroupName,
    challengeTitle,
    setChallengeTitle,
    makeGroup,
    setRadius,
    radius,
    MIN_RADIUS,
    MAX_RADIUS,
  } = CreateGroupViewModel({ user, navigation, firestoreCtrl });

  return (
    <ThemedView style={styles.createGroupScreen} testID="create-group-screen">
      {/* Title */}
      <ThemedText
        style={styles.title}
        colorType="textPrimary"
        type="title"
        testID="Create-Challenge-Text"
      >
        Create a New Group
      </ThemedText>

      {/* Form */}
      <ThemedScrollView
        style={styles.containerCol}
        automaticallyAdjustKeyboardInsets={true}
      >
        <ThemedTextInput
          style={styles.input}
          placeholder="Group Name"
          onChangeText={setGroupName}
          value={groupName}
          viewWidth="90%"
          title="Group Name"
          testID="Group-Name-Input"
        />
        <ThemedTextInput
          style={styles.input}
          placeholder="Challenge of the group"
          onChangeText={setChallengeTitle}
          value={challengeTitle}
          viewWidth="90%"
          title="Challenge Description"
          testID="Description-Input"
        />

        {/* Radius */}
        <ThemedText
          style={styles.radiusText}
          colorType="textPrimary"
          testID="Radius-Input"
        >
          Radius {radius / 1000}km
        </ThemedText>
        <Slider
          style={{ width: "90%", paddingTop: 10 }}
          minimumValue={MIN_RADIUS}
          maximumValue={MAX_RADIUS}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FFFFFF"
          onValueChange={(value) => setRadius(value)}
          step={1000}
          testID="Radius-Slider"
        />

        {/* Submit button */}
        <BottomBar
          rightIcon="arrow-forward"
          rightAction={makeGroup}
          testID="bottom-bar"
        />
      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  createGroupScreen: {
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
  radiusText: {
    textAlign: "left",
    textAlignVertical: "center",
    fontWeight: "600",
    paddingTop: 10,
  },
});
