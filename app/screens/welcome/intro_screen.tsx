import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

// Get the screen dimensions
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function WelcomeIntroScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.ovalShape} />
      <Text style={styles.title}>
        So what is{"\n"}Strive{"\n"}about ?
      </Text>
      <View style={styles.bottomContainer}>
        {/* Placeholder for the image */}
        <Image
          style={styles.image}
          source={require("../../../assets/images/goat.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: SCREEN_WIDTH,
  },
  ovalShape: {
    position: "absolute",
    top: -SCREEN_HEIGHT * 0.95,
    left: -SCREEN_WIDTH * 0.8,
    width: SCREEN_WIDTH * 1.8,
    height: SCREEN_HEIGHT * 1.5,
    borderRadius: SCREEN_WIDTH * 0.9,
    backgroundColor: "#E6BC95",
    justifyContent: "center",
    paddingLeft: SCREEN_WIDTH * 0.3,
  },
  title: {
    paddingTop: SCREEN_HEIGHT * 0.2,
    paddingLeft: SCREEN_WIDTH * 0.05,
    fontSize: 70,
    fontWeight: "900",
    color: "#000",
    lineHeight: 56,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: 30,
    paddingLeft: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
});
