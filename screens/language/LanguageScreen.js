import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Button,
  Dimensions,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleIconButton from "../../components/SimpleIconButton";

export const LanguageScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    await SecureStore.setItemAsync("rtc-user-language", lng);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {};
    }, [])
  );
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
          {t("settings.title")}
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 12,
          gap: 9,
        }}
      >
        <SimpleIconButton
          selected={currentLanguage === "en"}
          label={t("settings.english")}
          width="100%"
          color={colors.blue_font}
          labelColor="white"
          handlePress={() => changeLanguage("en")}
          icon={<Entypo name="language" size={24} color="white" />}
        />
        <SimpleIconButton
          selected={currentLanguage === "kiny"}
          label={t("settings.kinyarwanda")}
          width="100%"
          color={colors.blue_font}
          labelColor="white"
          handlePress={() => changeLanguage("kiny")}
          icon={<FontAwesome name="language" size={24} color="white" />}
        />
        <SimpleIconButton
          selected={currentLanguage === "fr"}
          label={t("settings.french")}
          width="100%"
          color={colors.blue_font}
          labelColor="white"
          handlePress={() => changeLanguage("fr")}
          icon={<FontAwesome6 name="language" size={24} color="white" />}
        />
      </View>
    </View>
  );
};
