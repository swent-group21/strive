import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedTextButton } from "@/src/views/components/theme/themed_text_button";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

/**
 * Group list item component
 * @param name : name of the group
 * @returns GroupListItem Component
 */
export const GroupListItem = ({
  name,
  challengeTitle,
  isJoined,
  handleJoin,
}: {
  readonly name: string;
  readonly challengeTitle?: string;
  readonly isJoined: boolean;
  readonly handleJoin: () => void;
}) => {
  return (
    <ThemedView style={styles.listItem} testID={`group-list-item-${name}`}>
      {/* Display the group as an icon with its name */}
      <ThemedView style={styles.groupIcon} testID={"group-icon"}>
        <ThemedTextButton
          style={styles.icon}
          onPress={() => {}}
          text={name}
          textStyle={styles.titleIcon}
          textColorType="textOverLight"
          testID="group-pressable-button"
        ></ThemedTextButton>
      </ThemedView>

      {/* Display the group's challenge */}
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.groupChallenge}>{challengeTitle}</ThemedText>
      </ThemedView>

      {/* Display the join button */}
      {isJoined ? (
        <ThemedText style={styles.groupCheck}>Joined ✓</ThemedText>
      ) : (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoin}
          testID={`join-button-${name}`}
        >
          <ThemedText style={styles.joinButtonText}>{"JOIN"}</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  // Style for the group list item
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#000",
    height: "auto",
  },

  // Style for the group icon and its name
  icon: {
    width: 80,
    height: 60,
    borderRadius: 25,
    //backgroundColor: "#ccc",
    marginRight: 2,
  },
  groupIcon: {
    margin: 10,
    alignItems: "flex-start",
  },
  titleIcon: {
    flex: 1,
    width: width * 0.8,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 17,
    fontWeight: "bold",
  },

  // Style for the group's challenge
  textContainer: {
    backgroundColor: "transparent",
    width: width * 0.5,
    paddingRight: 10,
  },
  groupChallenge: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    height: "auto",
  },

  // Style for the group check if already joined
  groupCheck: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "auto",
  },

  // Style for the join button
  joinButton: {
    backgroundColor: "#333",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: "auto",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
