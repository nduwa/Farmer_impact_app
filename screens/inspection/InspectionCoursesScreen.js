import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { InspectionCourseCard } from "../../components/InspectionCourseCard";

export const InspectionCoursesScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const { data } = route.params;

  const handleBackButton = () => {
    navigation.navigate("inspectionFarmer", {
      data: data.inspectionType,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg_variant,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: screenHeight * 0.11,
          backgroundColor: colors.white,
          paddingTop: screenHeight * 0.042,
          padding: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            padding: screenWidth * 0.005,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
          }}
        >
          Choose Courses
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          contentContainerStyle={{
            padding: screenWidth * 0.02,
            gap: screenHeight * 0.01,
          }}
          data={["1", "2", "3", "4", "5"]}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <InspectionCourseCard
              data={{
                label: "Erosion Control",
                code: "C05",
                destination: data.inspectionType,
              }}
            />
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    </View>
  );
};
