import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { UpdateFarmerItem } from "../../../components/UpdateFarmerItem";
import { useTranslation } from "react-i18next";

export const FarmerUpdateHome = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { t } = useTranslation();

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
          {t("update_farmer.title")}
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
        <ScrollView>
          <View
            style={{
              padding: screenWidth * 0.02,
              gap: screenHeight * 0.014,
            }}
          >
            <UpdateFarmerItem
              label={t("update_farmer.farmer_trees")}
              destination={"UpdateTreesScreen"}
            />
            <UpdateFarmerItem
              label={t("update_farmer.farmer_details")}
              destination={"FarmerUpdateScreen"}
            />
            <UpdateFarmerItem
              label={t("update_farmer.farm_details")}
              destination={"FarmUpdateScreen"}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
