import { Dimensions, StyleSheet } from "react-native";
import { colors } from "./colors";

const screenWidth = Dimensions.get("window").width;

const sidebarWidth = screenWidth * 0.75;

export const globalStyles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "flex-start",
  },
  sidebar: {
    flex: 1,
    backgroundColor: colors.white,
    width: sidebarWidth,
  },
  labelNormal: {
    opacity: 1,
    fontWeight: "regular",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
