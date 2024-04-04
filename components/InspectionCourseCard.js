import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../data/colors";

export const InspectionCourseCard = ({ data }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        padding: screenHeight * 0.01,
        borderRadius: screenHeight * 0.01,
        elevation: 3,
      }}
    >
      <View>
        <Text style={{ fontSize: screenHeight * 0.025, fontWeight: "500" }}>
          {data.label}
        </Text>
        <Text style={{ color: colors.black_letter }}>{data.code}</Text>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="right" size={screenHeight * 0.034} color="black" />
      </View>
    </TouchableOpacity>
  );
};
