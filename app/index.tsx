import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";

import WelcomeIntroScreen from "./screens/welcome/intro_screen";
import WelcomeConceptScreen from "./screens/welcome/concept_screen";
import WelcomePersonalScreen from "./screens/welcome/personal_screen";
import WelcomeFinalScreen from "./screens/welcome/final_screen";

// Get the device's screen width
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function WelcomeScreens() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle the scroll event to update the active index
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        onScroll={handleScroll}
      >
        <WelcomeIntroScreen />
        <WelcomeConceptScreen />
        <WelcomePersonalScreen />
        <WelcomeFinalScreen />
      </ScrollView>

      {/* Render the dots, only if not on the last screen */}
      {activeIndex < 3 && (
        <View style={styles.dotContainer}>
          {[0, 1, 2, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeIndex === i ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  dotContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#000",
  },
  activeDot: {
    backgroundColor: "#000",
  },
  inactiveDot: {
    backgroundColor: "transparent",
  },
});
