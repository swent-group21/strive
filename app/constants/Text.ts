/*
    This file contains the text styles that are used throughout the application.
    The styles are defined in an object and exported.
*/

import { StyleSheet } from "react-native";

/**
 * Text styles that are used in the app
 */
export const TextStyles = StyleSheet.create({
  superTitle: {
    fontSize: 67,
    fontWeight: "900",
    lineHeight: 61,
  },
  title: {
    fontSize: 56,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 42,
    fontWeight: "bold",
  },
  description: {
    fontSize: 25,
    fontWeight: "800",
  },

  default: {
    fontSize: 16,
  },
  small: {
    fontSize: 12,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  smallSemiBold: {
    fontSize: 12,
    fontWeight: "600",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
