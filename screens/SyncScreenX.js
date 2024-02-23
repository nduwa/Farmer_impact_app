import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../data/colors";
import { StatusBar } from "expo-status-bar";
import { SyncItem } from "../components/SyncItem";

export const SyncScreenX = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [sycnList, setSyncList] = useState([
    { table: "stations", status: false },
    { table: "groups", status: false },
    { table: "farmers", status: false },
    { table: "households", status: false },
    { table: "cells", status: false },
    { table: "trainingModules", status: false },
    { table: "inspectionQuestions", status: false },
    { table: "crops", status: false },
  ]);

  const handleBackButton = () => {};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
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
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.white,
            padding: 5,
          }}
        >
          <AntDesign name="left" size={30} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
            marginLeft: screenWidth * 0.12,
          }}
        >
          Data Synchronization
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: screenHeight * 0.35,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              gap: 12,
              width: screenWidth * 0.7,
              height: "70%",
              backgroundColor: colors.white,
              elevation: 3,
              borderBottomLeftRadius: screenWidth,
              borderBottomRightRadius: screenWidth,
            }}
          >
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 24,
                }}
              >
                Stations
              </Text>
              <Text
                style={{ textAlign: "center", fontWeight: "300", fontSize: 12 }}
              >
                ... data batch 1 completed ...
              </Text>
            </View>

            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 40,
                color: colors.secondary_variant,
              }}
            >
              87%
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 10,
            gap: screenHeight * 0.02,
          }}
        >
          <SyncItem name={"Stations"} isDone={sycnList[0].status} />
          <SyncItem name={"Groups"} isDone={sycnList[1].status} />
          <SyncItem name={"Farmers"} isDone={sycnList[2].status} />
          <SyncItem name={"Households"} isDone={sycnList[3].status} />
          <SyncItem name={"Cells"} isDone={sycnList[4].status} />
          <SyncItem name={"Training modules"} isDone={sycnList[5].status} />
          <SyncItem name={"Inspection questions"} isDone={sycnList[6].status} />
          <SyncItem name={"Farmers crops"} isDone={sycnList[7].status} />
        </View>
      </View>
    </View>
  );
};
