import React, { useEffect, useState } from "react";
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

export const GroupsModal = ({ setModalOpen, data, setGroupChoice }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [selectedGroupID, setSelectedGroupID] = useState(null);
  const [fetching, setFetching] = useState(false);

  const handleGroupSelection = () => {
    setFetching(true);
    for (const group of data) {
      if (group.__kp_Group === selectedGroupID) {
        setGroupChoice(group);
        setModalOpen(false);
      }
    }
  };
  const handleClick = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (selectedGroupID) handleGroupSelection();
  }, [selectedGroupID]);
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
              setGroupChoice={setSelectedGroupID}
              groupID={item.ID_GROUP.trim()}
              groupName={item.Name.trim() || null}
              groupKpID={item.__kp_Group}
              setModalOpen={setModalOpen}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};
