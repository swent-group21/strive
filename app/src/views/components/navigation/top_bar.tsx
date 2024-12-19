import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { ThemedIconButton } from "@/src/views/components/theme/themed_icon_button";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/src/views/components/theme/themed_text";
import { useTopBarViewModel } from "@/src/viewmodels/components/navigation/TopBarViewModel";

// Get screen width and height
const { width, height } = Dimensions.get("window");

// Define the TopbarProps type
interface TopbarProps {
  leftIcon?: string;
  leftAction?: () => void;
  rightIcon?: string;
  rightAction?: () => void;
  title?: string;
  colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  testID?: string;
}

/**
 * The TopBar component displays a top bar with two icons and a title.
 * @param leftIcon : icon for the left button
 * @param leftAction : action for the left button
 * @param rightIcon : icon for the right button
 * @param rightAction : action for the right button
 * @param title : title for the top bar
 * @param colorType : color type for the icons
 * @param testID : testID for the component
 * @returns : a component for the top bar
 */
export function TopBar({
  leftIcon,
  leftAction = () => {},
  rightIcon,
  rightAction = () => {},
  title,
  colorType = "white",
  testID,
}: {
  readonly leftIcon?: string;
  readonly leftAction?: () => void;
  readonly rightIcon?: string;
  readonly rightAction?: () => void;
  readonly title?: string;
  readonly colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  testID?: string;
}) {
  const { color, isLeftPP, isRightPP } = useTopBarViewModel({
    leftIcon,
    rightIcon,
    colorType,
  });

  // Determine the left content
  const leftContent = leftIcon ? (
    isLeftPP(leftIcon) ? (
      <TouchableOpacity onPress={leftAction} testID={testID}>
        <Image
          source={{ uri: leftIcon }}
          style={styles.iconImage}
          testID={`topLeftImage-${leftIcon}`}
        />
      </TouchableOpacity>
    ) : (
      <ThemedIconButton
        name={leftIcon}
        onPress={leftAction}
        size={30}
        color={color}
        testID={`topLeftIcon-${leftIcon}`}
      />
    )
  ) : (
    <View style={styles.placeholder} />
  );

  // Determine the right content
  const rightContent = rightIcon ? (
    isRightPP(rightIcon) ? (
      <TouchableOpacity onPress={rightAction}>
        <Image
          source={{ uri: rightIcon }}
          style={styles.iconImage}
          testID={`topRightImage-${rightIcon}`}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={rightAction}>
        <View style={styles.defaultAvatar}>
          <ThemedText
            style={styles.avatarText}
            testID={`topRightIcon-${rightIcon}`}
          >
            {title?.charAt(0).toUpperCase() || "A"} {/* Default letter */}
          </ThemedText>
        </View>
      </TouchableOpacity>
    )
  ) : (
    <View style={styles.placeholder} />
  );

  return (
    <View style={styles.container} testID="topBar">
      {leftContent}
      {Boolean(title) && (
        <ThemedText
          style={styles.title}
          colorType={colorType}
          testID={`topTitle-${title}`}
        >
          {title}
        </ThemedText>
      )}
      {rightContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 10,
    height: height * 0.08,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    //width: width * 0.5,
    textAlign: "center",
  },
  placeholder: {
    width: 30,
  },
  iconImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 40,
  },
});
