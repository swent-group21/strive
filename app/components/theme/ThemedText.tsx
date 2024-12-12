import { Text, type TextProps } from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { TextStyles } from "@/constants/Text";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  type?: keyof typeof TextStyles;
};

/**
 * ThemedText component which wraps the Text component from react-native
 * @param lightColor : light color for the text
 * @param darkColor : dark color for the text
 * @param colorType : color type for the text
 * @param type : type of the text
 * @returns ThemedText Component
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  colorType,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorType ?? "textPrimary",
  );

  return <Text style={[{ color }, TextStyles[type], style]} {...rest} />;
}
