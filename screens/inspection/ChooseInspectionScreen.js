import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { InspectionItem } from "../../components/InspectionItem";
import { useTranslation } from "react-i18next";

export const ChooseInspectionScreen = () => {
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
          {t("inspection.homepage_title")}
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
            <InspectionItem
              label={t("inspection.inspection_list.generic_inspection")}
              destination={"Generic Inspection"}
            />
            <InspectionItem
              label={t("inspection.inspection_list.advanced_inspection")}
              destination={"Advanced Inspection"}
            />
            <InspectionItem
              label={t("inspection.inspection_list.special_inspection")}
              destination={"Special Inspection"}
            />
            <InspectionItem
              label={t("inspection.inspection_list.cafe_inspection")}
              destination={"Cafe Inspection"}
            />
            <InspectionItem
              label={t("inspection.inspection_list.rfa_inspection")}
              destination={"RFA Inspection"}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
