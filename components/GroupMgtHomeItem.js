import { useNavigation } from "@react-navigation/native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";

export const GroupMgtHomeItem = ({
  label,
  destination,
  badgeNum = 0,
  use = null,
  active = true,
  data = null,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.replace(destination, { data });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!active}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        width: "100%",
        height: screenHeight * 0.07,
        borderRadius: screenWidth * 0.02,
        padding: screenWidth * 0.03,
        opacity: active ? 1 : 0.7,
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: screenWidth * 0.045, fontWeight: "500" }}>
        {label}
      </Text>
      {use === "pending" ? (
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 100,
            borderColor: colors.white,
            borderWidth: screenWidth * 0.004,
            alignItems: "center",
            justifyContent: "center",
            minWidth: screenHeight * 0.043,
            minHeight: screenHeight * 0.043,
            padding: screenWidth * 0.01,
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: "500",
              fontSize: screenWidth * 0.04,
            }}
          >
            {badgeNum}
          </Text>
        </View>
      ) : (
        <AntDesign name="right" size={screenHeight * 0.034} color="black" />
      )}
    </TouchableOpacity>
  );
};
