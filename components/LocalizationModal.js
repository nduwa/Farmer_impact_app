import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../data/colors";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export const LocalizationModal = ({ setModalOpen, data, setChoice, title }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [fetching, setFetching] = useState(false);

  const handleItemSelection = (id) => {
    setFetching(true);
    for (const item of data) {
      if (item.id === id) {
        setChoice(item);
        setModalOpen(false);
      }
    }
  };
  const handleClick = () => {
    setModalOpen(false);
  };

  const handleBtnClick = (item) => {
    handleItemSelection(item.id);
    setModalOpen(false);
  };

  return (
    <View
      style={{
        flexGrow: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.black_a,
        zIndex: 11,
        pointerEvents: fetching ? "none" : "auto",
      }}
    >
      <View
        style={{
          backgroundColor: colors.white,
          height: screenHeight * 0.8,
          width: screenWidth * 0.9,
          borderRadius: screenWidth * 0.04,
          padding: screenHeight * 0.02,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: screenWidth * 0.055,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          <TouchableOpacity onPress={handleClick}>
            <Ionicons
              name="close-circle-sharp"
              size={screenWidth * 0.08}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <FlatList
          style={{
            width: "100%",
            marginTop: screenHeight * 0.015,
          }}
          initialNumToRender={15}
          contentContainerStyle={{
            marginBottom: 25,
            padding: screenWidth * 0.01,
          }}
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleBtnClick(item)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.white_variant,
                padding: screenWidth * 0.02,
                borderRadius: 10,
                marginBottom: screenHeight * 0.009,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  fontSize: screenHeight * 0.02,
                  width: screenWidth * 0.7,
                }}
              >
                {item.name}
              </Text>
              <AntDesign
                name="right"
                size={screenHeight * 0.02}
                color="black"
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};
