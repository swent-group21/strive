/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

/**
 * Colors that are used in the app
 */
export const Colors = {
  light: {
    transparent: "transparent",
    backgroundPrimary: "white",
    backgroundSecondary: "#F7E9D3",
    textPrimary: "#371400",
    textSecondary: "#FBFAFA",
    textOverLight: "#371400",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    white: "#371400",
  },
  dark: {
    transparent: "transparent",
    backgroundPrimary: "black",
    backgroundSecondary: "#FFDAC6",
    textPrimary: "#FBFAFA",
    textSecondary: "#371400",
    textOverLight: "#371400",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    white: "#FBFAFA",
  },
};
