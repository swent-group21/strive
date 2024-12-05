import React from "react";
import { Dimensions, StyleSheet, ViewStyle } from "react-native";
import { TopBar } from "../../../components/navigation/TopBar";
import { Challenge } from "../../../components/home/Challenge";
import { GroupIcon } from "../../../components/home/GroupIcon";
import { ThemedScrollView } from "../../../components/theme/ThemedScrollView";
import { ThemedView } from "../../../components/theme/ThemedView";
import { BottomBar } from "../../../components/navigation/BottomBar";
import { ThemedText } from "../../../components/theme/ThemedText";
import { ThemedTextButton } from "../../../components/theme/ThemedTextButton";
import { useGroupScreenViewModel } from "../../viewmodels/group/GroupScreenViewModel";
import { DBGroup, DBUser } from "../../models/firebase/FirestoreCtrl";
import FirestoreCtrl from "../../models/firebase/FirestoreCtrl";


const { width, height } = Dimensions.get("window");

export default function GroupScreen({
  user,
  navigation,
  route,
  firestoreCtrl
}: {
  user: DBUser;
  navigation: any;
  route: any;
  firestoreCtrl: FirestoreCtrl;
}) {
  const group: DBGroup = route.params?.group;

  const { groupChallenges, 
    otherGroups,
    groupName,
    groupChallengeTitle,
} = useGroupScreenViewModel(user, firestoreCtrl, group);

  return (
    <ThemedView style={styles.bigContainer} testID="home-screen">
        <TopBar
            title={groupName}
            leftIcon="people-outline"
            leftAction={() => navigation.navigate("Friends")}
            rightIcon={
            !user.image_id ? "person-circle-outline" : user.image_id
            }
            rightAction={() => navigation.navigate("Profile")}
        />

        {/* Groups */}
        <ThemedScrollView style={styles.groupsContainer} horizontal>
            {otherGroups.map((group, index) => (
            <GroupIcon
                groupDB={group}
                navigation={navigation}
                firestoreCtrl={firestoreCtrl}
                key={index}
                testID={`group-id-${index}`}
            />
            ))}

            <ThemedView style={styles.createGroupContainer} testID="create-group-button">
                <ThemedTextButton
                    style={styles.createGroupButton}
                    onPress={() => {}}
                    text="+"
                    textStyle={styles.createGroupText}
                    textColorType="textOverLight"
                    colorType="backgroundSecondary"
                />
            </ThemedView>
        </ThemedScrollView>

            {/* Challenge Title */}
        <ThemedView style={styles.challengeTitle} testID={`description-id`}>
            <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
                {groupChallengeTitle}
            </ThemedText>
        </ThemedView>

        {/* Challenges */}
        <ThemedScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            colorType="transparent"
        >
            {groupChallenges.length === 0 ? (
            <ThemedText>No challenge to display</ThemedText>
            ) : (
            groupChallenges.map((challenge, index) => (
                <Challenge
                navigation={navigation}
                firestoreCtrl={firestoreCtrl}
                key={index}
                challengeDB={challenge}
                testID={`challenge-id-${index}`}
                currentUser={user}
                index={index}
                />
            ))
            )}
        </ThemedScrollView>

        <BottomBar
            testID="bottom-bar"
            leftIcon="map-outline"
            centerIcon="camera-outline"
            rightIcon="trophy-outline"
            leftAction={() => navigation.navigate("MapScreen")}
            centerAction={() => navigation.navigate("Camera")}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bigContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  groupsContainer: {
    width: width - 20,
    height: 0.18 * height,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: height * 0.04,
  },
  createGroupContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    width: width * 0.23,
    height: width * 0.2,
    borderRadius: 20,
    margin: 10,
    alignItems: "center",
  },
  createGroupButton: {
    width: "95%",
    height: "95%",
    borderRadius: 60,
  },
  createGroupText: {
    flex: 1,
    textAlign: "center",
    fontSize: 60,
  },
  challengeTitle: {
    width: width - 20,
    height: 0.2 * height,
    borderRadius: 15,
    backgroundColor: "transparent",
    justifyContent: "center" as ViewStyle["justifyContent"],
    alignItems: "center" as ViewStyle["alignItems"],
  },
});