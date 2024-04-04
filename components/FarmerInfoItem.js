import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";

export const FarmerInfoItem = ({ label, info }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flexDirection: "column",
        gap: screenHeight * 0.008,
        marginTop: screenHeight * 0.02,
      }}
    >
      <Text
        style={{
          fontSize: screenWidth * 0.04,
          fontWeight: "500",
          color: colors.black,
          marginLeft: screenWidth * 0.001,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          borderColor: colors.bg_variant_font,
          backgroundColor: colors.white_variant,
          borderWidth: 0.3,
          borderRadius: screenHeight * 0.01,
          padding: screenHeight * 0.01,
          fontWeight: "500",
          fontSize: screenWidth * 0.04,
          color: colors.blue_font,
          width: screenWidth * 0.34,
        }}
      >
        {info}
      </Text>
    </View>
  );
};
