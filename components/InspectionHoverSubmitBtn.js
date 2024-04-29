import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export const InspectionHoverSubmitBtn = ({
  handlePress,
  currentPage = null,
  totalPages = null,
  active = true,
  mode = "submit",
}) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const [color, setColor] = useState(colors.secondary);

  useEffect(() => {
    if (mode === "submit") {
      setColor(active ? colors.secondary : colors.black_letter);
    } else if (mode === "pagination") {
      setColor(active ? colors.blue_font : colors.black_letter);
    }
  });

  return (
    <TouchableOpacity
      disabled={!active}
      style={{
        position: "absolute",
        backgroundColor: color,
        borderColor: colors.white,
        borderWidth: screenHeight * 0.003,
        borderRadius: screenWidth * 0.5,
        padding: screenHeight * 0.018,
        marginTop: screenHeight * 0.85,
        marginLeft: screenWidth * 0.8,
        opacity: active ? 1 : 0.4,
        elevation: 4,
      }}
      onPress={handlePress}
    >
      {currentPage >= totalPages && mode === "submit" ? (
        <MaterialCommunityIcons
          name="folder-check"
          size={35}
          color={colors.white}
        />
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
