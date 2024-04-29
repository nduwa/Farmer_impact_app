import { StatusBar } from "expo-status-bar";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { HistoryCard } from "../../components/HistoryCard";

export const HistoryScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
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
          History
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ padding: 12, gap: 9 }}>
        <HistoryCard />
      </View>
    </View>
  );
};
