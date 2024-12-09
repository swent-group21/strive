import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedIconButton } from "@/components/theme/ThemedIconButton";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

// Get screen width and height
const { width, height } = Dimensions.get("window");

// Define the BottomBarProps type
interface BottomBarProps {
  leftIcon?: string;
  leftAction?: () => void;
  centerIcon?: string;
  centerAction?: () => void;
  rightIcon?: string;
  rightAction?: () => void;
  colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  testID?: string;
}

/**
 * The BottomBar component displays a bottom bar with three icons.
 * @param leftIcon : icon for the left button
 * @param leftAction : action for the left button
 * @param centerIcon : icon for the center button
 * @param centerAction : action for the center button
 * @param rightIcon : icon for the right button
 * @param rightAction : action for the right button
 * @param colorType : color type for the icons
 * @param testID : testID for the component
 * @returns : a component for the bottom bar
 */
export function BottomBar({
  leftIcon,
  leftAction = () => {},
  centerIcon,
  centerAction = () => {},
  rightIcon,
  rightAction = () => {},
  colorType = "white",
  testID,
}: BottomBarProps) {
  const color = useThemeColor({}, colorType);
  return (
    <View style={styles.container} testID="bottom-bar">
      {leftIcon ? (
        <ThemedIconButton
          name={leftIcon}
          onPress={leftAction}
          size={30}
          color={color}
          testID={`bottom-left-icon-${leftIcon}`}
        />
      ) : (
        <View style={styles.placeholder} />
      )}
      {centerIcon ? (
        <ThemedIconButton
          name={centerIcon}
          onPress={centerAction}
          size={30}
          color={color}
          testID={`bottom-center-icon-${centerIcon}`}
        />
      ) : (
        <View style={styles.placeholder} />
      )}
      {rightIcon ? (
        <ThemedIconButton
          name={rightIcon}
          onPress={rightAction}
          size={30}
          color={color}
          testID={`bottom-right-icon-${rightIcon}`}
        />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 10,
    height: height * 0.08,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "transparent",
  },
  placeholder: {
    width: 30,
  },
});
