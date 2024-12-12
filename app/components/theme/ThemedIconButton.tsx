import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon, IconProps } from "react-native-elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface ThemedIconButtonProps extends IconProps {
  onPress: () => void;
  iconType?: string;
  size?: number;
  colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  lightColor?: string;
  darkColor?: string;
  paddingLeft?: number;
  testID?: string;
}

/**
 * ThemedIconButton component which wraps the Icon component from react-native-elements
 * @param lightColor : light color for the icon
 * @param darkColor : dark color for the icon
 * @param onPress : function to execute on press
 * @param iconType : type of the icon
 * @param size : size of the icon
 * @param paddingLeft : padding left for the icon
 * @param colorType : color type for the icon
 * @param testID : testID for the component
 * @returns ThemedIconButton Component
 */
export function ThemedIconButton({
  lightColor,
  darkColor,
  onPress,
  iconType = "ionicon",
  size,
  paddingLeft,
  colorType,
  testID,
  ...props
}: Readonly<ThemedIconButtonProps>) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorType ?? "backgroundPrimary",
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      {...(testID && { testID })}
    >
      <Icon
        testID={testID}
        color={color}
        type={iconType}
        onPress={onPress}
        size={size}
        {...props}
      />
    </TouchableOpacity>
  );
}
