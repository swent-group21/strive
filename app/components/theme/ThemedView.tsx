import { View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import React from "react";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  colorType,

  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorType ?? "backgroundPrimary",
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
