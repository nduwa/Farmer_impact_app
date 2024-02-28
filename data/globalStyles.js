import { Dimensions, StyleSheet } from "react-native";
import { colors } from "./colors";

const screenWidth = Dimensions.get("window").width;

const sidebarWidth = screenWidth * 0.745;

export const globalStyles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "flex-start",
  },
  sidebar: {
    flex: 1,
    backgroundColor: colors.bg_variant,
    width: sidebarWidth,
  },
  labelNormal: {
    opacity: 1,
    fontWeight: "regular",
    fontSize: screenWidth * 0.035,
    fontWeight: "bold",
    textAlign: "center",
  },
});
