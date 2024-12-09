import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { TopBar } from "@/components/navigation/TopBar";
import { Challenge } from "@/components/home/Challenge";
import { ChallengeDescription } from "@/components/home/Challenge_Description";
import { ThemedScrollView } from "@/components/theme/ThemedScrollView";
import { ThemedView } from "@/components/theme/ThemedView";
import { BottomBar } from "@/components/navigation/BottomBar";
import { ThemedTextButton } from "@/components/theme/ThemedTextButton";
import { useHomeScreenViewModel } from "@/src/viewmodels/home/HomeScreenViewModel";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";
import GroupIcon from "@/components/home/GroupIcon";
import { ThemedText } from "@/components/theme/ThemedText";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({
  user,
  navigation,
  firestoreCtrl,
}: {
  user: DBUser;
  navigation: any;
  firestoreCtrl: FirestoreCtrl;
}) {
  const {
    userIsGuest,
    challenges,
    groups,
    titleChallenge,
    challengesFromFriends,
    navigateToProfile,
    navigateToMap,
    navigateToCamera,
    navigateToFriends,
  } = useHomeScreenViewModel(user, firestoreCtrl, navigation);

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filterByFriends, setFilterByFriends] = useState(false);

  // Determine displayed challenges
  const displayedChallenges = filterByFriends
    ? challengesFromFriends
    : challenges;

  return (
    <ThemedView style={styles.bigContainer} testID="home-screen">
      <TopBar
        title="Strive"
        leftIcon="people-outline"
        leftAction={() => navigateToFriends()}
        rightIcon={
          userIsGuest || !user.image_id
            ? "person-circle-outline"
            : user.image_id
        }
        rightAction={() => navigateToProfile()}
        testID="top-bar"
      />

      {/* Groups */}
      <ThemedScrollView style={styles.groupsContainer} horizontal>
        {groups.map((group, index) => (
          <GroupIcon
            groupDB={group}
            navigation={navigation}
            firestoreCtrl={firestoreCtrl}
            key={index}
            testID={`group-id-${index}`}
          />
        ))}

        <ThemedView
          style={styles.createGroupContainer}
          testID="create-group-button"
        >
          <ThemedTextButton
            style={styles.createGroupButton}
            onPress={() => navigation.navigate("CreateGroup")}
            text="+"
            textStyle={styles.createGroupText}
            textColorType="textOverLight"
            colorType="backgroundSecondary"
          />
        </ThemedView>
      </ThemedScrollView>

      {/* Challenges */}
      <ThemedScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        colorType="transparent"
      >
        {/* Current Challenge Description  */}
        <ChallengeDescription
          dBChallengeDescription={titleChallenge}
          onTimerFinished={() => console.info("Timer Finished")}
          testID={`description-id`}
        />
        {displayedChallenges.length === 0 ? (
          <ThemedText>No challenges to display</ThemedText>
        ) : (
          displayedChallenges.map((challenge, index) => (
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
        leftAction={() => navigateToMap()}
        centerAction={() => navigateToCamera()}
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
  filterIconContainer: {
    position: "absolute",
    top: height * 0.25,
    right: width * 0.05,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  filterIcon: {
    padding: 5,
    backgroundColor: "#444",
    borderRadius: 15,
  },
  filterDropdown: {
    backgroundColor: "#333",
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    position: "absolute",
    top: 40,
    right: 0,
  },
  dropdownOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  dropdownText: {
    color: "#fff",
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
  groupsContainer: {
    width: width - 20,
    height: 0.18 * height,
    borderRadius: 15,
    backgroundColor: "transparent",
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
});
