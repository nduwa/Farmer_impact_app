import { useNavigation } from "@react-navigation/native";
import { Dimensions, Text, TouchableOpacity } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";

export const WetmillItem = ({ label, actionFn = null, destination = null }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handlePress = () => {
    if (actionFn) {
      actionFn(true);
    } else if (destination) {
      navigation.replace(destination);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        width: "100%",
        height: screenHeight * 0.07,
        borderRadius: screenWidth * 0.02,
        padding: screenWidth * 0.03,
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: screenWidth * 0.045, fontWeight: "500" }}>
        {label}
      </Text>
      <AntDesign name="right" size={screenHeight * 0.034} color="black" />
    </TouchableOpacity>
  );
};
