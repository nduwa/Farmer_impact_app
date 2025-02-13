import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
} from "react-native";
import { colors } from "../data/colors";
import { globalStyles } from "../data/globalStyles";
import { FarmerMgtItem } from "./FarmerMgtItem";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const FarmerMgtModal = ({ setIsFarmerModalOpen }) => {
  const [initClose, setInitClose] = useState(false);
  const userState = useSelector((state) => state.user);
  const { t } = useTranslation();

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const modalHeight = screenHeight * 0.6;
  const animation = new Animated.Value(0);

  const isAccessable = (mod) => {
    return userState.accessModules?.some(
      (module) => module.module_name === mod
    );
  };

  const handleClick = () => {
    setInitClose(true);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [initClose ? 0 : modalHeight, initClose ? modalHeight : 0],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      easing: initClose ? Easing.linear : Easing.back(),
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (initClose) setIsFarmerModalOpen(false);
    });
  }, [initClose]);

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View
        style={{
          flex: 1,
          position: "absolute",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          backgroundColor: colors.black_a,
          padding: 10,
          zIndex: 10,
        }}
      >
        <Animated.View
          style={[
            globalStyles.buyCoffeeModalStyles,
            { transform: [{ translateY }] },
          ]}
        >
          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 20 }}
          >
            <View
              style={{
                backgroundColor: colors.secondary,
                height: 6,
                width: 85,
                borderRadius: 20,
              }}
            />
            <Text
              style={{
                fontWeight: "700",
                fontSize: 23,
                color: colors.secondary,
              }}
            >
              {t("homepage.farmer_modal.title")}
            </Text>
          </View>

          <View style={{ flex: 1, gap: 16 }}>
            <FarmerMgtItem
              setIsFarmerModalOpen={setIsFarmerModalOpen}
              destination={"FarmerRegistration"}
              label={t("homepage.farmer_modal.register")}
              isActive={isAccessable("Register")}
            />
            <FarmerMgtItem
              setIsFarmerModalOpen={setIsFarmerModalOpen}
              destination={"AssignGroupsHome"}
              label={t("homepage.farmer_modal.groups")}
              isActive={isAccessable("Groups")}
            />
            <FarmerMgtItem
              setIsFarmerModalOpen={setIsFarmerModalOpen}
              destination={"FarmerUpdateHome"}
              label={t("homepage.farmer_modal.update")}
              isActive={isAccessable("Update Farmers")}
            />
            <FarmerMgtItem
              setIsFarmerModalOpen={setIsFarmerModalOpen}
              destination={"SelectFarmerDeleteScreen"}
              label={t("homepage.farmer_modal.remove")}
              isActive={isAccessable("Remove farmers")}
            />
            <FarmerMgtItem
              setIsFarmerModalOpen={setIsFarmerModalOpen}
              destination={"WeeklyReportScreen"}
              label={t("homepage.farmer_modal.report")}
              isActive={isAccessable("Training")}
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
