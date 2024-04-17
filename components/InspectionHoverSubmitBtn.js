import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const InspectionHoverSubmitBtn = ({
  handlePress,
  currentPage = null,
  totalPages = null,
  active = true,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <TouchableOpacity
      disabled={!active}
      style={{
        position: "absolute",
        backgroundColor: active ? colors.secondary : colors.black_letter,
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
      {currentPage >= totalPages ? (
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
