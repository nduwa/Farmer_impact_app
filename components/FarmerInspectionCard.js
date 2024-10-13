import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import { FarmerInfoItem } from "./FarmerInfoItem";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";

const FarmerInspectionCard = ({ data, setModal }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleChildrenUpdate = () => {
    setModal({ open: true, data });
  };
  const handleNewInspection = () => {
    if (data.destination === "Advanced Inspection") {
      navigation.navigate("inspectionCourses", {
        data: {
          inspectionType: data.destination,
          farmerId: data.farmerId,
          farmerName: data.farmerName,
          householdId: data.householdKey,
        },
      });
      return;
    }

    navigation.navigate("inspectionQuestions", {
      data: {
        inspectionType: data.destination,
        farmerId: data.farmerId,
        farmerName: data.farmerName,
        householdId: data.householdKey,
      },
    });
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        padding: screenWidth * 0.03,
        borderRadius: screenHeight * 0.01,
        gap: screenHeight * 0.001,
        elevation: 5,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            textAlign: "center",
            fontSize: screenWidth * 0.045,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {data.farmerId} / {data.farmerName}
        </Text>
        <View
          style={{
            width: "90%",
            height: 1,
            backgroundColor: colors.secondary_variant,
          }}
        />
        <Text
          style={{
            fontWeight: "600",
            textAlign: "center",
            fontSize: screenWidth * 0.045,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {data.children} {t("inspection.farmer_card.children")}
        </Text>
        <View
          style={{
            width: "90%",
            height: 1,
            backgroundColor: colors.secondary_variant,
          }}
        />
      </View>
      <View
        style={{
          paddingHorizontal: screenWidth * 0.04,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <FarmerInfoItem
            label={t("inspection.farmer_card.cell")}
            info={data.cell}
          />
          <FarmerInfoItem
            label={t("inspection.farmer_card.village")}
            info={data.village}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <FarmerInfoItem
            label={t("inspection.farmer_card.prd_tree")}
            info={data.prodTrees}
          />
          <FarmerInfoItem
            label={t("inspection.farmer_card.tot_tree")}
            info={data.totTrees}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: screenWidth * 0.045,
          marginTop: screenHeight * 0.01,
          height: screenHeight * 0.07,
        }}
      >
        <CustomButton
          bg={colors.black}
          color={"white"}
          width="48%"
          text={t("inspection.farmer_card.update_children")}
          bdcolor="transparent"
          mt={8}
          mb={8}
          fontSizeRatio={0.04}
          radius={7}
          paddingRatio={0.014}
          disabled={true}
          onPress={handleChildrenUpdate}
        />
        <CustomButton
          bg={colors.secondary}
          color={"white"}
          width="48%"
          text={t("inspection.farmer_card.new_inspection_btn")}
          bdcolor="transparent"
          mt={8}
          mb={8}
          fontSizeRatio={0.04}
          radius={7}
          paddingRatio={0.014}
          disabled={false}
          onPress={handleNewInspection}
        />
      </View>
    </View>
  );
};

export default memo(FarmerInspectionCard);
