import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/theme/ThemedText";
import { ThemedView } from "@/components/theme/ThemedView";
import { ThemedTextButton } from "@/components/theme/ThemedTextButton";

const { width, height } = Dimensions.get("window");

/**
 * The Group component displays a group.
 * @param groupDB : the group object
 * @param index : the index of the group
 * @param firestoreCtrl : FirestoreCtrl object
 * @param navigation : navigation object
 * @param testID : testID for the component
 * @returns : a component for the group
 */
export default function GroupIcon({
  groupDB,
  navigation,
  firestoreCtrl,
  index,
  testID,
}: any) {
  // Display loading state or handle absence of challenge data
  if (!groupDB) {
    return <ThemedText>Loading Group...</ThemedText>;
  } else {
    return (
      <ThemedView style={styles.container} testID={testID}>
        <ThemedTextButton
          style={styles.heading}
          onPress={() => {
            navigation.navigate("GroupScreen", { currentGroup: groupDB });
          }}
          text={groupDB.name}
          textStyle={styles.titleText}
          textColorType="textOverLight"
          testID="group-pressable-button"
        ></ThemedTextButton>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    //flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 15,
    padding: 8,
    //gap: 6,
    color: "transparent",
    fontSize: 5,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.dark.backgroundPrimary,
    width: width * 0.23,
    height: width * 0.2,
    borderRadius: 20,
    margin: 10,
    alignItems: "center",
  },

  titleText: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    textAlign: "right",
    textAlignVertical: "bottom",
    fontSize: 20,
    fontWeight: "bold",
  },
});
