import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { colors } from "../../data/colors";
import { WetmillItem } from "../../components/WetmillItem";
import { WetmillAuditModal } from "../../components/WetmillAuditModal";
import { useState } from "react";

export const WetmillHomeScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const [isWetmillModalOpen, setIsWetmillModalOpen] = useState(false);

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
          Wet Mill Audit
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
            <WetmillItem
              label={"New Audit Report"}
              actionFn={setIsWetmillModalOpen}
            />
            <WetmillItem
              label={"Pending Reports"}
              destination={"PendingAuditScreen"}
            />
          </View>
        </ScrollView>
      </View>

      {isWetmillModalOpen && (
        <WetmillAuditModal setIsWetmillModalOpen={setIsWetmillModalOpen} />
      )}
    </View>
  );
};
