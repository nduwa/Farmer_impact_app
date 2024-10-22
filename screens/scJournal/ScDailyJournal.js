import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
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
import { useSelector } from "react-redux";

export const ScJournal = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const userState = useSelector((state) => state.user);

  const [journals, setJournals] = useState([]);

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const dateExtraction = (str) => {
    let substr = str.substring(str.length - 6);

    let year = `20${substr.substring(0, 2)}`;
    let month = substr.substring(4);
    let day = substr.substring(2, 4);

    return `${day}/${month}/${year}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        retrieveDBdata({
          tableName: "rtc_transactions",
          setData: setJournals,
          queryArg: `SELECT site_day_lot,SUM(kilograms) AS kgsGood,SUM(bad_kilograms) AS kgsBad, COUNT(*) AS recordCount FROM rtc_transactions WHERE _kf_station='${userState.userData.staff._kf_Station}' AND uploaded='0' GROUP BY site_day_lot ORDER BY site_day_lot;`,
        });
      };

      fetchData();
      return () => {
        setJournals([]);
      };
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
          Site Collector Daily Journal
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {journals.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={journals}
          initialNumToRender={10}
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
