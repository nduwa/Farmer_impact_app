import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScSummaryItem } from "../../components/ScSummaryItem";
import CustomButton from "../../components/CustomButton";
import { ScTransactionItem } from "../../components/ScTransactionItem";

export const ScJournalsSummary = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const [folded, setFolded] = useState(true);

  const toggleFold = () => {
    setFolded(!folded);
  };

  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY > 260) setFolded(true);
  };

  const handleBackButton = () => {
    navigation.navigate("ScDailyJournal");
  };

  const handleSubmit = () => {};

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
            fontSize: screenWidth * 0.05,
            marginLeft: screenWidth * 0.2,
          }}
        >
          SC Daily Journals
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          marginTop: screenHeight * 0.02,
          paddingHorizontal: screenWidth * 0.02,
          gap: 10,
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: screenWidth * 0.035,
            width: "100%",
            minHeight: screenHeight * 0.09,
            elevation: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
              Summary - 19/04/2023
            </Text>
            {folded ? (
              <TouchableOpacity onPress={toggleFold}>
                <FontAwesome5
                  name="angle-down"
                  size={screenWidth * 0.07}
                  color="black"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={toggleFold}>
                <FontAwesome5
                  name="angle-up"
                  size={screenWidth * 0.07}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
          {!folded && (
            <View
              style={{
                width: "100%",
                gap: 8,
                marginTop: screenHeight * 0.02,
                justifyContent: "center",
              }}
            >
              <ScSummaryItem header={"Date"} label={"19/04/2023"} />
              <ScSummaryItem header={"Transactions"} label={"5"} />
              <ScSummaryItem header={"Certified"} label={"58Kg(s)"} />
              <ScSummaryItem header={"Uncertified"} label={"0Kg(s)"} />
              <ScSummaryItem header={"Floaters"} label={"23Kg(s)"} />
              <ScSummaryItem header={"Total Payment"} label={"RWF 7305"} />

              <CustomButton
                bg={colors.secondary}
                color={"white"}
                width="100%"
                text="Submmit Journal"
                bdcolor="transparent"
                mt={8}
                mb={8}
                radius={10}
                disabled={indicatorVisible}
                onPress={handleSubmit}
              />
            </View>
          )}
        </View>
        <ScrollView
          onScroll={handleScroll}
          contentContainerStyle={{
            width: "100%",
            padding: 5,
            gap: screenWidth * 0.03,
          }}
        >
          <ScTransactionItem />
          <ScTransactionItem />
          <ScTransactionItem />
          <ScTransactionItem />
        </ScrollView>
      </View>
    </View>
  );
};
