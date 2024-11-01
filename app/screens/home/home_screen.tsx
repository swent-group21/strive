import React from "react";
import { StyleSheet } from "react-native";
import { TopBar } from "@/components/TopBar";
import { Challenge } from "@/components/home/Challenge";
import { ThemedScrollView } from "@/components/theme/ThemedScrollView";
import { ThemedView } from "@/components/theme/ThemedView";
import { BottomBar } from "@/components/BottomBar";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.bigContainer}>
      <TopBar
        title="Commute by foot"
        leftIcon="people-outline"
        rightIcon="person-circle-outline"
      />

      <ThemedScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Challenge title="Challenge 1"></Challenge>
        <Challenge title="Challenge 2"></Challenge>
        <Challenge title="Challenge 3"></Challenge>
      </ThemedScrollView>

      <BottomBar
        leftIcon="map-outline"
        centerIcon="camera-outline"
        rightIcon="logo-docker"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: "transparent",
    paddingBottom: 10,
  },
  bigContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  contentContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    backgroundColor: "transparent",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});