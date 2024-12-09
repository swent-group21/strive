import React from "react";
import { TextInput, TextInputProps, TextStyle, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface ThemedTextInputProps extends TextInputProps {
  title?: string;
  titleStyle?: TextStyle;
  viewWidth?: any;
  type?: "none" | "email" | "password";
  lightColor?: string;
  darkColor?: string;
  colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  borderColorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
  testID?: string;
}

export function ThemedTextInput({
  lightColor,
  darkColor,
  colorType,
  borderColorType,
  style,
  title,
  titleStyle,
  viewWidth = "100%",
  type = "none",
  testID,
  ...props
}: Readonly<ThemedTextInputProps>) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorType ?? "textPrimary",
  );
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    borderColorType ?? "textPrimary",
  );
  const getInputProps = (
    type: "none" | "email" | "password",
  ): TextInputProps => {
    switch (type) {
      case "email":
        return {
          autoComplete: "email",
          inputMode: "email",
          keyboardType: "email-address",
          autoCapitalize: "none",
          placeholder: "example@your.domain",
        };
      case "password":
        return {
          autoComplete: "password",
          secureTextEntry: true,
          placeholder: "**********",
        };
      default:
        return {};
    }
  };

  return (
    <View testID={testID} style={{ gap: 5, width: viewWidth }}>
      {Boolean(title) && (
        <ThemedText style={titleStyle} type={"defaultSemiBold"}>
          {title}
        </ThemedText>
      )}
      <TextInput
        style={[{ color: color, borderColor: borderColor }, style]}
        placeholderTextColor={borderColor}
        {...getInputProps(type)}
        {...props}
      />
    </View>
  );
}
