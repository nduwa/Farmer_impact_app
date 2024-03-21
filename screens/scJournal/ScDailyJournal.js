import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
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
    navigation.navigate("Homepage", { data: null });
  };

  const dateExtraction = (str) => {
    let year = `20${str.substring(8, 10)}`;
    let month = str.substring(12);
    let day = str.substring(10, 12);

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      retrieveDBdata({
        tableName: "rtc_transactions",
        setData: setJournals,
        queryArg:
          "SELECT site_day_lot,SUM(kilograms) AS kgsGood,SUM(bad_kilograms) AS kgsBad, COUNT(*) AS recordCount FROM rtc_transactions GROUP BY site_day_lot ORDER BY site_day_lot;",
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
      {journals.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={journals}
          renderItem={({ item }) => (
            <ScRecordItem
              data={{
                date: dateExtraction(item.site_day_lot),
                records: item.recordCount,
                weight: item.kgsGood + item.kgsBad,
                site_day_lot: item.site_day_lot,
              }}
            />
          )}
          keyExtractor={(item) => journals.indexOf(item)}
        />
      )}
    </View>
  );
};
