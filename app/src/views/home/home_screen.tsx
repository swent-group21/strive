import { useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";
import { TopBar } from "@/components/navigation/TopBar";
import { Challenge } from "@/components/home/Challenge";
import { ChallengeDescription } from "@/components/home/Challenge_Description";
import { ThemedView } from "@/components/theme/ThemedView";
import { BottomBar } from "@/components/navigation/BottomBar";
import { ThemedScrollView } from "@/components/theme/ThemedScrollView";
import { ThemedText } from "@/components/theme/ThemedText";
import { useHomeScreenViewModel } from "@/src/viewmodels/home/HomeScreenViewModel";
import FirestoreCtrl, { DBUser } from "@/src/models/firebase/FirestoreCtrl";
import GroupIcon from "@/components/home/GroupIcon";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({
  user,
  navigation,
  firestoreCtrl,
}: {
  readonly user: DBUser;
  readonly navigation: any;
  readonly firestoreCtrl: FirestoreCtrl;
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

  const [filterByFriends, setFilterByFriends] = useState(false);

  // Animation for hiding groups
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleThreshold = 100; // Distance to toggle the groups visibility

  const underlineAnim = useRef(new Animated.Value(0)).current;

  const handleFilterChange = (isFriends: boolean) => {
    Animated.timing(underlineAnim, {
      toValue: isFriends ? width * 0.5 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setFilterByFriends(isFriends);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const shouldCollapse = offsetY > toggleThreshold;

    if (shouldCollapse !== isCollapsed) {
      setIsCollapsed(shouldCollapse);
      Animated.timing(scrollY, {
        toValue: shouldCollapse ? 1 : 0,
        duration: 220, // Reduced animation duration for snappier transitions
        useNativeDriver: false,
      }).start();
    }
  };

  const groupOpacity = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const groupHeight = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.18, 0],
  });

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

      {/* Groups with snapping animation */}
      <Animated.View
        style={[
          styles.groupsContainer,
          {
            opacity: groupOpacity,
            height: groupHeight,
          },
        ]}
      >
        <ThemedScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            <TouchableOpacity
              style={styles.createGroupButton}
              onPress={() => navigation.navigate("CreateGroup")}
            >
              <ThemedText style={styles.createGroupText}>+</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedScrollView>
      </Animated.View>

      {/* Filter Buttons with Underline */}
      <ThemedView style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => handleFilterChange(false)}
          style={styles.filterButton}
        >
          <ThemedText
            style={[
              styles.filterText,
              !filterByFriends && styles.activeFilterText,
            ]}
            testID="all-posts-button"
          >
            All Posts
          </ThemedText>
          {!filterByFriends && <Animated.View style={[styles.underline]} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFilterChange(true)}
          style={styles.filterButton}
        >
          <ThemedText
            style={[
              styles.filterText,
              filterByFriends && styles.activeFilterText,
            ]}
            testID="friends-button"
          >
            My Friends
          </ThemedText>
          {filterByFriends && <Animated.View style={[styles.underline]} />}
        </TouchableOpacity>
      </ThemedView>

      {/* Challenges */}
      <Animated.FlatList
        testID="scroll-view"
        data={displayedChallenges}
        onScrollEndDrag={handleScrollEnd}
        keyExtractor={(item, index) => `challenge-${index}`}
        renderItem={({ item, index }) => (
          <Challenge
            navigation={navigation}
            firestoreCtrl={firestoreCtrl}
            challengeDB={item}
            key={index}
            testID={`challenge-id-${index}`}
            currentUser={user}
            index={index}
          />
        )}
        ListHeaderComponent={
          <ChallengeDescription
            dBChallengeDescription={titleChallenge}
            onTimerFinished={() => console.info("Timer Finished")}
            testID={`description-id`}
          />
        }
        ListEmptyComponent={
          <ThemedText style={styles.noChallengesText}>
            No challenges to display
          </ThemedText>
        }
        contentContainerStyle={styles.contentContainer}
      />

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
    flex: 1,
    backgroundColor: "#000",
  },
  groupsContainer: {
    overflow: "hidden",
    backgroundColor: "transparent",
    marginBottom: 5,
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
  contentContainer: {
    paddingBottom: 100,
  },
  noChallengesText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
  },
  filterButton: {
    alignItems: "center",
    width: width * 0.5,
  },
  filterText: {
    fontSize: 16,
    color: "#888",
  },
  activeFilterText: {
    fontWeight: "bold",
    color: "#fff",
  },
  underline: {
    marginTop: 5,
    height: 2,
    width: 0.2 * width,
    backgroundColor: "#fff",
  },
});
