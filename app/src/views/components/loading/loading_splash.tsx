import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "@/src/views/components/theme/themed_view";
import { ThemedText } from "@/src/views/components/theme/themed_text";

export function LoadingSplash({
  loading_text,
  testID,
}: {
  loading_text: string;
  testID?: string;
}) {
  return (
    <ThemedView style={styles.container} testID={testID}>
      <ActivityIndicator
        testID="loading-indicator"
        size="large"
        style={styles.indicator}
      />
      <ThemedText testID="loading-text">{loading_text}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    marginBottom: 30,
    transform: [{ scale: 1.5 }],
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
