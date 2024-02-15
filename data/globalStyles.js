import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "flex-start",
  },
  imageHome: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  imageWishlist: {
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
  },
  labelTouched: {
    opacity: 0.4,
    fontWeight: "regular",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelNormal: {
    opacity: 1,
    fontWeight: "regular",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
