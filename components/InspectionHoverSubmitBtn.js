import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export const InspectionHoverSubmitBtn = ({
  handlePress,
  currentPage = null,
  totalPages = null,
  topRatio = 0.85,
  active = true,
  mode = "submit",
  positive = true,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const [color, setColor] = useState(colors.secondary);

  useEffect(() => {
    if (mode === "submit") {
      let clr =
        active && positive
          ? colors.green
          : active && !positive
          ? colors.red
          : colors.black_letter;
      setColor(clr);
    } else if (mode === "pagination") {
      setColor(active ? colors.blue_font : colors.black_letter);
    }
  });

  return (
    <TouchableOpacity
      disabled={!active}
      style={{
        position: "absolute",
        backgroundColor:
          currentPage >= totalPages && mode === "submit"
            ? color
            : colors.blue_font,
        borderColor: colors.white,
        borderWidth: screenHeight * 0.003,
        borderRadius: screenWidth * 0.5,
        padding: screenHeight * 0.018,
        marginTop: screenHeight * topRatio,
        marginLeft: screenWidth * 0.8,
        opacity: active ? 1 : 0.4,
        elevation: 4,
      }}
      onPress={handlePress}
    >
      {currentPage >= totalPages && mode === "submit" ? (
        <>
          {positive ? (
            <MaterialCommunityIcons name="check" size={35} color="white" />
          ) : (
            <MaterialCommunityIcons name="close" size={35} color="white" />
          )}
        </>
      ) : (
        <Text
          style={{
            color: colors.white,
            fontWeight: "700",
            fontSize: screenWidth * 0.04,
          }}
        >
          Next Page
        </Text>
      )}
    </TouchableOpacity>
  );
};
