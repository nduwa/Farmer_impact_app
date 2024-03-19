import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
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
import { ScRecordItem } from "../../components/ScRecordItem";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";

export const ScJournal = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const [journals, setJournals] = useState([]);

  const handleBackButton = () => {
    navigation.navigate("Homepage");
  };

  useEffect(() => {
    if (journals.length > 0) {
      console.log(journals);
    }
  }, [journals.length]);

  useEffect(() => {
    const fetchData = async () => {
      retrieveDBdata({
        tableName: "rtc_transactions",
        setData: setJournals,
        queryArg:
          "SELECT site_day_lot,transaction_date,kilograms,bad_kilograms FROM rtc_transactions",
      });
    };

    fetchData();
  }, []);
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
            padding: 5,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
            marginLeft: screenWidth * 0.12,
          }}
        >
          Site Collector Daily Journal
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 9 }}>
        <ScRecordItem
          data={{ date: "19/02/2024", records: "5", weight: "58 Kg(s)" }}
        />
        <ScRecordItem
          data={{ date: "04/03/2024", records: "2", weight: "18 Kg(s)" }}
        />
      </ScrollView>
    </View>
  );
};
