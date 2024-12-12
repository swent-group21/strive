import { ScrollView, type ScrollViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import React from "react";

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorType?: keyof typeof Colors.dark & keyof typeof Colors.light;
};

/**
 * ThemedScrollView component which wraps the ScrollView component from react-native
 * @param lightColor : light color for the ScrollView
 * @param darkColor : dark color for the ScrollView
 * @param colorType : color type for the ScrollView
 * @returns ThemedScrollView Component
 */
export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  colorType,
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorType ?? "backgroundPrimary",
  );

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
