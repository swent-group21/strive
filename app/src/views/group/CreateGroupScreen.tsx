import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedTextInput } from "@/components/theme/ThemedTextInput";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedScrollView } from "@/components/theme/ThemedScrollView";
import { BottomBar } from "@/components/navigation/BottomBar";
import { ThemedView } from "@/components/theme/ThemedView";
import CreateGroupViewModel from "@/src/viewmodels/group/CreateGroupViewModel";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";

const { width, height } = Dimensions.get("window");

export default function CreateGroupScreen({
  user,
  navigation,
  firestoreCtrl,
}: {
  readonly user: DBUser;
  readonly navigation: any;
  readonly firestoreCtrl: FirestoreCtrl;
}) {
  const {
    groupName,
    setGroupName,
    challengeTitle,
    setChallengeTitle,
    makeGroup,
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

        {/* Submit button */}
        <BottomBar rightIcon="arrow-forward" rightAction={makeGroup} />
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
});
