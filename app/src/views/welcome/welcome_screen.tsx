import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";

import WelcomeIntroScreen from "@/src/views/welcome/intro_screen";
import WelcomeConceptScreen from "@/src/views/welcome/concept_screen";
import WelcomePersonalScreen from "@/src/views/welcome/personal_screen";
import WelcomeFinalScreen from "@/src/views/welcome/final_screen";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DBUser } from "@/src/models/firebase/TypeFirestoreCtrl";

// Get the device's screen width
const SCREEN_WIDTH = Dimensions.get("window").width;

/**
 * Welcome screens
 * @param setUser : function to set the user object
 * @param navigation : navigation object
 * @param firestoreCtrl : FirestoreCtrl object
 * @returns : a set of screens for welcoming the user
 */
export default function WelcomeScreens({
  setUser,
  navigation,
}: {
  readonly setUser: React.Dispatch<React.SetStateAction<DBUser | null>>;
  readonly navigation: any;
}) {
  const color = useThemeColor({}, "textPrimary");
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
        testID="welcome-scrollview"
      >
        <WelcomeIntroScreen />
        <WelcomeConceptScreen />
        <WelcomePersonalScreen />

        <WelcomeFinalScreen setUser={setUser} navigation={navigation} />
      </ScrollView>

      {/* Render the dots, only if not on the last screen */}
      {activeIndex < 3 && (
        <View style={styles.dotContainer}>
          {[0, 1, 2, 4].map((i) => (
            <View
              key={i}
              style={[
                [styles.dot, { borderColor: color }],
                activeIndex === i
                  ? { backgroundColor: color }
                  : styles.inactiveDot,
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
  },
  inactiveDot: {
    backgroundColor: "transparent",
  },
});
