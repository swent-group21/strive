import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { Colors } from "../../constants/Colors";
import { ThemedText } from "../theme/ThemedText";
import { ThemedView } from "../theme/ThemedView";
import { ThemedIconButton } from "../theme/ThemedIconButton";
import { ThemedTextButton } from "../theme/ThemedTextButton";
import FirestoreCtrl, { DBUser } from "../../app/models/firebase/FirestoreCtrl";
import React from "react";

const { width, height } = Dimensions.get("window");

export function GroupIcon({
  groupDB,
  index,
  firestoreCtrl,
  navigation,
  testID,
}: any) {
  // Display loading state or handle absence of challenge data
  if (!groupDB) {
    return <ThemedText>Loading Group...</ThemedText>;
  } else {
    console.log("groupDB: ", groupDB);
    return (
      <ThemedView style={styles.container} testID={testID}>
        <ThemedTextButton
          style={styles.heading}
          onPress={() => {navigation.navigate("GroupScreen", {group: groupDB})}}
          text={groupDB.name}
          textStyle={styles.titleText}
          textColorType="textOverLight"
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