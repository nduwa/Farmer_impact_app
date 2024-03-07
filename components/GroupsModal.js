import React, { useEffect } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GroupCard } from "./GroupCard";
import { colors } from "../data/colors";
import { Ionicons } from "@expo/vector-icons";

export const GroupsModal = ({ setModalOpen, data }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleClick = () => {
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
        zIndex: 10,
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
            Groups
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
          contentContainerStyle={{
            marginBottom: 25,
            padding: screenWidth * 0.03,
          }}
          data={data}
          renderItem={({ item }) => (
            <GroupCard
              groupID={item.ID_GROUP.trim()}
              groupName={item.Name.trim() || null}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};
