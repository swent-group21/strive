import React from "react";
import { TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { TouchableOpacityProps } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { TextStyles } from "@/constants/Text";

interface ThemedTextButtonProps extends TouchableOpacityProps {
  lightColor?: string;
  darkColor?: string;
  colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  textColorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  textType?: keyof typeof TextStyles;
  testID?: string;
}

/**
 * ThemedTextButton component which wraps the TouchableOpacity component from react-native with a text
 * @param lightColor : light color for the button
 * @param darkColor : dark color for the button
 * @param colorType : color type for the button
 * @param text : text for the button
 * @param onPress : function to execute on press
 * @param style : style for the button
 * @param textStyle : style for the text
 * @param textColorType : color type for the text
 * @param textType : type of the text
 * @param testID : testID for the component
 * @returns ThemedTextButton Component
 */
export function ThemedTextButton({
  lightColor,
  darkColor,
  text,
  onPress,
  style,
  textStyle,
  textType,
  colorType,
  textColorType = "backgroundPrimary",
  testID,
}: Readonly<ThemedTextButtonProps>) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorType ?? "backgroundSecondary",
  );

  return (
    <TouchableOpacity
      style={[style, { backgroundColor: color }]}
      onPress={onPress}
      {...(testID && { testID })}
    >
      <ThemedText style={[textStyle]} colorType={textColorType} type={textType}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}
