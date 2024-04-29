import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { HistoryCard } from "../../components/HistoryCard";
import { useEffect, useState } from "react";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { dbQueries } from "../../data/dbQueries";

export const HistoryScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const [history, setHistory] = useState([]);

  const getAction = (item) => {
    let action = "";
    if (
      item.transactions === "rtc_transactions" ||
      item.transactions === "rtc_inspections"
    )
      action = "Submitted";

    return action;
  };
  const getAbout = (item) => {
    let about = "";
    if (item.transactions === "rtc_transactions") {
      about = "transactions";
    } else if (item.transactions === "rtc_inspections") {
      about = "inspections";
    }

    return about;
  };
  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  useEffect(() => {
    retrieveDBdata({
      setData: setHistory,
      queryArg: dbQueries.Q_HISTORY,
      tableName: "history",
    });
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
      {history.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={history}
          initialNumToRender={5}
          renderItem={({ item }) => (
            <HistoryCard
              data={{
                action: getAction(item),
                about: getAbout(item),
                quantity: item.num_records,
                period: "7 days",
              }}
            />
          )}
          keyExtractor={(item) => history.indexOf(item)}
        />
      )}
    </View>
  );
};
