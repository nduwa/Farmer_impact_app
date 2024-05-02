import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";

export const InspectionHoverPrevBtn = ({ handlePress, topRatio = 0.75 }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        backgroundColor: colors.black,
        borderColor: colors.white,
        borderWidth: screenHeight * 0.003,
        borderRadius: screenWidth * 0.5,
        padding: screenHeight * 0.018,
        marginTop: screenHeight * topRatio,
        marginLeft: screenWidth * 0.81,
        elevation: 2,
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          color: colors.white,
          fontWeight: "700",
          fontSize: screenWidth * 0.03,
        }}
      >
        Prev Page
      </Text>
    </TouchableOpacity>
  );
};
