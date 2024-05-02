import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import ScTransactionItem from "../../components/ScTransactionItem";
import { InspectionRecordItems } from "../../components/InspectionRecordItem";
import React, { useEffect, useState } from "react";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { InspectionHistoryCard } from "../../components/InspectionHistoryCard";

export const HistoryDetails = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [displayData, setDisplayData] = useState([]);

  const handleBackButton = () => {
    navigation.navigate("HistoryScreen", { data: null });
  };

  const { data = null } = route.params;

  function formatDate(date) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    let theDate = new Date(date);

    return theDate.toLocaleDateString("en-US", options);
  }

  const dateExtraction = (str) => {
    let substr = str.substring(str.length - 6);

    let year = `20${substr.substring(0, 2)}`;
    let month = substr.substring(4);
    let day = substr.substring(2, 4);

    return `${day}/${month}/${year}`;
  };

  const getTableName = (str) => {
    let tableName = "";
    if (str === "transactions") {
      tableName = "rtc_transactions";
    } else if (str === "inspections") {
      tableName = "rtc_inspections";
    }
    return tableName;
  };

  useFocusEffect(
    React.useCallback(() => {
      const initData = async () => {
        retrieveDBdataAsync({
          tableName: getTableName(data),
          filterCol: "uploaded",
          filterValue: "1",
        })
          .then((result) => {
            if (result.length > 0) {
              setDisplayData(result);
            }
          })
          .catch((error) => console.log(error));
      };

      initData();
      return () => {};
    }, [navigation])
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
          History Details
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>

      <View style={{ flex: 1, padding: 12 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.white,
            padding: screenHeight * 0.02,
            borderRadius: screenHeight * 0.01,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: screenHeight * 0.02, fontWeight: "700" }}>
            {data.toUpperCase()}
          </Text>
        </View>
        {displayData.length > 0 && data === "transactions" && (
          <FlatList
            contentContainerStyle={{ padding: 12, gap: 9 }}
            data={displayData}
            initialNumToRender={5}
            renderItem={({ item }) => (
              <ScTransactionItem
                kgsGood={item.kilograms}
                kgsBad={item.bad_kilograms}
                priceGood={item.unitprice}
                priceBad={item.bad_unit_price}
                trDate={dateExtraction(item.site_day_lot)}
                cashTotal={item.cash_paid + item.total_mobile_money_payment}
                farmerId={item.farmerid === "" ? "FARMER" : item.farmerid}
                farmerNames={item.farmername}
                lotnumber={item.lotnumber}
                coffeeVal={item.kilograms * item.unitprice}
                coffeeType={item.coffee_type}
                deleteFn={null}
                receiptId={item.paper_receipt}
                routeData={null}
                inActive={true}
              />
            )}
            keyExtractor={(item) => item.paper_receipt}
          />
        )}

        {displayData.length > 0 && data === "inspections" && (
          <FlatList
            contentContainerStyle={{ padding: 12, gap: 9 }}
            data={displayData}
            initialNumToRender={5}
            renderItem={({ item }) => (
              <InspectionHistoryCard
                data={{
                  householdId: item._kf_Household,
                  insp_type: item.Score_n,
                  date: formatDate(item.created_at),
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
};
