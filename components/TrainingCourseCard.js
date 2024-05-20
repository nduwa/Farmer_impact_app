import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../data/colors";

export const TrainingCourseCard = ({ data }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("TrainingFarmers", {
      data: {
        courseId: data.id,
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
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
        <Text style={{ color: colors.black_letter }}>{data.code}</Text>
        <Text
          style={{
            fontSize: screenHeight * 0.025,
            fontWeight: "500",
            maxWidth: screenWidth * 0.8,
          }}
        >
          {data.label}
        </Text>
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
