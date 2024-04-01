import { Dimensions, StyleSheet } from "react-native";
import { colors } from "./colors";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

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
  buyCoffeeModalStyles: {
    position: "absolute",
    width: "100%",
    height: screenHeight * 0.5,
    padding: 20,
    gap: 20,
    backgroundColor: colors.bg_variant,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  labelNormal: {
    opacity: 1,
    fontWeight: "regular",
    fontSize: screenWidth * 0.035,
    fontWeight: "bold",
    textAlign: "center",
  },
});
